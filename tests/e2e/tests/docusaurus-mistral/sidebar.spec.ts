import { expect, test } from "../fixtures.ts";

test.describe("Sidebar", () => {
  test("should render the sidebar and correct number of items", async ({
    page,
  }) => {
    await page.goto("mistral/api/endpoint/agents");

    // Wait for page to be loaded
    const sidebar = page.getByRole("navigation", { name: "Docs sidebar" });
    await expect(sidebar).toBeVisible();

    const sidebarList = sidebar.getByRole("list");
    // Assert the correct number of items
    await expect(sidebarList).toHaveCount(3);
  });
});
