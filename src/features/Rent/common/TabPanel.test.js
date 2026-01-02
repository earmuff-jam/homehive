import React from "react";

import TabPanel from "./TabPanel";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock MUI hooks
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useTheme: () => ({ breakpoints: { down: () => false } }),
    useMediaQuery: () => false,
  };
});

const mockOptions = [
  {
    id: 1,
    title: "Option 1",
  },
  {
    id: 2,
    title: "Option 2",
  },
];

describe("TabPanel Jest tests", () => {
  describe("TabPanel Snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <TabPanel
          selected="tab1"
          options={mockOptions}
          updateSelected={jest.fn()}
        />,
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("TabPanel Component tests", () => {
    const options = {
      tab1: { label: "Tab One", icon: <span>Icon1</span> },
      tab2: { label: "Tab Two", icon: <span>Icon2</span> },
    };

    it("renders all buttons with correct labels", () => {
      render(
        <TabPanel
          selected="tab1"
          options={options}
          updateSelected={() => {}}
        />,
      );

      expect(screen.getByText("Tab One")).toBeInTheDocument();
      expect(screen.getByText("Tab Two")).toBeInTheDocument();
    });

    it("applies 'contained' variant to selected tab", () => {
      render(
        <TabPanel
          selected="tab1"
          options={options}
          updateSelected={() => {}}
        />,
      );

      const tabOneButton = screen.getByText("Tab One").closest("button");
      const tabTwoButton = screen.getByText("Tab Two").closest("button");

      expect(tabOneButton).toHaveClass("MuiButton-contained");
      expect(tabTwoButton).toHaveClass("MuiButton-outlined");
    });

    it("calls updateSelected with correct key when a button is clicked", () => {
      const updateSelectedMock = jest.fn();
      render(
        <TabPanel
          selected="tab1"
          options={options}
          updateSelected={updateSelectedMock}
        />,
      );

      const tabTwoButton = screen.getByText("Tab Two").closest("button");
      fireEvent.click(tabTwoButton);

      expect(updateSelectedMock).toHaveBeenCalledWith("tab2");
    });
  });
});
