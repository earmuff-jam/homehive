import React from "react";

import ExternalIntegrations from "./ExternalIntegrations";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Rent/components/StripeConnect/StripeConnect", () => ({
  __esModule: true,
  default: () => <div data-testid="stripe-connect" />,
}));

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
