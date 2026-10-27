import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readOutput = (name) =>
  readFileSync(new URL(`../docs-dist/${name}`, import.meta.url), "utf8");
const canonical = "https://www.thai-address-select-lib.taotech.site/";
const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
const html = readOutput("index.html");

assert.equal(
  (html.match(/<h1\b/g) ?? []).length,
  1,
  "The document needs one primary heading",
);
assert.match(
  html,
  /<h1[^>]*>\s*thai-address-select/,
  "The heading should identify the library",
);
assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`));
assert.ok(html.includes(`<meta property="og:url" content="${canonical}"`));
assert.match(html, /name="description" content="[^\"]+"/);
assert.ok(html.includes('type="text/markdown"'));
assert.ok(
  html.includes("<noscript>"),
  "No-JavaScript readers need usable examples and navigation",
);

const graph = JSON.parse(
  html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  )[1],
);
const nodes = graph["@graph"];
const library = nodes.find((node) => node["@type"] === "SoftwareSourceCode");
const article = nodes.find((node) => node["@type"] === "TechArticle");
assert.equal(library.version, pkg.version);
assert.equal(article.url, canonical);
assert.equal(article.about["@id"], library["@id"]);
const ids = new Set(nodes.map((node) => node["@id"]));
function checkReferences(value) {
  if (Array.isArray(value)) return value.forEach(checkReferences);
  if (!value || typeof value !== "object") return;
  if (value["@id"])
    assert.ok(
      ids.has(value["@id"]),
      `Unresolved schema reference: ${value["@id"]}`,
    );
  Object.values(value).forEach(checkReferences);
}
nodes.forEach(checkReferences);
assert.ok(
  !JSON.stringify(graph).includes("aggregateRating"),
  "Do not invent reviews",
);

for (const name of [
  "local",
  "html",
  "javascript",
  "events",
  "customize",
  "react",
  "utilities",
  "structure",
]) {
  const code = html.match(
    new RegExp(`<code id="code-${name}">([\\s\\S]*?)<\\/code>`),
  );
  assert.ok(code?.[1].trim(), `Missing static code example: ${name}`);
}
assert.ok(
  html.includes("cancelled = true"),
  "React cleanup should be readable in the initial HTML",
);
assert.ok(html.includes("getzip_code"));
assert.ok(!html.includes("<!-- docs:"), "Build placeholders must be resolved");
assert.ok(!/data-snippet="[a-z]+">\s*<\/div>/.test(html));
assert.ok(
  !html.includes("v1.0.5"),
  "The initial HTML must not advertise an older package version",
);

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(
  new Set(htmlIds).size,
  htmlIds.length,
  "Generated panels and code blocks need unique IDs",
);
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(htmlIds.includes(match[1]), `Broken in-page link: ${match[1]}`);
}
for (const name of ["customize", "react", "utilities"]) {
  assert.ok(htmlIds.includes(`example-${name}-panel`));
}

const robots = readOutput("robots.txt");
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert.ok(!/^Disallow:\s*\/\s*$/m.test(robots));
assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
const locations = [
  ...readOutput("sitemap.xml").matchAll(/<loc>(.*?)<\/loc>/g),
].map((match) => match[1]);
assert.deepEqual(
  locations,
  [canonical],
  "Hash sections are not separate sitemap pages",
);
assert.match(readOutput("llms.txt"), /^# thai-address-select\n/);
assert.ok(readOutput("llms.txt").includes(`${canonical}index.md`));
const markdown = readOutput("index.md");
assert.ok(markdown.includes(`Version: ${pkg.version}`));
assert.ok(markdown.includes("cancelled = true"));
assert.ok(markdown.includes("loadData()"));

console.log(
  `Documentation checks passed: static examples, canonical, schema, crawl files, Markdown, anchors and version ${pkg.version}.`,
);
