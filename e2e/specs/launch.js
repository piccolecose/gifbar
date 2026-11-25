import { trendingGifs } from "../stub-server.js";

describe("launch", () => {
  it("renders the trending GIFs", async () => {
    await browser.waitUntil(async () => (await $$(".gif-item")).length === trendingGifs.length);
    for (const [i, gif] of trendingGifs.entries()) {
      const item = (await $$(".gif-item"))[i];
      expect(await item.getAttribute("title")).toBe(gif.title);
      expect(await item.$("img").getAttribute("src")).toBe(gif.preview);
    }
  });
});
