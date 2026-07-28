import React from "react";

import { useForm } from "react-hook-form";

import TenantEmailAutocomplete from "./TenantEmailAutocomplete";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("features/Api/tenantsApi", () => ({
  useGetTenantListQuery: () => ({
    data: [],
    isLoading: false,
  }),
  useLazyGetTenantListQuery: () => [
    vi.fn(),
    {
      data: [],
      isLoading: false,
    },
  ],
}));

function Wrapper() {
  const { control } = useForm({
    defaultValues: {
      email: "",
    },
  });

  return (
    <TenantEmailAutocomplete
      control={control}
      errors={{}}
      setError={vi.fn()}
      clearErrors={vi.fn()}
    />
  );
}

describe("TenantEmailAutocomplete", () => {
  it("matches snapshot", () => {
    const { container } = render(<Wrapper />);
    expect(container).toMatchSnapshot();
  });

  it("renders input", () => {
    render(<Wrapper />);

    expect(screen.getByLabelText("Tenant Email Address *")).toBeInTheDocument();
  });
});
