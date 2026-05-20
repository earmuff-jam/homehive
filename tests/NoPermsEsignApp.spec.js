import { seedEmulatedUser } from "./seed.js";
import { expect, test } from "@playwright/test";

// seedEnvVars ...
// defines a function that seeds environment variables
const seedEnvVars = async (page) => {
  await page.addInitScript(() => {
    window.PLAYWRIGHT_ENV_ENABLED = "true";
  });
};

// selectEsignApp ...
// defines a function that navigates users from the landing page
const selectEsignApp = async (page) => {
  await page.goto("/");

  await expect(page.getByText("Esign App")).toBeVisible();
  await page.getByText("Esign App").click();
};

// traverseNavBar ...
// traverse the navigation bar with specific link
const traverseNavBar = async (page, linkName) => {
  const button = page.getByRole("button", { name: linkName, exact: true });
  await expect(button).toBeVisible();
  await button.click();
};

// selectDisclaimerForEsignApp ...
// defines a function that selects the disclaimer for the Esign App
const selectDisclaimerForEsignApp = async (page) => {
  await expect(page).toHaveURL(/documents/i);
  await expect(page.getByText(/Platform Disclaimer/i)).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "I Understand" }).click();
  await expect(page.getByText(/Platform Disclaimer/i)).not.toBeVisible();
};

// Esign App Workflow ...
// no permissions user
test.describe("Esign App workflows", () => {
  test.beforeEach(async ({ page }) => {
    await seedEnvVars(page);
    await seedEmulatedUser(page, "OWNER", true);
    // set user first; then go to esign app
    await selectEsignApp(page);
  });

  test("should load disclaimer on page init", async ({ page }) => {
    await expect(page).toHaveURL(/documents/i);
    await expect(page.getByText(/Platform Disclaimer/i)).toBeVisible();
    await expect(
      page.getByText(
        /Landlord–tenant laws may vary by city, state, and property type. This platform provides document automation tools, not legal services./i,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        /The property owner, manager, or broker is solely responsible for ensuring that any documents created, signed, or distributed through this platform comply with all applicable federal, state, and local laws, including landlord–tenant regulations, housing rules, and property codes./i,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        /Documents and templates available through this platform are provided for general informational purposes and may not be suitable for every situation or jurisdiction. Laws vary significantly by location and circumstances./i,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        /Users are strongly encouraged to consult a qualified attorney or legal professional to review any documents before sending, signing, or relying on them./i,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        /By using this platform, you acknowledge that you are fully responsible for reviewing, approving, and ensuring the legality and enforceability of any document you create, upload, send, or sign through the service./i,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        /The platform and its operators disclaim any liability for damages, losses, disputes, claims, or legal consequences arising from the use of documents, templates, or electronic signatures generated through this service./i,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(/I have read and understood the policy stated above./i),
    ).toBeVisible();
    await expect(
      page.getByText(/I agree with the privacy policy stated above */i),
    ).toBeVisible();
    await expect(
      page.getByText(
        /By clicking "I Understand", you confirm that you have read and agree to this disclaimer./i,
      ),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "I Understand" }),
    ).toBeDisabled();

    await page.getByRole("checkbox").check();

    await expect(
      page.getByRole("button", { name: "I Understand" }),
    ).not.toBeDisabled();

    await page.getByRole("button", { name: "I Understand" }).click();
    await expect(page.getByText(/Platform Disclaimer/i)).not.toBeVisible();
  });

  test("should have proper details after accepting disclaimer", async ({
    page,
  }) => {
    await selectDisclaimerForEsignApp(page);
    await expect(page.getByText("Create E-signature")).toBeVisible();

    await expect(
      page.getByText("Create or revise documents for Esign"),
    ).toBeVisible();

    await expect(
      page.locator("li.MuiBreadcrumbs-li").filter({ hasText: "Esign App" }),
    ).toBeVisible();

    await expect(page.getByText(/Non-Refundable Tokens:/i)).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Upload files" }),
    ).not.toBeDisabled();

    await expect(
      page.getByRole("button", { name: "Prepare Esign" }),
    ).toBeDisabled();
  });

  test("should be able to view the help center", async ({ page }) => {
    await selectDisclaimerForEsignApp(page);
    await traverseNavBar(page, "Help Center");

    // test headings
    await expect(
      page.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeVisible();

    await expect(
      page.getByText(/answers to common questions you may have/i),
    ).toBeVisible();
  });

  test("should be able to view the questions under help center", async ({
    page,
  }) => {
    await selectDisclaimerForEsignApp(page);
    await traverseNavBar(page, "Help Center");

    const questions = [
      "How can I create a new Electronic Signature",
      "Do I have to purchase tokens to send electronic signatures",
      "How to add signers to the selected document",
      "Can we use the default provided templates?",
      "What is the difference between creator and other signers?",
      "Do you send reminders if the document is not signed?",
      "Is there a guide that I can follow?",
    ];

    for (const question of questions) {
      await expect(page.getByText(question)).toBeVisible();
    }
  });

  test("should have all accordions expanded by default", async ({ page }) => {
    await selectDisclaimerForEsignApp(page);
    await traverseNavBar(page, "Help Center");

    await expect(
      page.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeVisible();

    const firstQuestion = page.getByText(
      "How can I create a new Electronic Signature",
    );
    const firstAnswer = page.getByText(
      'Click on "Upload Files" button and ensure all fields are filled out. Place respective signature fields and date fields. Once done, press "Prepare Esign" to send the documents for electronic signatures.',
    );

    await expect(firstAnswer).toBeVisible();

    await firstQuestion.click();
    await expect(firstAnswer).not.toBeVisible();

    await firstQuestion.click();
    await expect(firstAnswer).toBeVisible();

    await expect(
      page.getByRole("button").filter({ hasText: /\?/ }),
    ).toHaveCount(7);
  });

  test("should be able to select system provided pdfs", async ({ page }) => {
    await selectDisclaimerForEsignApp(page);
    await traverseNavBar(page, "Esign");

    const systemProvidedPdfButtonsFields = [
      "Lease Agreement",
      "Lease Extension",
      "Early Termination",
      "Lease Renewal",
    ];

    for (const question of systemProvidedPdfButtonsFields) {
      const button = page.getByRole("button", { name: question, exact: true });
      await expect(button).toBeVisible();
      await expect(button).not.toBeDisabled();
    }
  });
});
