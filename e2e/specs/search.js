import { searchGifs } from "../stub-server.js";

describe("search", () => {
  it("shows the search results after typing a query and pressing Enter", async () => {
    await $("input").setValue("cats");
    await browser.keys("Enter");
    await browser.waitUntil(async () => (await $$(".gif-item")).length === searchGifs.length);
    const titles = await $$(".gif-item").map((item) => item.getAttribute("title"));
    expect(titles).toEqual(searchGifs.map((gif) => gif.title));
  });
});
