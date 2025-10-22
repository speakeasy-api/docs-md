/* eslint-disable playwright/no-networkidle */
// We need to check for network idle to ensure the TryItNow runtime has loaded
import { expect, test } from "../fixtures.ts";

test.describe("TryItNow", () => {
  test("should render TryItNow component", async ({ page }) => {
    await page.goto("/mistral/api/endpoint/ocr#operation-ocr_v1_ocr_post");
    await page.waitForLoadState("networkidle");
    const tryItNowSection = page.getByRole("textbox", {
      name: "Editor content",
    });
    await expect(tryItNowSection).toBeVisible();
  });
  test("should display results when hitting run button", async ({ page }) => {
    await page.goto("/mistral/api/endpoint/ocr#operation-ocr_v1_ocr_post");
    await page.waitForLoadState("networkidle");
    // get firs try it now run button
    const runButton = page.getByRole("button", { name: "Run" }).first();
    await expect(runButton).toBeVisible();
    await runButton.click();

    // This is the expected error since no valid API key is provided
    const errorText = page
      .getByText(
        'API error occurred: Status 401 Content-Type "application/json; charset=utf-8". Body: {"detail":"Unauthorized"}'
      )
      .first();
    await expect(errorText).toBeVisible();
  });

  test("should clear results when hitting reset button", async ({ page }) => {
    await page.goto("/mistral/api/endpoint/ocr#operation-ocr_v1_ocr_post");
    await page.waitForLoadState("networkidle");
    // get firs try it now run button
    const runButton = page.getByRole("button", { name: "Run" }).first();
    await expect(runButton).toBeVisible();
    await runButton.click();

    // This is the expected error since no valid API key is provided
    const errorText = page
      .getByText(
        'API error occurred: Status 401 Content-Type "application/json; charset=utf-8". Body: {"detail":"Unauthorized"}'
      )
      .first();
    await expect(errorText).toBeVisible();

    const resetButton = page.getByRole("button", { name: "Reset" }).first();
    await expect(resetButton).toBeVisible();
    await resetButton.click();

    await expect(errorText).toBeHidden();
  });
  test("should copy editor contents to clipboard when hitting copy button", async ({
    page,
    context,
  }) => {
    const editorContent = 'const greeting = "Hello World";';
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/mistral/api/endpoint/ocr#operation-ocr_v1_ocr_post");
    await page.waitForLoadState("networkidle");

    const monacoEditor = page.locator(".monaco-editor").nth(0);
    await monacoEditor.click();

    await page.keyboard.press("Control+A"); // Select all content
    await page.keyboard.type(editorContent);

    // Get button within TryItNow component
    const tryItNow = page.getByTestId("try-it-now");
    const copyButton = tryItNow
      .getByRole("button", { name: "Copy Code" })
      .first();
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // Read the clipboard content
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    expect(clipboardText).toBe(editorContent);
  });
});
