import { expect, test } from "../fixtures.ts";

test.describe("Code Samples", () => {
  test("should show TryItNow component for TypeScript", async ({ page }) => {
    await page.goto("mistral/api/endpoint/agents");

    const monacoEditor = page.locator(".monaco-editor").nth(0);
    await expect(monacoEditor).toBeVisible();
  });
  test("should show TryItNow component for Python", async ({ page }) => {
    await page.goto("mistral/api/endpoint/agents");

    await page.getByRole("button", { name: "Python" }).first().click();

    const monacoEditor = page.locator(".monaco-editor").nth(0);
    await expect(monacoEditor).toBeVisible();
  });
  test("should show TryItNow component for Curl", async ({ page }) => {
    await page.goto("mistral/api/endpoint/agents");

    await page.getByRole("button", { name: "cURL" }).first().click();

    const monacoEditor = page.locator(".monaco-editor").nth(0);
    await expect(monacoEditor).toBeVisible();
  });
});
