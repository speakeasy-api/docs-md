import { expect, test } from "../fixtures.ts";

test.describe('SectionContent', () => {
  test('should expand content when expandable button is clicked', async ({ page }) => {
    await page.goto('mistral/api/endpoint/ocr#operation-ocr_v1_ocr_post_request_document');
    await page.waitForLoadState('networkidle');
    const expandFileChunkButton = page.getByTestId('expandable-cell-button-operation-ocr_v1_ocr_post_request_document_filechunk');
    await expect(expandFileChunkButton).toBeVisible();
    await expandFileChunkButton.click();

    const fileIdHeading = page.getByRole('heading', { name: 'file_id', level: 5 });
    await expect(fileIdHeading).toBeVisible();
  });
});