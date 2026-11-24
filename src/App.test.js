import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
import App from "./App.svelte";
import { trending, search } from "./lib/gif-api.js";

vi.mock("./lib/gif-api.js", () => ({
  trending: vi.fn(),
  search: vi.fn(),
}));

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(() => Promise.resolve()),
}));

vi.mock("@tauri-apps/plugin-clipboard-manager", () => ({
  writeText: vi.fn(() => Promise.resolve()),
}));

const gif = (id) => ({
  id,
  title: `Gif ${id}`,
  preview: `https://example.com/p/${id}.gif`,
  original: `https://example.com/o/${id}.gif`,
  source: "giphy",
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("App", () => {
  it("shows trending GIFs on load", async () => {
    trending.mockResolvedValue([gif("a"), gif("b")]);
    render(App);

    expect(await screen.findAllByRole("img")).toHaveLength(2);
    expect(trending).toHaveBeenCalledTimes(1);
  });

  it("shows an error message when trending fails", async () => {
    trending.mockRejectedValue(new Error("down"));
    render(App);

    expect(
      await screen.findByText(/Couldn't reach the GIF service/),
    ).toBeInTheDocument();
  });

  it("shows the empty state when there are no results", async () => {
    trending.mockResolvedValue([]);
    render(App);

    expect(await screen.findByText(/No GIFs found/)).toBeInTheDocument();
  });

  it("searches when the user presses Enter", async () => {
    trending.mockResolvedValue([gif("a")]);
    search.mockResolvedValue([gif("c")]);
    render(App);
    await screen.findAllByRole("img");

    const input = screen.getByPlaceholderText("Search for GIFs...");
    await fireEvent.input(input, { target: { value: "cats" } });
    await fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => expect(search).toHaveBeenCalledWith("cats"));
    const imgs = await screen.findAllByRole("img");
    expect(imgs[0]).toHaveAttribute("src", "https://example.com/p/c.gif");
  });

  it("shows Copied! after a copy and clears it after 1.5s", async () => {
    trending.mockResolvedValue([gif("a")]);
    render(App);

    await fireEvent.click(await screen.findByRole("img"));
    expect(await screen.findByText("Copied!")).toBeInTheDocument();

    await waitFor(
      () => expect(screen.queryByText("Copied!")).not.toBeInTheDocument(),
      {
        timeout: 2500,
      },
    );
  });
});
