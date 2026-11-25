import { createServer } from "node:http";

export const PORT = 14318;
const ORIGIN = `http://127.0.0.1:${PORT}`;

const TINY_GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

const gif = (id, title) => ({
  id,
  title,
  preview: `${ORIGIN}/img/${id}-preview.gif`,
  original: `${ORIGIN}/img/${id}.gif`,
});

export const trendingGifs = [
  gif("t1", "Trending Cat"),
  gif("t2", "Trending Dog"),
  gif("t3", "Trending Bird"),
];

export const searchGifs = [gif("s1", "Search Result One"), gif("s2", "Search Result Two")];

export function startStubServer() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, ORIGIN);
    const json = (status, body) => {
      // The webview's origin is tauri://localhost, so fetch needs CORS.
      res.writeHead(status, {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      });
      res.end(JSON.stringify(body));
    };
    if (url.pathname === "/trending") return json(200, { gifs: trendingGifs });
    if (url.pathname === "/search") {
      if (url.searchParams.get("q") === "fail") return json(500, { error: "boom" });
      return json(200, { gifs: searchGifs });
    }
    if (url.pathname.startsWith("/img/")) {
      res.writeHead(200, { "content-type": "image/gif" });
      return res.end(TINY_GIF);
    }
    res.writeHead(204);
    res.end();
  });
  return new Promise((resolve) => server.listen(PORT, "127.0.0.1", () => resolve(server)));
}
