import React from "react";

import { useForm } from "react-hook-form";

import TenantEmailAutocomplete from "./TenantEmailAutocomplete";
import { render, screen } from "@testing-library/react";

jest.mock("features/Api/tenantsApi", () => ({
  useGetTenantListQuery: () => ({
    data: [],
    isLoading: false,
  }),
  useLazyGetTenantListQuery: () => [
    jest.fn(),
    {
      data: [],
      isLoading: false,
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
      setError={jest.fn()}
      clearErrors={jest.fn()}
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
