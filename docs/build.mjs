import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { snippets } from "./examples.js";

export const site = {
  url: "https://www.thai-address-select-lib.taotech.site/",
  title: "thai-address-select: Dropdown ที่อยู่ไทย JavaScript / React",
  description:
    "สร้าง dropdown จังหวัด อำเภอ ตำบล พร้อมรหัสไปรษณีย์ด้วย thai-address-select ดูเดโมจริง วิธีติดตั้ง ตัวอย่าง JavaScript/React และ API ภาษาไทย",
  updated: "2026-10-26",
  repository: "https://github.com/rratchapol/thai-address-select-lib",
  npm: "https://www.npmjs.com/package/thai-address-select",
  author: "https://github.com/rratchapol",
};

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );

function renderCodeCard(name) {
  const snippet = snippets[name];
  return `<div class="code-toolbar"><span>${escapeHtml(snippet.filename)}</span><button class="copy-button" data-copy-target="code-${name}" aria-label="คัดลอก ${escapeHtml(snippet.filename)}">คัดลอกโค้ด</button></div><pre><code id="code-${name}">${escapeHtml(snippet.code)}</code></pre>`;
}

function renderExamples() {
  return [
    ["customize", "ปรับแต่งฟอร์ม"],
    ["react", "React / Next.js"],
    ["utilities", "Utility functions"],
  ]
    .map(
      ([name, title]) =>
        `<div id="example-${name}-panel" role="tabpanel" aria-labelledby="tab-${name}" data-example-panel${name === "customize" ? "" : " hidden"}><h3 class="example-panel-title">${title}</h3><p>${escapeHtml(snippets[name].description)}</p><div class="code-card" data-snippet="${name}">${renderCodeCard(name)}</div></div>`,
    )
    .join("\n");
}

function structuredData(metadata) {
  const author = { "@id": `${site.url}#maintainer` };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": author["@id"],
        name: "rratchapol",
        url: site.author,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}#website`,
        url: site.url,
        name: "thai-address-select",
        inLanguage: "th-TH",
        publisher: author,
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${site.url}#library`,
        name: "thai-address-select",
        description:
          "TypeScript library for linked Thai province, district and subdistrict dropdowns with postal code lookup.",
        version: metadata.version,
        programmingLanguage: "TypeScript",
        runtimePlatform: "Web browser with a JavaScript bundler",
        codeRepository: site.repository,
        url: site.npm,
        author,
      },
      {
        "@type": "TechArticle",
        "@id": `${site.url}#documentation`,
        url: site.url,
        headline: site.title,
        description: site.description,
        inLanguage: "th-TH",
        dateModified: site.updated,
        version: metadata.version,
        author,
        publisher: author,
        isPartOf: { "@id": `${site.url}#website` },
        mainEntityOfPage: site.url,
        about: { "@id": `${site.url}#library` },
        isAccessibleForFree: true,
        citation: [
          `${site.npm}/v/${metadata.version}`,
          `${site.repository}/blob/main/src/components/ThaiAddressSelect.ts`,
          `${site.repository}/blob/main/src/utils/filterAddress.ts`,
          `${site.repository}/blob/main/src/data/thai-address.json`,
        ],
      },
    ],
  };
}

function renderMetadata(metadata) {
  const graph = JSON.stringify(structuredData(metadata)).replace(
    /</g,
    "\\u003c",
  );
  return `<title>${escapeHtml(site.title)}</title>
<meta name="description" content="${escapeHtml(site.description)}" />
<meta name="author" content="rratchapol" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${site.url}" />
<link rel="alternate" type="text/markdown" href="${site.url}index.md" title="Documentation in Markdown" />
<link rel="describedby" href="${site.url}llms.txt" type="text/plain" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="th_TH" />
<meta property="og:site_name" content="thai-address-select" />
<meta property="og:url" content="${site.url}" />
<meta property="og:title" content="${escapeHtml(site.title)}" />
<meta property="og:description" content="${escapeHtml(site.description)}" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${escapeHtml(site.title)}" />
<meta name="twitter:description" content="${escapeHtml(site.description)}" />
<script id="structured-data" type="application/ld+json">${graph}</script>`;
}

