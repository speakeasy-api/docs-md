import { expect, test } from "../fixtures.ts";

test.describe("SectionContent", () => {
  test("should expand content when expandable button is clicked", async ({
    page,
  }) => {
    await page.goto("mistral/api/endpoint/agents");
    const expandSystemMessage = page.getByTestId('operation-agents_completion_v1_agents_completions_post_request_messages_systemmessage')

    await expect(expandSystemMessage).toBeVisible();
    const expandButton = expandSystemMessage.getByRole('button');
    await expandButton.click();

    const fileIdHeading = page.getByRole("heading", {
      name: "content",
      level: 5,
    });
    await expect(fileIdHeading).toBeVisible();
  });
  test("should expand nested content when link is clicked", async ({
    page,
  }) => {
    await page.goto("mistral/api/endpoint/agents");
    const link = page.getByRole("link", { name: "UsageInfo" }).first();
    await expect(link).toBeVisible();
    await link.click();

    const nestedContent = page.getByRole("heading", {
      name: "completion_tokens",
      level: 5,
    });
    await expect(nestedContent).toBeVisible();
  });
});
