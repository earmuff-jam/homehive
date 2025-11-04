import React from "react";

import FaqDetails from "./FaqDetails";
import { HelpOutline } from "@mui/icons-material";
import { fireEvent, render, screen } from "@testing-library/react";

describe("FaqDetails component tests", () => {
  test("it should render and pass all snapshot tests", () => {
    const { asFragment } = render(<FaqDetails />);
    expect(asFragment()).toMatchSnapshot();
  });
  describe("it should render and pass all component tests", () => {
    const mockData = [
      {
        q: "What is Invoicer?",
        ans: "Invoicer is a billing app for landlords.",
        icon: <HelpOutline data-testid="faq-icon-1" />,
      },
      {
        q: "How do I add a tenant?",
        ans: "Go to the tenants page and click add tenant.",
        icon: <HelpOutline data-testid="faq-icon-2" />,
      },
    ];

    // check the first render here because of how we are spreading the
    // sxProps on RowHeader component, mui tries to copy node elements during test.
    test("renders the FAQ header and questions", () => {
      render(<FaqDetails data={mockData} />);

      expect(
        screen.getAllByText("Frequently asked questions")[0],
      ).toBeInTheDocument();
      expect(
        screen.getAllByText("Answers to common questions you may have.")[0],
      ).toBeInTheDocument();

      expect(screen.getByText("What is Invoicer?")).toBeInTheDocument();
      expect(screen.getByText("How do I add a tenant?")).toBeInTheDocument();
    });

    test("expands and collapses accordion", () => {
      render(<FaqDetails data={mockData} />);

      const firstAnswer = screen.getByText(
        "Invoicer is a billing app for landlords.",
      );
      // First one is expanded by default
      expect(firstAnswer).toBeVisible();

      const secondQuestion = screen.getByText("How do I add a tenant?");
      fireEvent.click(secondQuestion);

      const secondAnswer = screen.getByText(
        "Go to the tenants page and click add tenant.",
      );
      expect(secondAnswer).toBeVisible();
    });
  });
});
