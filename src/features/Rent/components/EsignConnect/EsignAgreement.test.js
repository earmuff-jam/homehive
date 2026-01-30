import React from "react";

import { useForm } from "react-hook-form";

import EsignAgreement from "./EsignAgreement";
import { render, screen } from "@testing-library/react";

jest.mock("common/AButton", () => ({
  __esModule: true,
  default: ({ label, disabled, ...props }) => (
    <button disabled={disabled} {...props}>
      {label}
    </button>
  ),
}));

function EsignAgreementWithDefaultValues({ isEsignLinkDisabled = false }) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      noComplianceDisclaimerAgreement: false,
      noLegalAdviceDisclaimerAgreement: false,
    },
  });

  return (
    <EsignAgreement
      control={control}
      onSubmit={handleSubmit(jest.fn())}
      isEsignLinkDisabled={isEsignLinkDisabled}
      isButtonComponentLoading={false}
    />
  );
}

describe("Esign Agreement Component tests", () => {
  describe("snapshot tests", () => {
    it("matches snapshot when not connected", () => {
      const { asFragment } = render(<EsignAgreementWithDefaultValues />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("EsignAgreement component tests", () => {
    test("renders Link Esign button", () => {
      render(<EsignAgreementWithDefaultValues />);

      expect(
        screen.getByRole("button", { name: /link esign/i }),
      ).toBeInTheDocument();
    });

    test("disables Link Esign button when isEsignLinkDisabled is true", () => {
      render(<EsignAgreementWithDefaultValues isEsignLinkDisabled={true} />);

      const button = screen.getByRole("button", { name: /link esign/i });

      expect(button).toBeDisabled();
    });

    test("enables Link Esign button when isEsignLinkDisabled is false", () => {
      render(<EsignAgreementWithDefaultValues isEsignLinkDisabled={false} />);

      const button = screen.getByRole("button", { name: /link esign/i });

      expect(button).toBeEnabled();
    });
  });
});
