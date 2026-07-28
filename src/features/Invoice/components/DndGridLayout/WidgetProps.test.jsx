import React from "react";

import WidgetProps from "./WidgetProps";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Invoice/components/Widgets/DetailsTableView", () => ({
  default: () => <div>Mocked DetailsTableView</div>,
}));

vi.mock("features/Invoice/components/Widgets/InvoiceTimelineChart", () => ({
  default: () => <div>Mocked InvoiceTimelineChart</div>,
}));

vi.mock("features/Invoice/components/Widgets/InvoiceTrends", () => ({
  default: () => <div>Mocked InvoiceTrendsChart</div>,
}));

vi.mock("features/Invoice/components/Widgets/ItemTypeFreqChart", () => ({
  default: () => <div>Mocked ItemTypeFreqChart</div>,
}));

describe("WidgetProps", () => {
  const baseWidget = { label: "Label", caption: "Caption" };

  it("renders InvoiceTimelineChart when id=1", () => {
    const { asFragment, getByText } = render(
      WidgetProps({ ...baseWidget, id: 1 }),
    );
    expect(getByText(/Mocked InvoiceTimelineChart/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders InvoiceTrendsChart when id=2", () => {
    const { asFragment, getByText } = render(
      WidgetProps({ ...baseWidget, id: 2 }),
    );
    expect(getByText(/Mocked InvoiceTrendsChart/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders ItemTypeFreqChart when id=3", () => {
    const { asFragment, getByText } = render(
      WidgetProps({ ...baseWidget, id: 3 }),
    );
    expect(getByText(/Mocked ItemTypeFreqChart/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders DetailsTableView when id=4", () => {
    const { asFragment, getByText } = render(
      WidgetProps({ ...baseWidget, id: 4 }),
    );
    expect(getByText(/Mocked DetailsTableView/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders null for unknown id", () => {
    const { asFragment, container } = render(
      WidgetProps({ ...baseWidget, id: 999 }),
    );
    expect(container.firstChild).toBeNull();
    expect(asFragment()).toMatchSnapshot();
  });
});