function documentationAssets(metadata) {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8")
    .replace(/^\[!\[.*\r?\n/gm, "")
    .replace(/^# thai-address-select\s*/, "");
  return {
    "robots.txt": `User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`,
    "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site.url}</loc></url></urlset>\n`,
    "llms.txt": `# thai-address-select

> A TypeScript/JavaScript library for linked Thai province, district and subdistrict dropdowns, with postal code lookup and a browser demo.

## Documentation

- [Complete documentation in Markdown](${site.url}index.md): Installation, working JavaScript and React examples, constructor options, methods, events and utility functions.
- [Thai documentation](${site.url}): The human-readable guide and source-backed dataset notes.
- [Live address playground](${site.url}#playground): Select an address and inspect the JSON returned by the actual library.

## Primary sources

- [npm package](${site.npm}): Published package and installation instructions.
- [Source repository](${site.repository}): Library implementation, types and bundled dataset.
- [Dropdown implementation](${site.repository}/blob/main/src/components/ThaiAddressSelect.ts): Authoritative behavior of initialization, selection events, getValue, setValue and destroy.
- [Data utilities](${site.repository}/blob/main/src/utils/filterAddress.ts): Authoritative lookup functions and substring province search.

## Usage facts

Use a client-side bundler such as Vite to handle ESM imports and bundled JSON. Initialize after the form mounts. loadData() currently resolves immediately. initialValue and setValue() do not emit events. selectChange fires only after all three selections have values; use individual change events to clear a stale postal code.

Dataset counts describe the bundled snapshot, not verified current administrative boundaries. The data does not update automatically. Maintainer: rratchapol on GitHub.
`,
    "index.md": `# thai-address-select — documentation

Canonical page: ${site.url}
Package: ${site.npm}/v/${metadata.version}
Version: ${metadata.version}
Documentation checked against source: ${site.updated}
Maintainer: rratchapol (${site.author})
Dataset snapshot: ${metadata.provinces} provinces, ${metadata.districts} districts, ${metadata.subdistricts} subdistrict records. These are repository counts, not an official current-boundary guarantee.

${readme}`,
  };
}

export function documentationPlugin(metadata) {
  return {
    name: "thai-address-documentation",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html
          .replace("<!-- docs:metadata -->", renderMetadata(metadata))
          .replace(
            /(<div class="code-card" data-snippet="([a-z]+)">)\s*<\/div>/g,
            (_, opening, name) => `${opening}${renderCodeCard(name)}</div>`,
          )
          .replace("<!-- docs:examples -->", renderExamples())
          .replace(
            /(<span[^>]*\bdata-version[^>]*>)[^<]*/g,
            `$1v${metadata.version}`,
          )
          .replace(
            /(<strong data-stat="([a-z]+)">)[^<]*/g,
            (_, opening, name) =>
              `${opening}${metadata[name].toLocaleString("en-US")}`,
          );
      },
    },
    configureServer(server) {
      server.watcher.add(
        fileURLToPath(new URL("../README.md", import.meta.url)),
      );
      server.middlewares.use((request, response, next) => {
        const filename = new URL(
          request.url,
          "http://localhost",
        ).pathname.slice(1);
        if (
          !["robots.txt", "sitemap.xml", "llms.txt", "index.md"].includes(
            filename,
          )
        )
          return next();
        const source = documentationAssets(metadata)[filename];
        const type = filename.endsWith(".xml")
          ? "application/xml"
          : filename.endsWith(".md")
            ? "text/markdown"
            : "text/plain";
        response.setHeader("Content-Type", `${type}; charset=utf-8`);
        if (filename === "index.md")
          response.setHeader("Link", `<${site.url}>; rel="canonical"`);
        response.end(source);
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(
        documentationAssets(metadata),
      )) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}
