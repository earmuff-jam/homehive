import React from "react";

import Faq from "./Faq";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { faqDetailsMock } = vi.hoisted(() => ({
  faqDetailsMock: vi.fn(),
}));

vi.mock("common/FaqDetails", () => ({
  default: (props) => {
    faqDetailsMock(props);

    return (
      <div data-testid="faq-details">
        {props.data.map((item) => (
          <div key={item.q}>
            <span>{item.q}</span>
            <span>{item.ans}</span>
            <span>{item.icon.type.name}</span>
          </div>
        ))}
      </div>
    );
  },
}));

describe("Faq", () => {
  it("renders FaqDetails", () => {
    render(<Faq />);

    expect(screen.getByTestId("faq-details")).toBeTruthy();
  });

  it("passes all seven FAQ items to FaqDetails", () => {
    render(<Faq />);

    const [props] = faqDetailsMock.mock.calls[0];

    expect(props.data).toHaveLength(7);
  });

  it("passes the expected questions and answers", () => {
    render(<Faq />);

    const [props] = faqDetailsMock.mock.calls[0];

    expect(props.data.map(({ q }) => q)).toEqual([
      "How can I create a new Electronic Signature?",
      "Do I have to purchase tokens to send electronic signatures?",
      "How to add signers to the selected document?",
      "Can we use the default provided templates?",
      "What is the difference between creator and other signers?",
      "Do you send reminders if the document is not signed?",
      "Is there a guide that I can follow?",
    ]);

    expect(
      props.data.every(({ ans }) => typeof ans === "string" && ans.length > 0),
    ).toBe(true);
  });

  it("provides an icon for every FAQ item", () => {
    render(<Faq />);

    const [props] = faqDetailsMock.mock.calls[0];

    expect(props.data.every(({ icon }) => React.isValidElement(icon))).toBe(
      true,
    );
  });

  it("renders the FAQ questions and answers", () => {
    render(<Faq />);

    expect(
      screen.getByText("How can I create a new Electronic Signature?"),
    ).toBeTruthy();

    expect(
      screen.getByText(/Each prepared document - 'Envelope' cost 1 token/),
    ).toBeTruthy();

    expect(
      screen.getByText(/Creators are the original owners of the document/),
    ).toBeTruthy();

    expect(screen.getByText(/automatic email reminders/)).toBeTruthy();
  });
});
