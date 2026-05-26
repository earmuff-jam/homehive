import { expect, test } from "@playwright/test";

test.describe("Splash Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:8888/");
  });

  test("page loads with hero content", async ({ page }) => {
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

  test("hero buttons are visible", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /see how it works/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /build invoice/i }),
    ).toBeVisible();
  });

  test("build invoice navigates correctly", async ({ page }) => {
    await page.getByRole("button", { name: /build invoice/i }).click();

    await expect(page).toHaveURL(/invoice/i);
  });

  test("feature cards render", async ({ page }) => {
    await expect(page.getByText(/rentx/i)).toBeVisible();
    await expect(page.getByText(/invoicex/i)).toBeVisible();
    await expect(page.getByText(/esignx/i)).toBeVisible();
  });

  test("section headings render", async ({ page }) => {
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

  test("invoicer card navigates to invoice dashboard", async ({ page }) => {
    await page.getByText(/invoicex/i).click();

    await expect(page).toHaveURL(/invoice/i);
  });

  test("page has no crash errors", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });
});
