import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const readJson = (path) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const addresses = readJson("./src/data/thai-address.json");
const districts = addresses.flatMap((province) => province.districts);

export default defineConfig({
  base: "./",
  define: {
    __DOCS_METADATA__: JSON.stringify({
      version: readJson("./package.json").version,
      provinces: addresses.length,
      districts: districts.length,
      subdistricts: districts.reduce(
        (count, district) => count + district.sub_districts.length,
        0,
      ),
    }),
  },
  server: { host: "127.0.0.1" },
  preview: { host: "127.0.0.1" },
  build: { outDir: "docs-dist", emptyOutDir: true },
});
