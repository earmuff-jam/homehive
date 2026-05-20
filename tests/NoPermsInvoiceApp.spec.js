import e2eMockData from "./mockConstants";
import { expect, test } from "@playwright/test";

// selectInvoiceApp ...
// defines a function that navigates users from the landing page
const selectInvoiceApp = async (page) => {
  await page.goto("/");
  const buildInvoiceBtn = page.getByText("Build Invoice");
  await expect(buildInvoiceBtn).toBeVisible({ timeout: 10000 });
  await buildInvoiceBtn.click();
  await expect(page.getByRole("heading", { name: /edit pdf/i })).toBeVisible();
};

// traverseNavBar ...
// traverse the navigation bar for invoice app
const traverseNavBar = async (page, linkName) => {
  const button = page.getByRole("button", { name: linkName });
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();
};

// seedInvoiceStorage ...
// defines a function that allows the app to seed some invoice data
async function seedInvoiceStorage(page) {
  const { InvoiceAppMockConstants } = e2eMockData;

  await page.addInitScript((data) => {
    localStorage.clear();
    localStorage.setItem("senderInfo", JSON.stringify(data.senderInfo));
    localStorage.setItem("recieverInfo", JSON.stringify(data.recieverInfo));
    localStorage.setItem("pdfDetails", JSON.stringify(data.pdfDetails));
  }, InvoiceAppMockConstants);
}

