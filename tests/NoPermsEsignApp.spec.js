import { expect, test } from "@playwright/test";
import { seedEmulatedUser } from "./seed.js";

// selectEsignApp ...
// defines a function that navigates users from the landing page 
 const selectEsignApp = async (page) => {
  await page.goto("/");
  await page.getByText("Esign App").click();

  await page.waitForLoadState("networkidle");
};

// Esign App Workflow ...
// no permissions user
test.describe("Esign App workflows", () => {
  test.beforeEach(async ({ page }) => {
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
    await expect(page).toHaveURL(/documents/i);
    await expect(page.getByText(/Platform Disclaimer/i)).toBeVisible();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "I Understand" }).click();
    await expect(page.getByText(/Platform Disclaimer/i)).not.toBeVisible();

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
});
