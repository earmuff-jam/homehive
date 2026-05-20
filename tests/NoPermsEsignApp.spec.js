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
  let page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    await seedEnvVars(page);
    await seedEmulatedUser(page, "OWNER", true);

    await selectEsignApp(page);
    await selectDisclaimerForEsignApp(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("should be able to render esign correctly", async () => {
    await test.step("verify dashboard", async () => {
      await expect(page.getByText("Create E-signature")).toBeVisible();

      await expect(
        page.getByRole("button", { name: "Upload files" }),
      ).toBeEnabled();
    });

    await test.step("open help center", async () => {
      await traverseNavBar(page, "Help Center");

      await expect(
        page.getByRole("heading", {
          name: /frequently asked questions/i,
        }),
      ).toBeVisible();
    });

    await test.step("verify accordions", async () => {
      const firstQuestion = page.getByText(
        "How can I create a new Electronic Signature",
      );

      const firstAnswer = page.getByText(/Click on "Upload Files" button/i);

      await expect(firstAnswer).toBeVisible();

      await firstQuestion.click();

      await expect(firstAnswer).not.toBeVisible();
    });

    await test.step("go back to esign", async () => {
      await traverseNavBar(page, "Esign");
      await selectDisclaimerForEsignApp(page);

      const buttons = [
        "Lease Agreement",
        "Lease Extension",
        "Early Termination",
        "Lease Renewal",
      ];

      for (const name of buttons) {
        await expect(
          page.getByRole("button", {
            name,
            exact: true,
          }),
        ).toBeVisible();
      }
    });
  });
});
