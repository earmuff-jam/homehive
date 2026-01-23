import React from "react";

import CustomSnackbar from "./CustomSnackbar";
import { fireEvent, render, screen } from "@testing-library/react";

describe("CustomSnackbar Jest tests", () => {
  describe("CustomSnackbar Snapshot tests", () => {
    it("renders correctly and matches snapshot", () => {
      const { asFragment } = render(
        <CustomSnackbar
          showSnackbar={true}
          setShowSnackbar={jest.fn()}
          title="Success!"
          caption="View details"
        />,
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
  describe("CustomSnackbar Component tests", () => {
    it("renders title and caption when open", () => {
      render(
        <CustomSnackbar
          showSnackbar={true}
          setShowSnackbar={jest.fn()}
          title="Success!"
          caption="View details"
        />,
      );

      expect(screen.getByText("Success!")).toBeInTheDocument();
      expect(screen.getByText("View details")).toBeInTheDocument();
    });

    it("does not render when showSnackbar is false", () => {
      render(
        <CustomSnackbar
          showSnackbar={false}
          setShowSnackbar={jest.fn()}
          title="Hidden"
          caption="Should not render"
        />,
      );

      expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    });

    it("calls setShowSnackbar(false) when alert is closed", () => {
      const setShowSnackbar = jest.fn();

      render(
        <CustomSnackbar
          showSnackbar={true}
          setShowSnackbar={setShowSnackbar}
          title="Closable"
          caption="Close"
        />,
      );

      // MUI Alert close button has aria-label="Close"
      fireEvent.click(screen.getByLabelText(/close/i));

      expect(setShowSnackbar).toHaveBeenCalledWith(false);
    });

    it("calls onClick when caption is clicked", () => {
      const onClick = jest.fn();

      render(
        <CustomSnackbar
          showSnackbar={true}
          setShowSnackbar={jest.fn()}
          title="Clickable"
          caption="Click me"
          onClick={onClick}
        />,
      );

      fireEvent.click(screen.getByText("Click me"));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
