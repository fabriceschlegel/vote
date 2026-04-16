import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const manifestPath = new URL("../data/source-manifest.json", import.meta.url);
const outputDirectory = new URL("../data/raw/", import.meta.url);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

mkdirSync(outputDirectory, { recursive: true });

for (const source of manifest) {
  const response = await fetch(source.url, {
    headers: {
      "user-agent": "BallotLightSourceSync/1.0",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.id}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const extension = contentType.includes("pdf")
    ? "pdf"
    : contentType.includes("json")
      ? "json"
      : "html";

  const filePath = new URL(`../data/raw/${source.id}.${extension}`, import.meta.url);
  const contents = Buffer.from(await response.arrayBuffer());

  writeFileSync(filePath, contents);
  console.log(`saved ${source.id}.${extension}`);
}
