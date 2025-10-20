import { expect, test } from "../fixtures.ts";

test.describe("Homepage", () => {
  test("should load homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const title = page.getByRole("heading", { name: "My Site" });
    await expect(title).toBeVisible();
    const pageHeader = page.getByRole("banner");
    const mistral = pageHeader.getByRole("link", { name: "Mistral" });
    const pokeapi = pageHeader.getByRole("link", { name: "PokeAPI" });
    const glean = pageHeader.getByRole("link", { name: "Glean" });

    await expect(mistral).toBeVisible();
    await expect(pokeapi).toBeVisible();
    await expect(glean).toBeVisible();
  });
});
