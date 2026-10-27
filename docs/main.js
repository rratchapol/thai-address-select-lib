import { snippets } from "./examples.js";

const byId = (id) => document.getElementById(id);
const metadata = __DOCS_METADATA__;

document.querySelectorAll("[data-version]").forEach((element) => {
  element.textContent = `v${metadata.version}`;
});
document.querySelectorAll("[data-stat]").forEach((element) => {
  element.textContent = metadata[element.dataset.stat].toLocaleString("en-US");
});

// Build tokens as text nodes so examples and dataset values never become HTML.
function highlight(element, text) {
  const tokens =
    /(\/\/[^\n]*|#[^\n]*|<!--[^]*?-->)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(import|from|export|default|const|let|async|await|function|return|new|if|try|catch|void|true|false|null|undefined)\b/g;
  const fragment = document.createDocumentFragment();
  let offset = 0;
  for (const match of text.matchAll(tokens)) {
    fragment.append(document.createTextNode(text.slice(offset, match.index)));
    const token = document.createElement("span");
    token.className = match[1]
      ? "token-comment"
      : match[2]
        ? /^\s*:/.test(text.slice(match.index + match[0].length))
          ? "token-key"
          : "token-string"
        : "token-keyword";
    token.textContent = match[0];
    fragment.append(token);
    offset = match.index + match[0].length;
  }
  fragment.append(document.createTextNode(text.slice(offset)));
  element.replaceChildren(fragment);
}

function renderCodeCard(container, name) {
  const snippet = snippets[name];
  const toolbar = document.createElement("div");
  toolbar.className = "code-toolbar";
  const label = document.createElement("span");
  label.textContent = snippet.filename;
  const copy = document.createElement("button");
  copy.className = "copy-button";
  copy.dataset.copyTarget = `code-${name}`;
  copy.textContent = "คัดลอกโค้ด";
  copy.setAttribute("aria-label", `คัดลอก ${snippet.filename}`);
  toolbar.append(label, copy);
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.id = `code-${name}`;
  highlight(code, snippet.code);
  pre.append(code);
  container.replaceChildren(toolbar, pre);
}

document.querySelectorAll("[data-snippet]").forEach((element) => {
  renderCodeCard(element, element.dataset.snippet);
});

function selectTab(button) {
  const tablist = button.closest('[role="tablist"]');
  tablist.querySelectorAll('[role="tab"]').forEach((tab) => {
    const selected = tab === button;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  byId(button.getAttribute("aria-controls")).setAttribute(
    "aria-labelledby",
    button.id,
  );
  if (button.dataset.install) {
    const commands = {
      npm: "npm install thai-address-select",
      pnpm: "pnpm add thai-address-select",
      yarn: "yarn add thai-address-select",
    };
    byId("install-code").textContent = commands[button.dataset.install];
  } else {
    document.querySelectorAll("[data-example-panel]").forEach((panel) => {
      panel.hidden = panel.id !== button.getAttribute("aria-controls");
    });
  }
}

document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => tab.addEventListener("click", () => selectTab(tab)));
  tablist.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = tabs.indexOf(document.activeElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
            tabs.length;
    tabs[next].focus();
    selectTab(tabs[next]);
  });
});
selectTab(byId("tab-customize"));

// Keep incoming section links aligned after code highlighting and tab setup.
const initialSection = byId(location.hash.slice(1));

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  byId("toast").textContent = message;
  byId("toast").hidden = false;
  toastTimer = setTimeout(() => {
    byId("toast").hidden = true;
  }, 3000);
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-target]");
  if (!button) return;
  const code = byId(button.dataset.copyTarget);
  try {
    await navigator.clipboard.writeText(code.textContent);
    showToast("คัดลอกแล้ว พร้อมนำไปใช้งาน");
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    showToast("เลือกข้อความให้แล้ว กด Ctrl+C หรือ ⌘C เพื่อคัดลอก");
  }
});

const mobileViewport = window.matchMedia("(max-width: 760px)");
function setMenu(open, restoreFocus = false) {
  document.body.classList.toggle("menu-open", open);
  byId("nav-overlay").hidden = !open;
  byId("menu-toggle").setAttribute("aria-expanded", String(open));
  byId("sidebar").inert = mobileViewport.matches && !open;
  document.querySelector(".page-shell").inert = mobileViewport.matches && open;
  if (open) byId("search-open").focus();
  else if (restoreFocus) byId("menu-toggle").focus();
}
byId("menu-toggle").addEventListener("click", () =>
  setMenu(!document.body.classList.contains("menu-open")),
);
byId("nav-overlay").addEventListener("click", () => setMenu(false, true));
mobileViewport.addEventListener("change", () => setMenu(false));
setMenu(false);

