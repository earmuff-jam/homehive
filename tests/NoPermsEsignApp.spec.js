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
  const button = page.getByRole("button", {
    name: linkName,
    exact: true,
  });

  await expect(button).toBeVisible();
  await button.click();
};

// selectDisclaimerForEsignApp ...
// defines a function that selects the disclaimer for the Esign App
const selectDisclaimerForEsignApp = async (page) => {
  await expect(page).toHaveURL(/documents/i);

  await expect(page.getByText(/Platform Disclaimer/i)).toBeVisible();

  await page.getByRole("checkbox").check();

  await page
    .getByRole("button", {
      name: "I Understand",
    })
    .click();

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
    await test.step("should be able to display esign landing page", async () => {
      await expect(page.getByText("Create E-signature")).toBeVisible();

      await expect(
        page.getByRole("button", {
          name: "Upload files",
        }),
      ).toBeEnabled();
    });

    await test.step("should be able to view esign help center", async () => {
      await traverseNavBar(page, "Help Center");

      await expect(
        page.getByRole("heading", {
          name: /frequently asked questions/i,
        }),
      ).toBeVisible();
    });
    await expect(page.getByText("Create E-signature")).toBeVisible();

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
    // test headings
    await expect(
      page.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeVisible();

    await expect(
      page.getByText(/answers to common questions you may have/i),
    ).toBeVisible();

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

      await test.step("should be able to view and interact with frequently asked questions", async () => {
        const firstQuestion = page.getByText(
          "How can I create a new Electronic Signature",
        );

        const firstAnswer = page.getByText(/Click on "Upload Files" button/i);

        await expect(firstAnswer).toBeVisible();

        await firstQuestion.click();

        await expect(firstAnswer).not.toBeVisible();
      });

      await test.step("should be able to interact with system provided pdf buttons", async () => {
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

      await test.step("should be able to interact with signers for a selected pdf", async () => {
        await page
          .getByRole("button", {
            name: "Lease Agreement",
          })
          .click();

        await expect(
          page.getByRole("button", {
            name: "Creator",
            exact: true,
          }),
        ).toBeVisible();

        const addNewSignerButton = page.getByRole("button", {
          name: "Add new signer",
          exact: true,
        });

        await expect(addNewSignerButton).toBeVisible();

        await expect(
          page.getByText(
            "Select a signer above, then click and drag on the PDF to place their signature box.",
          ),
        ).toBeVisible();

        const creatorButton = page.getByRole("button", {
          name: "Creator",
          exact: true,
        });

        await creatorButton.click();

        await expect(
          page.getByText(
            "Select a different name above to switch or add new signer",
          ),
        ).toBeVisible();

        const signatureButton = page.getByRole("button", {
          name: "Signature",
          exact: true,
        });

        await signatureButton.click();

        await expect(
          page.getByText(
            "Placing signature for Creator — click and drag on the PDF below to place their signature box. Select a different name above to switch.",
          ),
        ).toBeVisible();

        const dateButton = page.getByRole("button", {
          name: "Date",
          exact: true,
        });

        await dateButton.click();

        await expect(
          page.getByText(
            "Placing date for Creator  — click and drag on the PDF below to place their date box. Select a different name above to switch.",
          ),
        ).toBeVisible();

        await expect(
          page.getByRole("heading", {
            name: "Edit Creator",
            level: 5,
          }),
        ).toBeVisible();

        await expect(page.getByText("Name", { exact: true })).toBeVisible();
        await expect(page.getByText("Email", { exact: true })).toBeVisible();

        await page.getByRole("textbox", { name: /name/i }).fill("Te");
        await page.getByRole("textbox", { name: /email/i }).fill("Te");

        // ensure errors are captured
        await expect(
          page.getByText(/Full name must be more than 3 characters/i),
        ).toBeVisible();

        await expect(
          page.getByText(/Enter a valid email address/i),
        ).toBeVisible();

        const submitButton = page.getByRole("button", {
          name: "Submit",
          exact: true,
        });

        await expect(submitButton).toBeDisabled();

        await page.getByRole("textbox", { name: /name/i }).fill("Test User");
        await page
          .getByRole("textbox", { name: /email/i })
          .fill("TestUser@gmail.com");

        await expect(submitButton).not.toBeDisabled();
        await submitButton.click();

        await addNewSignerButton.click();

        const signerOneButton = page.getByRole("button", {
          name: "Signer 1",
          exact: true,
        });

        await signerOneButton.click();

        await expect(page.getByText("Name", { exact: true })).toBeVisible();
        await expect(page.getByText("Email", { exact: true })).toBeVisible();

        await expect(
          page.getByPlaceholder("The name of the signer. Eg, Jane Smith"),
        ).toHaveValue("");

        await expect(
          page.getByPlaceholder("The email address of the signer"),
        ).toHaveValue("");
      });
    });
  });
});
