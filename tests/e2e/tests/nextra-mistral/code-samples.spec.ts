import { expect, test } from "../fixtures.ts";

test.describe("Code Samples", () => {
  test("should show TryItNow component for TypeScript", async ({ page }) => {
    await page.goto("mistral/api/endpoint/agents");

    const monacoEditor = page.locator(".monaco-editor").nth(0);
    await expect(monacoEditor).toBeVisible();
  });
  test("should show code sample for Python", async ({ page }) => {
    await page.goto("mistral/api/endpoint/agents");

    await page.getByRole("button", { name: "Python" }).first().click();
    const codeSample = await page
      .getByTestId("speakeasy-code-sample")
      .first()
      .innerText();
    expect(codeSample).toContain(`res = mistral.agents.complete(messages=[
        {
            "content": "Who is the best French painter? Answer in one short sentence.",
            "role": "user",
        },
    ], agent_id="<id>", stream=False)`);
  });
  test("should show TryItNow component for Curl", async ({ page }) => {
    await page.goto("mistral/api/endpoint/agents");

    await page.getByRole("button", { name: "cURL" }).first().click();

    const monacoEditor = page.locator(".monaco-editor").nth(0);
    await expect(monacoEditor).toBeVisible();
  });
});
