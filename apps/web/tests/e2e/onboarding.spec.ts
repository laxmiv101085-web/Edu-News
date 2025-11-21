import { test, expect } from "@playwright/test";

test.describe("Landing", () => {
  test("loads hero and navigates to article detail", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/educational opportunity/i)).toBeVisible();
    await page.getByRole("button", { name: /Exams/ }).click();
  });
});


