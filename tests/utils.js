import { initEmulatorUser } from "../src/features/Api/helpers/initEmulatorUser";
import e2eMockData from "./mockConstants";
import { expect } from "@playwright/test";

// traverseNavBar ...
// defines a function that is used to move around in the left navigation bar
const traverseNavBar = async (page, linkName) => {
  const button = page.getByRole("button", { name: linkName });
  await expect(button).toBeVisible({ timeout: 10000 });
  await button.click();

  await page.waitForLoadState("networkidle");
};

// gotoSplashPageInNavBar ...
// defines a function that navigates users to specific app from splash page
export const gotoSplashPageInNavBar = async (page) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
};

// goToInvoiceAppFromSplashPage ...
// defines a function that navigates users to the Invoice App
// protects edit pdf from trying to navigate in other headings
export const goToInvoiceAppFromSplashPage = async (page, linkName) => {
  await page.goto("/");
  await page.getByText("Build Invoice").click();
  await expect(page.getByRole("heading", { name: /edit pdf/i })).toBeVisible();
  await traverseNavBar(page, linkName);
};

// goToEsignAppInNavBar ...
// defines a function that navigates users in the NavBar
export const goToEsignAppInNavBar = async (page) => {
  await page.goto("/");
  await page.getByText("Esign App").click();

  await page.waitForLoadState("networkidle");
};

// seedInvoiceStorage ...
// defines a function that allows the app to seed some invoice data
export const seedInvoiceStorage = async (page) => {
  const { InvoiceAppMockConstants } = e2eMockData;

  await page.addInitScript((data) => {
    localStorage.clear();
    localStorage.setItem("senderInfo", JSON.stringify(data.senderInfo));
    localStorage.setItem("recieverInfo", JSON.stringify(data.recieverInfo));
    localStorage.setItem("pdfDetails", JSON.stringify(data.pdfDetails));
  }, InvoiceAppMockConstants);
};

// seedEmulatedUser ...
// defines a function that allows the app to seed emulated user
export const seedEmulatedUser = async (page, role, isEsign) => {
  const emulatedUser = await initEmulatorUser(role, isEsign);

  await page.addInitScript((data) => {
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(data));
  }, emulatedUser);
};
