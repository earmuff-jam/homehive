import { gotoSplashPageInNavBar } from "./utils";
import { expect, test } from "@playwright/test";

test.describe("Splash Page workflows", () => {
  test.beforeEach(async ({ page }) => {
    await gotoSplashPageInNavBar(page);
  });

  test("should load page with hero content", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /manage your rentals effortlessly all in one place/i,
      }),
    ).toBeVisible();

    await expect(page.getByText(/property management platform/i)).toBeVisible();

    await expect(
      page.getByText(/login with google and subscribe to get started/i),
    ).toBeVisible();
  });

  test("should display hero buttons correctly", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /see how it works/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /build invoice/i }),
    ).toBeVisible();
  });

  test("should display feature cards correctly", async ({ page }) => {
    await expect(page.getByText(/rent app/i)).toBeVisible();
    await expect(page.getByText(/invoicer app/i)).toBeVisible();
    await expect(page.getByText(/esign app/i)).toBeVisible();
  });

  test("should display section headings correctly", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: /everything you need to run your rentals/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: /see what our users have to say/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: /subscription and fees/i,
      }),
    ).toBeVisible();
  });

  test("should display subscription and fees section", async ({ page }) => {
    await expect(page.getByText(/subscription and fees/i)).toBeVisible();
    await expect(
      page.getByText(
        /Simple plans designed to fit your needs — subscribe to get started/i,
      ),
    ).toBeVisible();
  });

  test("should display page without crashes", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });
});
