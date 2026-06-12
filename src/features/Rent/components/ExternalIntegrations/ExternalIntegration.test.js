import React from "react";

import ExternalIntegrations from "./ExternalIntegrations";
import { render, screen } from "@testing-library/react";

jest.mock("features/Rent/components/StripeConnect/StripeConnect", () => () => (
  <div data-testid="stripe-connect" />
));

describe("ExternalIntegrations", () => {
  it("renders StripeConnect", () => {
    render(<ExternalIntegrations />);

    expect(screen.getByTestId("stripe-connect")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<ExternalIntegrations />);
    expect(container).toMatchSnapshot();
  });
});
