import React from "react";

import ViewSigners from "./ViewSigners";
import { render, screen } from "@testing-library/react";

describe("ViewSigners Tests", () => {
  describe("ViewSigners Snapshot Tests", () => {
    it("matches snapshot", () => {
      const { container } = render(
        <ViewSigners
          signers={[
            {
              id: "creator",
              role: "Creator",
              email_address: "test@mail.com",
              color: "#2563eb",
            },
          ]}
          signatureBoxes={[{ id: "box1" }]}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });

  describe("ViewSigners Component Tests", () => {
    const baseSigner = [
      {
        id: "creator",
        role: "Creator",
        name: "Jane Doe",
        email_address: "jane_doe47@gmail.com",
        color: "#2563eb",
      },
    ];

    const baseBox = [
      {
        id: "box1",
      },
    ];

    it("renders assigned signers", () => {
      render(<ViewSigners signers={baseSigner} signatureBoxes={baseBox} />);

      expect(screen.getByText("Assigned Signers:")).toBeInTheDocument();
      expect(screen.getByText("Creator")).toBeInTheDocument();
      expect(screen.getByText("jane_doe47@gmail.com")).toBeInTheDocument();
    });

    it("shows success alert when counts match", () => {
      render(<ViewSigners signers={baseSigner} signatureBoxes={baseBox} />);

      expect(screen.getByText(/Found 1 signature boxes/i)).toBeInTheDocument();
    });

    it("shows mismatch error when counts differ", () => {
      render(<ViewSigners signers={baseSigner} signatureBoxes={[]} />);

      expect(
        screen.getByText(/You have 1 signers but only 0 signature boxes/i),
      ).toBeInTheDocument();
    });

    it("shows missing fields error when email is missing", () => {
      render(
        <ViewSigners
          signers={[
            {
              id: "creator",
              role: "Creator",
              name: "Jane doe",
              email_address: "", // missing email
              color: "#2563eb",
            },
          ]}
          signatureBoxes={baseBox}
        />,
      );

      expect(screen.getByText(/Missing required fields/i)).toBeInTheDocument();
    });
  });
});