const sections = [...document.querySelectorAll(".doc-section")];
const navLinks = [...document.querySelectorAll(".side-nav a")];
function updateActiveSection() {
  const current =
    [...sections]
      .reverse()
      .find((section) => section.getBoundingClientRect().top <= 150) ??
    sections[0];
  navLinks.forEach((link) => {
    const active = link.hash === `#${current.id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  byId("breadcrumb-current").textContent = current.dataset.title;
}
let scrollScheduled = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      updateActiveSection();
      scrollScheduled = false;
    });
  },
  { passive: true },
);
updateActiveSection();
byId("sidebar")
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileViewport.matches) return;
      setMenu(false);
      const section = byId(link.hash.slice(1));
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
    });
  });

const searchIndex = sections.map((section) => ({
  id: section.id,
  title: section.dataset.title,
  content:
    `${section.dataset.title} ${section.dataset.keywords} ${section.textContent} ${
      section.id === "examples"
        ? Object.values(snippets)
            .map((snippet) => snippet.code)
            .join(" ")
        : ""
    }`.toLocaleLowerCase(),
}));
function renderSearch() {
  const query = byId("search-input").value.trim().toLocaleLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const results = searchIndex.filter((entry) =>
    terms.every((term) => entry.content.includes(term)),
  );
  byId("search-results").replaceChildren();
  results.forEach((entry) => {
    const link = document.createElement("a");
    link.href = `#${entry.id}`;
    link.textContent = `${entry.title} →`;
    link.addEventListener("click", () => {
      byId("search-dialog").close();
      const section = byId(entry.id);
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
    });
    byId("search-results").append(link);
  });
  if (!results.length) {
    const empty = document.createElement("p");
    empty.textContent = "ไม่พบหัวข้อนี้ ลองค้นหา React, API หรือ ติดตั้ง";
    byId("search-results").append(empty);
  }
}
function openSearch() {
  if (byId("search-dialog").open) return;
  if (document.body.classList.contains("menu-open")) setMenu(false);
  byId("search-dialog").showModal();
  byId("search-input").value = "";
  renderSearch();
  byId("search-input").focus();
}
byId("search-open").addEventListener("click", openSearch);
byId("search-close").addEventListener("click", () =>
  byId("search-dialog").close(),
);
byId("search-input").addEventListener("input", renderSearch);
byId("search-dialog").addEventListener("close", () => {
  if (mobileViewport.matches) byId("menu-toggle").focus();
});
byId("search-dialog").addEventListener("click", (event) => {
  if (event.target !== byId("search-dialog")) return;
  const rect = event.target.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    event.target.close();
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
  if (!document.body.classList.contains("menu-open")) return;
  if (event.key === "Escape") setMenu(false, true);
  if (event.key === "Tab") {
    const focusable = [...byId("sidebar").querySelectorAll("a, button")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

async function initPlayground() {
  const fillButton = byId("fill-demo");
  const resetButton = byId("reset-demo");
  fillButton.disabled = true;
  resetButton.disabled = true;
  try {
    const { ThaiAddressSelect, loadData } = await import("../src/index.ts");
    await loadData();
    const provinceEl = byId("province");
    const districtEl = byId("district");
    const subDistrictEl = byId("subDistrict");
    const address = new ThaiAddressSelect({
      provinceEl,
      districtEl,
      subDistrictEl,
    });
    function renderValue(label = "รอการเลือกที่อยู่") {
      const value = address.getValue();
      const display = Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, item ?? null]),
      );
      highlight(byId("demo-output"), JSON.stringify(display, null, 2));
      byId("zip-code").value = value.zip_code ?? "";
      districtEl.disabled = !value.province;
      subDistrictEl.disabled = !value.district;
      byId("event-status").textContent = label;
      byId("demo-status").textContent = value.zip_code
        ? "✓ เลือกที่อยู่ครบแล้ว พร้อมนำไปใช้งาน"
        : value.district
          ? "อีกนิดเดียว เลือกตำบล / แขวงต่อได้เลย"
          : value.province
            ? "เลือกอำเภอ / เขตที่ต้องการจัดส่ง"
            : "เริ่มต้นด้วยจังหวัดที่ต้องการจัดส่ง";
    }
    const onChange = (event) => renderValue(`${event.type} event`);
    const events = [
      "provinceChange",
      "districtChange",
      "subDistrictChange",
      "selectChange",
    ];
    events.forEach((event) => address.addEventListener(event, onChange));
    fillButton.addEventListener("click", () => {
      address.setValue({
        province: "กรุงเทพมหานคร",
        district: "เขตบางรัก",
        subDistrict: "สีลม",
      });
      renderValue("setValue() → getValue()");
    });
    resetButton.addEventListener("click", () => {
      address.setValue({});
      renderValue("setValue({}) → getValue()");
    });
    provinceEl.disabled = false;
    fillButton.disabled = false;
    resetButton.disabled = false;
    renderValue();
    if (import.meta.hot)
      import.meta.hot.dispose(() => {
        events.forEach((event) => address.removeEventListener(event, onChange));
        address.destroy();
      });
  } catch (error) {
    byId("demo-status").classList.add("error");
    byId("demo-status").textContent =
      "โหลดเดโมไม่สำเร็จ ลองโหลดหน้าใหม่ หรือรัน npm run docs:dev";
    byId("event-status").textContent = "โหลดข้อมูลไม่สำเร็จ";
    console.error("Unable to initialize the address playground:", error);
  }
}

// Readers arriving at an API anchor should not download the address database yet.
if ("IntersectionObserver" in window) {
  const playgroundObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      playgroundObserver.disconnect();
      void initPlayground();
    },
    { rootMargin: "150px" },
  );
  const observePlayground = () =>
    requestAnimationFrame(() => {
      if (initialSection?.classList.contains("doc-section")) {
        initialSection.scrollIntoView({ behavior: "instant" });
      }
      playgroundObserver.observe(byId("playground"));
    });
  // Let the browser restore an incoming hash anchor before measuring the viewport.
  if (document.readyState === "complete") observePlayground();
  else window.addEventListener("load", observePlayground, { once: true });
  if (import.meta.hot)
    import.meta.hot.dispose(() => {
      playgroundObserver.disconnect();
      window.removeEventListener("load", observePlayground);
    });
} else {
  void initPlayground();
}