// Invoice App workflow
// defines a function that tests no permissions user for Invoice App
test.describe("Invoice App workflows", () => {
  // edit an invoice
  test.describe("should be able to edit an invoice", () => {
    test.beforeEach(async ({ page }) => {
      await selectInvoiceApp(page);
      await traverseNavBar(page, "Edit Invoice");
    });
    test("select from dropdown", async ({ page }) => {
      await expect(page).toHaveURL(/edit/i);
      await expect(
        page.getByRole("heading", { name: /edit pdf/i }),
      ).toBeVisible();
      await expect(
        page.getByText(/edit data to populate invoice/i),
      ).toBeVisible();
    });
    test("visible form fields", async ({ page }) => {
      await expect(page.getByText(/invoice title/i)).toBeVisible();
      await expect(page.getByText(/invoice caption/i)).toBeVisible();
      await expect(page.getByText(/additional notes/i)).toBeVisible();
      await expect(page.getByText(/invoice header/i)).toBeVisible();
      await expect(page.getByText(/tax rate/i)).toBeVisible();
    });
    test("ability to add more line items", async ({ page }) => {
      await page.getByRole("button", { name: /add item/i }).click();
      await expect(page.getByText(/edit line 1/i)).toBeVisible();
    });
    test("save button initially disabled", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: /^save$/i }).last(),
      ).toBeDisabled();
    });
    test("invoice status options visible", async ({ page }) => {
      await expect(page.getByText(/invoice status/i)).toBeVisible();
    });
    test("fill form fields", async ({ page }) => {
      await expect(page.getByText(/invoice title/i)).toBeVisible();
      await expect(page.getByText(/invoice caption/i)).toBeVisible();
      await expect(page.getByText(/additional notes/i)).toBeVisible();
      await expect(page.getByText(/invoice header/i)).toBeVisible();
      await expect(page.getByText(/tax rate/i)).toBeVisible();

      await page
        .getByRole("textbox", { name: /invoice title/i })
        .fill("Rent for April");
      await page
        .getByRole("textbox", { name: /invoice caption/i })
        .fill("April invoice caption");
      await page
        .getByRole("textbox", { name: /additional notes/i })
        .fill("Some extra notes here");
      await page
        .getByRole("textbox", { name: /invoice header/i })
        .fill("April Rent Breakdown");
      await page.getByRole("textbox", { name: /tax rate/i }).fill("8.25");
    });
    test("fill date fields", async ({ page }) => {
      const startDate = page.getByTestId("start-date-input");
      const endDate = page.getByTestId("end-date-input");

      await expect(startDate).toBeVisible();
      await expect(endDate).toBeVisible();

      await startDate.click();
      await page
        .locator('button[role="gridcell"]:has-text("1")')
        .first()
        .click();

      await page.getByRole("button", { name: "OK" }).click();

      await endDate.click();
      await page
        .locator('button[role="gridcell"]:has-text("20")')
        .first()
        .click();
      await page.getByRole("button", { name: "OK" }).click();

      await expect(startDate).not.toHaveValue("");
      await expect(endDate).not.toHaveValue("");
    });
  });
  // view an invoice
  test.describe("should be able to view invoice app", () => {
    test.beforeEach(async ({ page }) => {
      await seedInvoiceStorage(page);
      await selectInvoiceApp(page);
    });
    test("with localStorage data", async ({ page }) => {
      await traverseNavBar(page, "View Invoice");
      await expect(page.getByText("Month of April")).toBeVisible();
      await expect(
        page.getByText("Itemized bill for completed tasks"),
      ).toBeVisible();
      await expect(
        page.getByText(/Period \d{2}-\d{2}-\d{4} to \d{2}-\d{2}-\d{4}/),
      ).toBeVisible();

      // Receiver info
      await expect(page.getByText("James")).toBeVisible();
      await expect(page.getByText("Smith")).toBeVisible();
      await expect(page.getByText("1335 New College Rd")).toBeVisible();
      await expect(page.getByText("Little Rock AK, 72203")).toBeVisible();

      // Sender info
      await expect(page.getByText("Mohit")).toBeVisible();
      await expect(page.getByText("Paudyal")).toBeVisible();
      await expect(page.getByText("121 West Palm Beach")).toBeVisible();
      await expect(page.getByText("Everglade FL, 34139")).toBeVisible();

      // Table rows
      await expect(
        page.getByText("Replaced door knob for garage"),
      ).toBeVisible();
      await expect(
        page.getByText("Remove dirty bathroom faucet"),
      ).toBeVisible();
      await expect(page.getByText("Services")).toBeVisible();
      await expect(page.getByText("Fees")).toBeVisible();
      await expect(page.getByText("34.89")).toBeVisible();
      await expect(page.getByText("89.99")).toBeVisible();
      await expect(page.getByText("-0.06")).toBeVisible();
      await expect(page.getByText("-6.07")).toBeVisible();
      await expect(
        page.getByText(
          /Rent was paid on time. Owner has paid utility bills throughout this month/i,
        ),
      ).toBeVisible();
      await expect(page.getByText("Draft")).toBeVisible();
    });
  });
  // print invoice
  test.describe("should be able to attempt to print invoice", () => {
    test.beforeEach(async ({ page }) => {
      await seedInvoiceStorage(page);
      await selectInvoiceApp(page);
      await traverseNavBar(page, "View Invoice");
    });

    test("display menu options", async ({ page }) => {
      await page.locator("#customized-btn").click();
      await expect(page.getByRole("menu")).toBeVisible();
      await expect(
        page.getByRole("menuitem", { name: /print invoice/i }),
      ).toBeVisible();

      await expect(
        page.getByRole("menuitem", { name: /send email/i }),
      ).toBeVisible();

      await expect(
        page.getByRole("menuitem", { name: /change theme/i }),
      ).toBeVisible();

      await expect(
        page.getByRole("menuitem", { name: /help and support/i }),
      ).toBeVisible();
    });

    test("display print dialog", async ({ page }) => {
      await page.locator("#customized-btn").click();
      await expect(page.getByRole("menu")).toBeVisible();
      const printMenuItem = page.getByRole("menuitem", {
        name: /print invoice/i,
      });

      await expect(printMenuItem).toBeVisible();
      await printMenuItem.click();

      await expect(
        page.getByText(
          /verify all information is correct before proceeding to print\. press print when ready\./i,
        ),
      ).toBeVisible();
      await expect(page.getByText(/verify information/i)).toBeVisible();

      // watermark checkbox
      const watermarkCheckbox = page.getByRole("checkbox", {
        name: /display watermark/i,
      });
      await expect(watermarkCheckbox).toBeVisible();
      await expect(watermarkCheckbox).not.toBeChecked();
      await watermarkCheckbox.check();
      await expect(watermarkCheckbox).toBeChecked();
      await watermarkCheckbox.uncheck();
      await expect(watermarkCheckbox).not.toBeChecked();

      const printButton = page.getByRole("button", { name: /print/i });
      const cancelButton = page.getByRole("button", { name: /cancel/i });

      await expect(printButton).toBeVisible();
      await expect(cancelButton).toBeVisible();

      await expect(printButton).toBeEnabled();
      await expect(cancelButton).toBeEnabled();
    });
  });
  // view sender information
  test.describe("should be able to view sender information", () => {
    test.beforeEach(async ({ page }) => {
      await seedInvoiceStorage(page);
      await selectInvoiceApp(page);
      await traverseNavBar(page, "Sender");
    });
    test("visible form fields", async ({ page }) => {
      await expect(
        page.getByRole("heading", {
          name: "Add details about the sender",
          level: 5,
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("heading", {
          name: "Add details about the sender",
          level: 6,
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("heading", {
          name: "Sender Information",
          level: 5,
        }),
      ).toBeVisible();

      await expect(
        page.getByText("Required fields are marked with an *"),
      ).toBeVisible();

      // Sender info
      await expect(page.getByLabel(/first name/i)).toHaveValue("Mohit");
      await expect(page.getByLabel(/last name/i)).toHaveValue("Paudyal");
      await expect(page.getByLabel(/street address/i)).toHaveValue(
        "121 West Palm Beach",
      );
      await expect(page.getByLabel(/city/i)).toHaveValue("Everglade");
      await expect(page.getByLabel(/state/i)).toHaveValue("FL");
      await expect(page.getByLabel(/zip code/i)).toHaveValue("34139");
    });
  });
  // view reciever information
  test.describe("should be able to view reciever information", () => {
    test.beforeEach(async ({ page }) => {
      await seedInvoiceStorage(page);
      await selectInvoiceApp(page);
      await traverseNavBar(page, "Reciever");
    });
    test("visible form fields", async ({ page }) => {
      await expect(
        page.getByRole("heading", {
          name: "Add details about the reciever",
          level: 5,
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("heading", {
          name: "Add details about the reciever",
          level: 6,
        }),
      ).toBeVisible();

      await expect(
        page.getByText("Required fields are marked with an *"),
      ).toBeVisible();

      // Receiver info
      await expect(page.getByLabel(/first name/i)).toHaveValue("James");
      await expect(page.getByLabel(/last name/i)).toHaveValue("Smith");
      await expect(page.getByLabel(/street address/i)).toHaveValue(
        "1335 New College Rd",
      );
      await expect(page.getByLabel(/city/i)).toHaveValue("Little Rock");
      await expect(page.getByLabel(/state/i)).toHaveValue("AK");
      await expect(page.getByLabel(/zip code/i)).toHaveValue("72203");
    });
  });
  // edit sender information
  test.describe("should be able to edit sender information", () => {
    test.beforeEach(async ({ page }) => {
      await selectInvoiceApp(page);
      await traverseNavBar(page, "Sender");
      await page.waitForLoadState("networkidle");
    });
    // catch all errors in form
    test("edit form fields", async ({ page }) => {
      await page.getByRole("textbox", { name: /first name/i }).fill("Te");
      await page.getByRole("textbox", { name: /last name/i }).fill("D");
      await page
        .getByRole("textbox", { name: /email address/i })
        .fill("testuser");
      await page.getByRole("textbox", { name: /street address/i }).fill("12");
      await page.getByRole("textbox", { name: /city/i }).fill("Ma");
      await page.getByRole("textbox", { name: /state/i }).fill("FLXX");
      await page.getByRole("textbox", { name: /zip code/i }).fill("Test");

      // ensure errors are captured
      await expect(
        page.getByText(/First Name must be at least three characters/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Last Name must be at least three characters/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Enter a valid email address/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Enter a valid 2-letter state code/i),
      ).toBeVisible();
      await expect(page.getByText(/Enter a valid zipcode/i)).toBeVisible();

      // rewrite without errors
      await page.getByRole("textbox", { name: /first name/i }).fill("John");
      await page.getByRole("textbox", { name: /last name/i }).fill("Doe");
      await page
        .getByRole("textbox", { name: /email address/i })
        .fill("test@gmail.com");
      await page
        .getByRole("textbox", { name: /street address/i })
        .fill("johnDoe42@gmail.com");
      await page.getByRole("textbox", { name: /city/i }).fill("Everglade");
      await page.getByRole("textbox", { name: /state/i }).fill("FL");
      await page.getByRole("textbox", { name: /zip code/i }).fill("78455");

      // no errors should be captured
      await expect(
        page.getByText(/First Name must be at least three characters/i),
      ).not.toBeVisible();
      await expect(
        page.getByText(/Last Name must be at least three characters/i),
      ).not.toBeVisible();
      await expect(
        page.getByText(/Enter a valid email address/i),
      ).not.toBeVisible();
      await expect(
        page.getByText(/Enter a valid 2-letter state code/i),
      ).not.toBeVisible();
      await expect(page.getByText(/Enter a valid zipcode/i)).not.toBeVisible();
    });
  });
  // edit receiver information
  test.describe("should be able to edit reciever information", () => {
    test.beforeEach(async ({ page }) => {
      await selectInvoiceApp(page);
      await traverseNavBar(page, "Reciever");
    });

    // catch all errors in form
    test("edit form fields", async ({ page }) => {
      await page.getByRole("textbox", { name: /first name/i }).fill("Te");
      await page.getByRole("textbox", { name: /last name/i }).fill("D");
      await page
        .getByRole("textbox", { name: /email address/i })
        .fill("testuser");
      await page.getByRole("textbox", { name: /street address/i }).fill("12");
      await page.getByRole("textbox", { name: /city/i }).fill("Ma");
      await page.getByRole("textbox", { name: /state/i }).fill("FLXX");
      await page.getByRole("textbox", { name: /zip code/i }).fill("Test");

      // ensure errors are captured
      await expect(
        page.getByText(/First Name must be at least three characters/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Last Name must be at least three characters/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Enter a valid email address/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Enter a valid 2-letter state code/i),
      ).toBeVisible();
      await expect(page.getByText(/Enter a valid zipcode/i)).toBeVisible();

      // rewrite without errors
      await page.getByRole("textbox", { name: /first name/i }).fill("John");
      await page.getByRole("textbox", { name: /last name/i }).fill("Doe");
      await page
        .getByRole("textbox", { name: /email address/i })
        .fill("test@gmail.com");
      await page
        .getByRole("textbox", { name: /street address/i })
        .fill("johnDoe42@gmail.com");
      await page.getByRole("textbox", { name: /city/i }).fill("Everglade");
      await page.getByRole("textbox", { name: /state/i }).fill("FL");
      await page.getByRole("textbox", { name: /zip code/i }).fill("78455");

      // no errors should be captured
      await expect(
        page.getByText(/First Name must be at least three characters/i),
      ).not.toBeVisible();
      await expect(
        page.getByText(/Last Name must be at least three characters/i),
      ).not.toBeVisible();
      await expect(
        page.getByText(/Enter a valid email address/i),
      ).not.toBeVisible();
      await expect(
        page.getByText(/Enter a valid 2-letter state code/i),
      ).not.toBeVisible();
      await expect(page.getByText(/Enter a valid zipcode/i)).not.toBeVisible();
    });
  });
  // view help information
  test.describe("should be able to view help center", () => {
    test.beforeEach(async ({ page }) => {
      await selectInvoiceApp(page);
      await traverseNavBar(page, "Help Center");
    });

    test("renders FAQ header content", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /frequently asked questions/i }),
      ).toBeVisible({ timeout: 10000 });

      await expect(
        page.getByText(/answers to common questions you may have/i),
      ).toBeVisible();
    });

    test("renders all FAQ questions", async ({ page }) => {
      const questions = [
        "How do I create a new invoice?",
        "Can I save an invoice as a draft?",
        "How do I send an invoice to a client?",
        "Can I print my invoice?",
        "Is there a guide that I can follow?",
      ];

      for (const question of questions) {
        await expect(page.getByText(question)).toBeVisible();
      }
    });

    test("all accordions are expanded by default", async ({ page }) => {
      await expect(
        page.getByText(/click on "edit invoice" from the left navigation bar/i),
      ).toBeVisible();

      await expect(
        page.getByText(/yes, you can save any in-progress invoice as a draft/i),
      ).toBeVisible();

      await expect(
        page.getByText(/after creating the invoice, click "options"/i),
      ).toBeVisible();

      await expect(
        page.getByText(/yes. click "options", on the top right/i),
      ).toBeVisible();

      await expect(
        page.getByText(/yes. every page has its own help and support page/i),
      ).toBeVisible();
    });

    test("can collapse and expand accordion", async ({ page }) => {
      await page.waitForLoadState("networkidle");

      const firstQuestion = page.getByText("How do I create a new invoice?");
      const firstAnswer = page.getByText(
        /click on "edit invoice" from the left navigation bar/i,
      );

      await expect(firstAnswer).toBeVisible();

      await firstQuestion.click();
      await expect(firstAnswer).not.toBeVisible();

      await firstQuestion.click();
      await expect(firstAnswer).toBeVisible();
    });

    test("renders correct number of accordions", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /frequently asked questions/i }),
      ).toBeVisible({ timeout: 10000 });

      await expect(
        page.getByRole("button").filter({ hasText: /\?/ }),
      ).toHaveCount(5);
    });
  });
});
