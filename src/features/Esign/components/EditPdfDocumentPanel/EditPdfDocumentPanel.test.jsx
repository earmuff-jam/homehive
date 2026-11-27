import React from "react";

import { useForm } from "react-hook-form";

import EditPdfDocumentPanel from "./EditPdfDocumentPanel";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ACTIVE_FORM_TYPE_ENUM_VALUES } from "features/Esign/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("common/AButton", () => ({
  default: ({ label, onClick, disabled, ...props }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {label}
    </button>
  ),
}));

vi.mock("common/AIconButton", () => ({
  default: ({ onClick, label, ...props }) => (
    <button
      type="button"
      data-testid="icon-button"
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  ),
}));

describe("EditPdfDocumentPanel", () => {
  let handleSelectSigner;
  let handleSelectFieldType;
  let addFollowUpSigners;
  let handleRemoveSigner;
  let signers;
  let signerFields;

  const creator = {
    id: "creator",
    role: "Creator",
    color: "#0E7C6B",
  };

  const tenant = {
    id: "tenant_1",
    role: "Tenant",
    color: "#3D4B72",
  };

  const defaultValues = {
    signers: [
      {
        name: "John Doe",
        email_address: "john@example.com",
      },
      {
        name: "Jane Doe",
        email_address: "jane@example.com",
      },
    ],
  };

  const TestWrapper = ({ values = defaultValues, ...props }) => {
    const { control, formState, trigger } = useForm({
      mode: "onChange",
      defaultValues: values,
    });

    return (
      <>
        <EditPdfDocumentPanel
          control={control}
          errors={formState.errors}
          {...props}
        />

        <button type="button" onClick={() => trigger()}>
          Validate
        </button>
      </>
    );
  };

  const renderComponent = (props = {}) => {
    return render(
      <TestWrapper
        signerFields={signerFields}
        signers={signers}
        handleSelectSigner={handleSelectSigner}
        handleSelectFieldType={handleSelectFieldType}
        activeSigner={null}
        activeFieldType={ACTIVE_FORM_TYPE_ENUM_VALUES.Signature}
        addFollowUpSigners={addFollowUpSigners}
        handleRemoveSigner={handleRemoveSigner}
        {...props}
      />,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    handleSelectSigner = vi.fn();
    handleSelectFieldType = vi.fn();
    addFollowUpSigners = vi.fn();
    handleRemoveSigner = vi.fn();

    signers = [creator, tenant];

    signerFields = [
      {
        fieldId: "field_1",
        role: "Creator",
      },
      {
        fieldId: "field_2",
        role: "Tenant",
      },
    ];
  });

  it("renders the signer information section", () => {
    renderComponent();

    expect(screen.getByText("Signer Information")).toBeTruthy();
    expect(screen.getByText("Manage document signers")).toBeTruthy();
    expect(screen.getByText("Add Signer")).toBeTruthy();
  });

  it("renders all signer cards", () => {
    renderComponent();

    expect(screen.getByText("Creator")).toBeTruthy();
    expect(screen.getByText("Tenant")).toBeTruthy();
  });

  it("renders the signer form fields", () => {
    renderComponent();

    expect(screen.getAllByLabelText("Full Name")).toHaveLength(2);
    expect(screen.getAllByLabelText("Email Address")).toHaveLength(2);
  });

  it("renders the initial signer values", () => {
    renderComponent();

    expect(screen.getAllByLabelText("Full Name")[0].value).toBe("John Doe");

    expect(screen.getAllByLabelText("Email Address")[0].value).toBe(
      "john@example.com",
    );

    expect(screen.getAllByLabelText("Full Name")[1].value).toBe("Jane Doe");

    expect(screen.getAllByLabelText("Email Address")[1].value).toBe(
      "jane@example.com",
    );
  });

  it("shows the default instructions when no signer is active", () => {
    renderComponent();

    expect(
      screen.getByText(/Select a signer, then click and drag on the PDF/),
    ).toBeTruthy();
  });

  it("shows active signer instructions", () => {
    renderComponent({
      activeSigner: tenant,
      activeFieldType: ACTIVE_FORM_TYPE_ENUM_VALUES.Signature,
    });

    expect(screen.getByText("Tenant", { selector: "strong" })).toBeTruthy();

    expect(screen.getByText(/Placing signature for/)).toBeTruthy();
  });

  it("calls handleSelectSigner when a signer card is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Tenant", { selector: "p" }));

    expect(handleSelectSigner).toHaveBeenCalledWith(tenant);
  });

  it("calls handleSelectFieldType with the signature type", () => {
    renderComponent();

    const buttons = screen.getAllByTestId("icon-button");

    fireEvent.click(buttons[0]);

    expect(handleSelectFieldType).toHaveBeenCalledWith(
      creator,
      ACTIVE_FORM_TYPE_ENUM_VALUES.Signature,
    );

    expect(handleSelectSigner).not.toHaveBeenCalled();
  });

  it("calls handleSelectFieldType with the date type", () => {
    renderComponent();

    const buttons = screen.getAllByTestId("icon-button");

    fireEvent.click(buttons[1]);

    expect(handleSelectFieldType).toHaveBeenCalledWith(
      creator,
      ACTIVE_FORM_TYPE_ENUM_VALUES.Date,
    );

    expect(handleSelectSigner).not.toHaveBeenCalled();
  });

  it("does not show a remove button for the creator", () => {
    renderComponent();

    const buttons = screen.getAllByTestId("icon-button");

    // Two field-type buttons for each signer.
    expect(buttons).toHaveLength(4);
  });

  it("shows a remove button for subsequent signers", () => {
    renderComponent();

    // Creator has two field buttons.
    // Tenant has two field buttons and one remove button.
    expect(screen.getAllByTestId("icon-button")).toHaveLength(4);

    // The native MUI remove button is rendered separately.
    const removeButtons = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg")?.getAttribute("data-testid") ===
          "CancelRoundedIcon",
      );

    expect(removeButtons).toHaveLength(1);
  });

  it("removes a signer when the remove button is clicked", () => {
    renderComponent();

    const removeButton = screen
      .getAllByRole("button")
      .find(
        (button) =>
          button.querySelector("svg")?.getAttribute("data-testid") ===
          "CancelRoundedIcon",
      );

    fireEvent.click(removeButton);

    expect(handleRemoveSigner).toHaveBeenCalledWith("tenant_1");
    expect(handleSelectSigner).not.toHaveBeenCalled();
  });

  it("calls addFollowUpSigners when Add Signer is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Add Signer"));

    expect(addFollowUpSigners).toHaveBeenCalledOnce();
  });

  it("disables Add Signer when there are five signers", () => {
    signers = [
      creator,
      tenant,
      { id: "tenant_2", role: "Tenant 2", color: "#123456" },
      { id: "tenant_3", role: "Tenant 3", color: "#123456" },
      { id: "tenant_4", role: "Tenant 4", color: "#123456" },
    ];

    renderComponent();

    expect(screen.getByText("Add Signer").disabled).toBe(true);
  });

  it("enables Add Signer when there are fewer than five signers", () => {
    renderComponent();

    expect(screen.getByText("Add Signer").disabled).toBe(false);
  });

  it("uses signerFields as a fallback when a signer is missing", () => {
    signers = [creator];

    renderComponent();

    expect(screen.getByText("Tenant")).toBeTruthy();
  });

  it("updates the full name field", () => {
    renderComponent();

    const input = screen.getAllByLabelText("Full Name")[0];

    fireEvent.change(input, {
      target: { value: "Updated Name" },
    });

    expect(input.value).toBe("Updated Name");
  });

  it("updates the email address field", () => {
    renderComponent();

    const input = screen.getAllByLabelText("Email Address")[0];

    fireEvent.change(input, {
      target: { value: "updated@example.com" },
    });

    expect(input.value).toBe("updated@example.com");
  });

  it("validates required full name fields", async () => {
    renderComponent({
      values: {
        signers: [
          {
            name: "",
            email_address: "john@example.com",
          },
          {
            name: "Jane Doe",
            email_address: "jane@example.com",
          },
        ],
      },
    });

    fireEvent.click(screen.getByText("Validate"));

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeTruthy();
    });
  });

  it("validates required email address fields", async () => {
    renderComponent({
      values: {
        signers: [
          {
            name: "John Doe",
            email_address: "",
          },
          {
            name: "Jane Doe",
            email_address: "jane@example.com",
          },
        ],
      },
    });

    fireEvent.click(screen.getByText("Validate"));

    await waitFor(() => {
      expect(screen.getByText("Email address is required")).toBeTruthy();
    });
  });

  it("validates that full names contain more than three characters", async () => {
    renderComponent({
      values: {
        signers: [
          {
            name: "Joe",
            email_address: "john@example.com",
          },
          {
            name: "Jane Doe",
            email_address: "jane@example.com",
          },
        ],
      },
    });

    fireEvent.click(screen.getByText("Validate"));

    await waitFor(() => {
      expect(
        screen.getByText("Full name must be more than 3 characters"),
      ).toBeTruthy();
    });
  });

  it("validates that email addresses contain more than three characters", async () => {
    renderComponent({
      values: {
        signers: [
          {
            name: "John Doe",
            email_address: "abc",
          },
          {
            name: "Jane Doe",
            email_address: "jane@example.com",
          },
        ],
      },
    });

    fireEvent.click(screen.getByText("Validate"));

    await waitFor(() => {
      expect(
        screen.getByText("Email address must be more than 3 characters"),
      ).toBeTruthy();
    });
  });

  it("validates the maximum length of the full name", async () => {
    renderComponent({
      values: {
        signers: [
          {
            name: "A".repeat(301),
            email_address: "john@example.com",
          },
          {
            name: "Jane Doe",
            email_address: "jane@example.com",
          },
        ],
      },
    });

    fireEvent.click(screen.getByText("Validate"));

    await waitFor(() => {
      expect(
        screen.getByText("Full name should be less than 300 characters"),
      ).toBeTruthy();
    });
  });

  it("validates the maximum length of the email address", async () => {
    renderComponent({
      values: {
        signers: [
          {
            name: "John Doe",
            email_address: "a".repeat(301),
          },
          {
            name: "Jane Doe",
            email_address: "jane@example.com",
          },
        ],
      },
    });

    fireEvent.click(screen.getByText("Validate"));

    await waitFor(() => {
      expect(
        screen.getByText("Email address should be less than 300 characters"),
      ).toBeTruthy();
    });
  });

  it("does not show validation errors for valid signer information", async () => {
    renderComponent();

    fireEvent.click(screen.getByText("Validate"));

    await waitFor(() => {
      expect(screen.queryByText("Full name is required")).toBeNull();

      expect(screen.queryByText("Email address is required")).toBeNull();
    });
  });
});
