// StripeUserStatusEnums ...
export const StripeUserStatusEnums = {
  SUCCESS: {
    type: "success",
    label: "Success",
    message: "Stripe Account is connected and ready",
  },
  FAILURE: {
    type: "error",
    label: "Failed",
    message: "Stripe account setup is incomplete.",
  },
} as const;

// StripeUserFailureEnums ...
export const StripeUserFailureEnums = {
  MISSING_BUSINESS_DETAILS:
    "Missing required business or individual information.",
  MISSING_ID_VERIFICATION:
    "Identity verification documents are still pending or missing.",
  MISSING_BANK_ACCOUNT: "Bank account information has not been provided.",
  UNACCEPTED_TOS: "Terms of Service have not been accepted yet.",
  PENDING_STRIPE_REVIEW:
    "Verification is still pending. Ensure you have submitted all your required documents.",
  GENERIC_INCOMPLETE_SETUP:
    "Your Stripe account setup is incomplete. Please finish onboarding.",
} as const;

// getStripeFailureReasons ...
export const getStripeFailureReasons = (account) => {
  const reasons = [];

  const req = account.requirements || {};
  const pending = req.pending_verification || [];
  const due = req.currently_due || [];
  const pastDue = req.past_due || [];

  if (!account.details_submitted) {
    reasons.push(StripeUserFailureEnums.MISSING_BUSINESS_DETAILS);
  }

  if (!account.charges_enabled || !account.payouts_enabled) {
    if (
      pending.includes("individual.id_number") ||
      pending.includes("individual.verification.document") ||
      pastDue.includes("individual.verification.document")
    ) {
      reasons.push(StripeUserFailureEnums.MISSING_ID_VERIFICATION);
    }

    if (
      due.includes("external_account") ||
      pastDue.includes("external_account")
    ) {
      reasons.push(StripeUserFailureEnums.MISSING_BANK_ACCOUNT);
    }

    if (
      due.includes("tos_acceptance.date") ||
      pastDue.includes("tos_acceptance.date")
    ) {
      reasons.push(StripeUserFailureEnums.UNACCEPTED_TOS);
    }

    if (pending.length === 0 && due.length === 0 && pastDue.length === 0) {
      reasons.push(StripeUserFailureEnums.PENDING_STRIPE_REVIEW);
    }

    if (reasons.length === 0) {
      reasons.push(StripeUserFailureEnums.GENERIC_INCOMPLETE_SETUP);
    }
  }

  return reasons;
};

// processTemplate ...
export const processTemplate = (template, variables, userEmail = "") => {
  if (typeof template !== "string") {
    /* eslint-disable no-console */
    console.error("Template must be a string. Received:", template);
    return "";
  }

  let processedTemplate = template;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    processedTemplate = processedTemplate.replace(regex, value || "");
  });

  // disclaimers
  if (userEmail) {
    processedTemplate = processedTemplate.concat(
      `
      <div>
        <p>
          This email was sent via Quick Connect by ${userEmail}. Please do not reply to this email as this is an auto generated email.
        </p>
      </div>
`,
    );
  }

  return processedTemplate;
};
