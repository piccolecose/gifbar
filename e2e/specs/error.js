describe("error", () => {
  it("tells the user when the GIF service fails", async () => {
    await $("input").setValue("fail");
    await browser.keys("Enter");
    await expect($(".error")).toHaveText("Couldn't reach the GIF service. Check your connection.");
  });
});
