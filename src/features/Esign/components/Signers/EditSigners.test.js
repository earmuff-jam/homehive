import React from "react";

import { useForm } from "react-hook-form";

import EditSigners from "./EditSigners";
import { render, screen } from "@testing-library/react";

// small wrapper to provide RHF context
const renderComponent = (defaultValues) => {
  const Wrapper = () => {
    const {
      control,
      formState: { errors },
    } = useForm({
      defaultValues,
      mode: "onChange",
    });

    return <EditSigners control={control} errors={errors} />;
  };

  return render(<Wrapper />);
};

describe("EditSigners Tests", () => {
  describe("Snapshot Tests", () => {
    it("matches snapshot", () => {
      const { container } = renderComponent({
        name: "Jane Smith",
        email_address: "jane_doe47@gmail.com",
      });

      expect(container).toMatchSnapshot();
    });
  });

  describe("Component Tests", () => {
    it("renders form fields with prefilled values", () => {
      renderComponent({
        name: "Jane Smith",
        email_address: "jane_doe47@gmail.com",
      });

      expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("jane_doe47@gmail.com"),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(/the name of the signer/i),
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(/the email address of the signer/i),
      ).toBeInTheDocument();
    });
  });
});
