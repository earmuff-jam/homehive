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

// toggleSelectedBtnEl ...
// defines a function that allows the testing env to toggle betn signature and date
const toggleSelectedBtnEl = async (page, selectedBtnEl) => {
  const selectedButtonEl = page.getByRole("button", {
    name: selectedBtnEl,
    exact: true,
  });

  await selectedButtonEl.click();
};

// validateSelectedSignerDetails ...
// defines a function that allows to test the input of selected signer details
const validateSelectedSignerDetails = async (page, headerText) => {
  await expect(
    page.getByRole("heading", {
      name: headerText,
      level: 5,
    }),
  ).toBeVisible();

  await expect(page.getByText("Name", { exact: true })).toBeVisible();
  await expect(page.getByText("Email", { exact: true })).toBeVisible();

  await expect(
    page.getByPlaceholder("The name of the signer. Eg, Jane Smith"),
  ).toHaveValue("");

  await expect(
    page.getByPlaceholder("The email address of the signer"),
  ).toHaveValue("");

  await expect(page.getByText("Name", { exact: true })).toBeVisible();
  await expect(page.getByText("Email", { exact: true })).toBeVisible();

  await page.getByRole("textbox", { name: /name/i }).fill("Te");
  await page.getByRole("textbox", { name: /email/i }).fill("Te");

  // ensure errors are captured
  await expect(
    page.getByText(/Full name must be more than 3 characters/i),
  ).toBeVisible();

  await expect(page.getByText(/Enter a valid email address/i)).toBeVisible();

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

// validateSignatureSelectorDetails ...
// defines a function that validates text and other selectors based on signer
const validateSignatureSelectorDetails = async (page, signer) => {
  await expect(
    page.getByText("Select a different name above to switch or add new signer"),
  ).toBeVisible();

  await toggleSelectedBtnEl(page, "Signature");

  const formattedSignaturePlacementText = `Placing signature for ${signer} — click and drag on the PDF below to place their signature box. Select a different name above to switch.`;
  await expect(page.getByText(formattedSignaturePlacementText)).toBeVisible();

  await toggleSelectedBtnEl(page, "Date");

  const formattedDatePlacementText = `Placing date for ${signer} — click and drag on the PDF below to place their date box. Select a different name above to switch.`;
  await expect(page.getByText(formattedDatePlacementText)).toBeVisible();
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
      await traverseNavBar(page, "Esign");
      await expect(page.getByText("Create E-signature")).toBeVisible();

      await expect(
        page.getByRole("button", {
          name: "Upload files",
        }),
      ).toBeEnabled();

      await expect(
        page.getByRole("button", {
          name: "Prepare Esign",
        }),
      ).not.toBeEnabled();
    });

    await test.step("should be able to view esign help center", async () => {
      await traverseNavBar(page, "Help Center");

      await expect(
        page.getByRole("heading", {
          name: /frequently asked questions/i,
        }),
      ).toBeVisible();
    });

    await test.step("should be able to verify help and support", async () => {
      const firstQuestion = page.getByText(
        "How can I create a new Electronic Signature",
      );

      const firstAnswer = page.getByText(/Click on "Upload Files" button/i);

      await expect(firstAnswer).toBeVisible();

      await firstQuestion.click();

      await expect(firstAnswer).not.toBeVisible();
    });

    await test.step("should be able to verify system provided pdf", async () => {
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

    await test.step("should be able to view and interact with frequently asked questions", async () => {
      await traverseNavBar(page, "Help Center");

      // test headings
      await expect(
        page.getByRole("heading", { name: /frequently asked questions/i }),
      ).toBeVisible();

      await expect(
        page.getByText(/answers to common questions you may have/i),
      ).toBeVisible();

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

      await validateSignatureSelectorDetails(page, "Creator");
      await validateSelectedSignerDetails(page, "Edit Creator");

      await addNewSignerButton.click();

      const signerOneButton = page.getByRole("button", {
        name: "Signer 1",
        exact: true,
      });

      await signerOneButton.click();

      await toggleSelectedBtnEl(page, "Signature");

      await validateSignatureSelectorDetails(page, "Signer 1");
      await validateSelectedSignerDetails(page, "Edit Signer 1");

      await addNewSignerButton.click();

      const signerTwoButton = page.getByRole("button", {
        name: "Signer 2",
        exact: true,
      });

      await signerTwoButton.click();

      await toggleSelectedBtnEl(page, "Signature");

      await validateSignatureSelectorDetails(page, "Signer 2");
      await validateSelectedSignerDetails(page, "Edit Signer 2");

      await addNewSignerButton.click();

      const signerThreeButton = page.getByRole("button", {
        name: "Signer 3",
        exact: true,
      });

      await signerThreeButton.click();

      await toggleSelectedBtnEl(page, "Signature");

      await validateSignatureSelectorDetails(page, "Signer 3");
      await validateSelectedSignerDetails(page, "Edit Signer 3");

      await addNewSignerButton.click();

      const signerFourButton = page.getByRole("button", {
        name: "Signer 4",
        exact: true,
      });

      await signerFourButton.click();

      await toggleSelectedBtnEl(page, "Signature");

      await validateSignatureSelectorDetails(page, "Signer 4");
      await validateSelectedSignerDetails(page, "Edit Signer 4");

      // disable add new signer after 4 subsequent signers
      await expect(addNewSignerButton).not.toBeEnabled();
    });

    // test dialog box for prepare esign
    await test.step("should be able to verify signer and selected box fields", async () => {
      const prepareEsignBtn = page.getByRole("button", {
        name: "Prepare Esign",
      });

      await expect(prepareEsignBtn).toBeEnabled();

      await prepareEsignBtn.click();

      await expect(
        page.getByRole("heading", {
          name: "Send document to signers?",
          level: 2,
        }),
      ).toBeVisible();

      await expect(
        page.getByText(
          "You have 5 signers but 0 signature boxes. Is this correct?",
        ),
      ).toBeVisible();

      await expect(
        page.getByText("You have 5 signers but 0 date boxes. Is this correct?"),
      ).toBeVisible();

      await expect(
        page.getByText(
          "Missing required fields. Please ensure full name and email is filled out for each signer including the Creator.",
        ),
      ).not.toBeVisible();

      const cancelButton = page.getByRole("button", { name: "Cancel" });
      await expect(cancelButton).toBeEnabled();

      const confirmButton = page.getByRole("button", { name: "Confirm" });
      await expect(confirmButton).not.toBeEnabled();

      await cancelButton.click();

      const secondarySigners = ["Signer 1", "Signer 2", "Signer 3", "Signer 4"];

      for (const chipSelector of secondarySigners) {
        await page
          .getByRole("button", {
            name: chipSelector,
            exact: true,
          })
          .locator(".MuiChip-deleteIcon")
          .click();
      }

      const creatorChipSelector = await page.getByRole("button", {
        name: "Creator",
      });

      await expect(creatorChipSelector).click();

      const addNewSignerButton = page.getByRole("button", {
        name: "Add new signer",
      });

      await expect(addNewSignerButton).toBeEnabled();

      // remove some signer details so we can catch the error
      await page.getByRole("textbox", { name: /name/i }).fill("");
      await page.getByRole("textbox", { name: /email/i }).fill("");

      await expect(prepareEsignBtn).toBeEnabled();
      await prepareEsignBtn.click();

      await expect(
        page.getByText("Action consumes 1 non-refundable token. Proceed?"),
      ).toBeVisible();

      await expect(
        page.getByText("Not enough tokens to send electronic signature."),
      ).toBeVisible();
    });
  });
});
