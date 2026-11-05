import React from "react";

import WidgetContentWrapper from "./WidgetContentWrapper";
import { render } from "@testing-library/react";
import { WidgetTypeProps } from "features/Invoice/constants";
import { describe, expect, it } from "vitest";

describe("WidgetContentWrapper", () => {
  const data = [];

  it.each([
    WidgetTypeProps.TimelineChart,
    WidgetTypeProps.TaxChart,
    WidgetTypeProps.ServiceChart,
    WidgetTypeProps.DetailsTable,
  ])("renders content for %s", (type) => {
    const { container } = render(
      <WidgetContentWrapper widget={{ type }} data={data} />,
    );

    expect(container.firstChild).not.toBeNull();
  });

  it("renders nothing for an unknown widget type", () => {
    const { container } = render(
      <WidgetContentWrapper widget={{ type: "unknown" }} data={data} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when widget is undefined", () => {
    const { container } = render(<WidgetContentWrapper data={data} />);

    expect(container.firstChild).toBeNull();
  });
});
