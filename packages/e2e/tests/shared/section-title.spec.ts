import { expect, test } from "../fixtures.ts";

test.describe("SectionTitle", () => {
  test("should navigate to OperationRequestBody section", async ({ page }) => {
    await page.goto("mistral/api/endpoint/ocr");
    // get all headings with the id operation-ocr_v1_ocr_post_request
    const requestBodyTitle = page.getByRole("heading", { level: 3 }).first();
    await expect(requestBodyTitle).toHaveRole("heading");
    const expectedLink = await requestBodyTitle.getAttribute("id");
    const requestBodyLink = requestBodyTitle.getByRole("link");
    expect(expectedLink).toBeDefined();
    expect(await requestBodyLink.getAttribute("href")).toContain(
      `#${expectedLink}`
    );
    await requestBodyLink.click();

    const url = new URL(page.url());
    expect(url.hash).toContain("operation-ocr");
    expect(url.hash).toMatch(/post.*request/);
  });
});
