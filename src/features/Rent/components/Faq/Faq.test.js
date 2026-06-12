import React from "react";

import Faq from "./Faq";
import { render } from "@testing-library/react";

jest.mock("common/FaqDetails", () => (props) => (
  <div data-testid="faq-details">
    {props.data.map((item, idx) => (
      <div key={idx}>
        <span>{item.q}</span>
        <span>{item.ans}</span>
      </div>
    ))}
  </div>
));

describe("Faq", () => {
  it("passes faq items to FaqDetails", () => {
    const { getByText } = render(<Faq />);

    expect(getByText("How can I create a new property?")).toBeInTheDocument();

    expect(
      getByText(
        'Click on "Add Property" button and ensure all fields are filled out. Press submit when done.',
      ),
    ).toBeInTheDocument();
  });

  it("renders via FaqDetails wrapper", () => {
    const { getByTestId } = render(<Faq />);
    expect(getByTestId("faq-details")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<Faq />);
    expect(container).toMatchSnapshot();
  });
});
