# thai-address-select

[![npm version](https://img.shields.io/npm/v/thai-address-select.svg)](https://www.npmjs.com/package/thai-address-select)
[![Live demo](https://img.shields.io/badge/Live_demo-Try_it_now-7560db)](https://www.thai-address-select-lib.taotech.site/#playground)

Linked **Province → District → Subdistrict** dropdowns for Thai addresses, with automatic postal code lookup. Written in TypeScript and built around your own HTML `<select>` elements.

ไลบรารีสำหรับเลือก **จังหวัด → อำเภอ/เขต → ตำบล/แขวง** แบบเชื่อมโยง พร้อมค้นหารหัสไปรษณีย์อัตโนมัติ ใช้กับช่อง `<select>` และ CSS ของคุณได้เลย

**[Live demo & Documentation](https://www.thai-address-select-lib.taotech.site)** · **[npm package](https://www.npmjs.com/package/thai-address-select)** · **[GitHub](https://github.com/rratchapol/thai-address-select-lib)**

## Try it before installing

Open the **[interactive playground](https://www.thai-address-select-lib.taotech.site/#playground)** to select an address and see the returned JSON. No installation required.

ลองเลือกที่อยู่และดูผลลัพธ์จริงบนเว็บเดโมได้ทันที พร้อมคู่มือภาษาไทย:

- [เริ่มต้นใช้งาน / Quick start](https://www.thai-address-select-lib.taotech.site/#quickstart)
- [ตัวอย่าง JavaScript, React และ utilities](https://www.thai-address-select-lib.taotech.site/#examples)
- [API Reference](https://www.thai-address-select-lib.taotech.site/#api)
- [โครงสร้างโปรเจค / Project architecture](https://www.thai-address-select-lib.taotech.site/#architecture)

## Features

- Linked dropdowns: changing a province clears the selected district and subdistrict; changing a district clears the selected subdistrict.
- Postal code lookup when all three address fields are selected.
- Existing HTML elements and your own styling; no component theme to override.
- Custom placeholders, initial values, programmatic updates, and change events.
- TypeScript declarations and standalone data utilities.
- Bundled address data; no external address API request during selection.

## Installation

```bash
npm install thai-address-select
```

Other package managers:

```bash
pnpm add thai-address-select
# or

yarn add thai-address-select
```

Use the library in a **client-side app with a bundler such as Vite**, which handles its ESM imports and bundled JSON data. The examples below assume that setup.

ตัวอย่างด้านล่างใช้กับโปรเจคที่มี bundler เช่น Vite เพื่อจัดการ JavaScript modules และ JSON ไม่ใช่การเปิด HTML ผ่าน `file://` หรืออ้างไฟล์ใน `node_modules` โดยตรง

## Quick start: HTML + JavaScript

### 1. Add the form elements

Put the following in your application's `index.html`:

```html
<label for="province">จังหวัด</label>
<select id="province"></select>

<label for="district">อำเภอ / เขต</label>
<select id="district"></select>

<label for="subDistrict">ตำบล / แขวง</label>
<select id="subDistrict"></select>

<label for="zipCode">รหัสไปรษณีย์</label>
<input id="zipCode" readonly />

<script type="module" src="/main.js"></script>
```

### 2. Connect the dropdowns

Create `main.js`:

```javascript
import { ThaiAddressSelect, loadData } from "thai-address-select";

await loadData();

const provinceEl = document.getElementById("province");
const districtEl = document.getElementById("district");
const subDistrictEl = document.getElementById("subDistrict");
const zipCodeEl = document.getElementById("zipCode");

const address = new ThaiAddressSelect({
  provinceEl,
  districtEl,
  subDistrictEl,
});

function syncForm() {
  const value = address.getValue();
  zipCodeEl.value = value.zip_code ?? "";
  districtEl.disabled = !value.province;
  subDistrictEl.disabled = !value.district;
}

const changeEvents = ["provinceChange", "districtChange", "subDistrictChange"];

changeEvents.forEach((event) => address.addEventListener(event, syncForm));
syncForm();

function onComplete(event) {
  console.log(event.detail);
  // {
  //   province: "กรุงเทพมหานคร",
  //   district: "เขตบางรัก",
  //   subDistrict: "สีลม",
  //   zip_code: "10500"
  // }
}

address.addEventListener("selectChange", onComplete);

// Call when your app removes this form or leaves the page.
function cleanupAddressForm() {
  changeEvents.forEach((event) => {
    address.removeEventListener(event, syncForm);
  });
  address.removeEventListener("selectChange", onComplete);
  address.destroy();
}
```

`selectChange` fires only when all three dropdowns have values. Listening to the individual change events keeps the postal code in sync when a parent selection clears the remaining fields. The example also manages `disabled` states; the library itself does not disable the dropdowns.

เมื่อเปลี่ยนจังหวัดหรืออำเภอ ค่าช่องถัดไปจะถูกล้าง ให้ฟัง event รายช่องด้วยเพื่อไม่ให้รหัสไปรษณีย์เดิมค้างอยู่

> In the current implementation, data is imported with the module. `loadData()` resolves immediately and does not fetch additional data.

## Customization

Use these options when creating an instance with the form elements above:

```javascript
const address = new ThaiAddressSelect({
  provinceEl,
  districtEl,
  subDistrictEl,
  placeholder: {
    province: "จังหวัดที่จัดส่ง",
    district: "เลือกอำเภอ / เขต",
    subDistrict: "เลือกตำบล / แขวง",
  },
  initialValue: {
    province: "กรุงเทพมหานคร",
    district: "เขตบางรัก",
    subDistrict: "สีลม",
  },
});
```

Read or update the address after creating an instance:

```javascript
const currentAddress = address.getValue();

address.setValue({
  province: "กรุงเทพมหานคร",
  district: "เขตบางรัก",
  subDistrict: "มหาพฤฒาราม",
});
syncForm(); // Use the helper from the quick start to update the postal code.

address.setValue({}); // Reset all three fields.
syncForm();
```

**`initialValue` and `setValue()` do not emit events.** Read `getValue()` and synchronize your UI after using them. `setValue()` replaces the selection rather than merging with existing fields.

Names must match the dataset exactly, including prefixes such as **`เขตบางรัก`**, and belong to the selected parent. Use the utilities below to obtain valid names.

## React / Next.js

Create the instance inside `useEffect` after the elements mount. For Next.js, use a Client Component. This example cancels initialization after unmount, removes application listeners, and calls `destroy()` during cleanup.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function AddressForm() {
  const provinceRef = useRef<HTMLSelectElement>(null);
  const districtRef = useRef<HTMLSelectElement>(null);
  const subDistrictRef = useRef<HTMLSelectElement>(null);
  const [zipCode, setZipCode] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};

    async function init() {
      try {
        const { ThaiAddressSelect, loadData } =
          await import("thai-address-select");
        await loadData();
        if (cancelled) return;

        const provinceEl = provinceRef.current;
        const districtEl = districtRef.current;
        const subDistrictEl = subDistrictRef.current;
        if (!provinceEl || !districtEl || !subDistrictEl) return;

        const address = new ThaiAddressSelect({
          provinceEl,
          districtEl,
          subDistrictEl,
        });

        const sync = () => {
          const value = address.getValue();
          setZipCode(value.zip_code ?? "");
          districtEl.disabled = !value.province;
          subDistrictEl.disabled = !value.district;
        };
        const events = [
          "provinceChange",
          "districtChange",
          "subDistrictChange",
        ];
        events.forEach((event) => address.addEventListener(event, sync));

        dispose = () => {
          events.forEach((event) => address.removeEventListener(event, sync));
          address.destroy();
        };

        sync();
        setReady(true);
      } catch {
        if (!cancelled) {
          setError("โหลดข้อมูลไม่สำเร็จ กรุณาโหลดหน้าใหม่");
        }
      }
    }

    void init();
    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return (
    <fieldset disabled={!ready}>
      <legend>ที่อยู่จัดส่ง</legend>
      <label>
        จังหวัด <select ref={provinceRef} />
      </label>
      <label>
        อำเภอ / เขต <select ref={districtRef} />
      </label>
      <label>
        ตำบล / แขวง <select ref={subDistrictRef} />
      </label>
      <label>
        รหัสไปรษณีย์ <input value={zipCode} readOnly />
      </label>
      {error && <p role="alert">{error}</p>}
    </fieldset>
  );
}
```

More examples: **[React, customization, and utilities](https://www.thai-address-select-lib.taotech.site/#examples)**.

## API reference

### Constructor

```typescript
import {
  ThaiAddressSelect,
  type ThaiAddressSelectOptions,
  type ThaiAddressValue,
} from "thai-address-select";
```

| Option          | Type                                                             | Required | Description                                           |
| --------------- | ---------------------------------------------------------------- | -------- | ----------------------------------------------------- |
| `provinceEl`    | `HTMLSelectElement`                                              | Yes      | Province dropdown.                                    |
| `districtEl`    | `HTMLSelectElement`                                              | Yes      | District dropdown.                                    |
| `subDistrictEl` | `HTMLSelectElement`                                              | Yes      | Subdistrict dropdown.                                 |
| `placeholder`   | `{ province?: string; district?: string; subDistrict?: string }` | No       | Override each placeholder independently.              |
| `initialValue`  | `ThaiAddressValue`                                               | No       | Initial selection using exact names from the dataset. |

Default placeholders are `เลือกจังหวัด`, `เลือกอำเภอ/เขต`, and `เลือกตำบล/แขวง`.

### Methods

| Method            | Description                                                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getValue()`      | Returns `{ province, district, subDistrict, zip_code }`. Each property is a string or `undefined`. The postal code is looked up when all three address fields have values. |
| `setValue(value)` | Replaces the current selection. Use `{}` to reset. Does not emit change events.                                                                                            |
| `destroy()`       | Removes the library's listeners from the three select elements. Does not remove the elements or application listeners attached to the instance.                            |

`ThaiAddressValue` contains the optional `province`, `district`, and `subDistrict` fields. The return type of `getValue()` adds `zip_code?: string`.

### Events

Listen with `address.addEventListener(name, handler)`. Payloads are available through `CustomEvent.detail`.

| Event               | Trigger                                               | `detail`                                        |
| ------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| `provinceChange`    | The user changes the province.                        | `{ province }`                                  |
| `districtChange`    | The user changes the district.                        | `{ province, district }`                        |
| `subDistrictChange` | The user changes the subdistrict.                     | `{ province, district, subDistrict }`           |
| `selectChange`      | All three fields have values after a dropdown change. | `{ province, district, subDistrict, zip_code }` |

### Standalone utilities

Use these functions without creating dropdowns. They are exported from both `thai-address-select` and `thai-address-select/utils`.

```javascript
import {
  loadData,
  getProvinces,
  getDistricts,
  getSubDistricts,
  getzip_code,
  findProvinceByName,
} from "thai-address-select/utils";

await loadData();

const provinces = getProvinces();
const districts = getDistricts("กรุงเทพมหานคร");
const subDistricts = getSubDistricts("กรุงเทพมหานคร", "เขตบางรัก");
const zipCode = getzip_code("กรุงเทพมหานคร", "เขตบางรัก", "สีลม");

console.log(zipCode); // "10500"
console.log(findProvinceByName("เชียง")); // ["เชียงราย", "เชียงใหม่"]
```

| Function                                       | Returns               | Notes                                                                                                                                              |
| ---------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loadData()`                                   | `Promise<void>`       | Resolves immediately; data is already imported.                                                                                                    |
| `getProvinces()`                               | `string[]`            | Unique province names sorted using Thai locale comparison.                                                                                         |
| `getDistricts(province)`                       | `string[]`            | District names sorted in Thai order; `[]` if not found.                                                                                            |
| `getSubDistricts(province, district)`          | `string[]`            | Subdistrict names sorted in Thai order; `[]` if not found.                                                                                         |
| `getzip_code(province, district, subDistrict)` | `string \| undefined` | Postal code as a string, or `undefined` if not found. The function name uses a lowercase `z`.                                                      |
| `findProvinceByName(query)`                    | `string[]`            | Substring search using `includes`, not fuzzy matching. `""` returns `[]`; a whitespace-only string currently matches all provinces after trimming. |

See the **[online API reference](https://www.thai-address-select-lib.taotech.site/#api)** for the full walkthrough.

## Bundled dataset

The checked-in `src/data/thai-address.json` snapshot contains:

| Level                     | Records |
| ------------------------- | ------: |
| Provinces / จังหวัด       |      77 |
| Districts / อำเภอ・เขต    |     929 |
| Subdistricts / ตำบล・แขวง |   7,451 |

These are counts of records in this repository, not a guarantee of current administrative boundaries. The data is packaged with the library and does not update automatically. Check its suitability for your application before use.

จำนวนข้างต้นนับจากไฟล์ข้อมูลใน repository ข้อมูลไม่ได้อัปเดตจากภายนอกอัตโนมัติ

## Local development

To work on the library or run the documentation website locally, use Node.js 22.12+ or 24+ for the documentation tooling:

```bash
git clone https://github.com/rratchapol/thai-address-select-lib.git
cd thai-address-select-lib
npm install
npm run docs:dev
```

Open the local URL printed in the terminal.

| Command                | Output                                                       |
| ---------------------- | ------------------------------------------------------------ |
| `npm run build`        | Builds the library and TypeScript declarations into `dist/`. |
| `npm run docs:dev`     | Starts the documentation development server.                 |
| `npm run docs:build`   | Builds the static documentation website into `docs-dist/`.   |
| `npm run docs:preview` | Previews the built documentation website locally.            |

The library instance requires a browser DOM (`document`, `EventTarget`, and `CustomEvent`). For server-rendered frameworks, initialize it on the client after the form mounts. ESM imports with a bundler are the documented integration path; this README does not demonstrate CommonJS `require()`.

## Links

- **[Live demo & documentation](https://www.thai-address-select-lib.taotech.site)**
- [npm: thai-address-select](https://www.npmjs.com/package/thai-address-select)
- [Source code](https://github.com/rratchapol/thai-address-select-lib)
- [Report an issue](https://github.com/rratchapol/thai-address-select-lib/issues)

Maintained by [rratchapol](https://github.com/rratchapol).

## License

MIT, as declared in `package.json`.
