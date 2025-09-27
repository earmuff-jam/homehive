import { Box } from "@mui/material";

/**
 * Types of stripe accounts allowed in the system. This matches
 * the role of the user.
 */
export const TenantStripeAccountType = "Tenant";
export const PropertyOwnerStripeAccountType = "Owner";

/**
 * StripeUserStatusEnums
 *
 * enums objects for user status
 */
export const StripeUserStatusEnums = {
  SUCCESS: {
    type: "success",
    label: "Success",
    msg: "Stripe Account is connected and ready",
  },
  FAILURE: {
    type: "error",
    label: "Failed",
    msg: "Stripe account setup is incomplete.",
  },
};

/**
 * StripeUserFailureEnums ...
 *
 * used for reasons for stripe user failures
 */

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
};

/**
 * getStripeFailureReasons ...
 *
 * fn used to get the stripe failure reasons.
 *
 * @param {Object} account - the account details of the user
 * @returns
 */
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

/**
 * processTemplate ...
 *
 * utility file used to process templates with built in variable replacement tool. html body uses userEmail to prefil the email address field. Used generally to allow users to report suspicious activities.
 *
 * @param {Object} userEmail - userEmail, not required by default
 * @param {Object} template - the template literal object
 * @param {Object} variables - the object representation of the variables that can be altered
 *
 * @returns formattedTemplate object
 */
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

/**
 * Tab Panel Common Component
 *
 * used to render the tabs for the settings page
 */
export function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}
