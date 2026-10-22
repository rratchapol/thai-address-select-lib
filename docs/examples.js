export const snippets = {
  local: {
    filename: "Terminal · repository root",
    code: `npm install
npm run docs:dev

# สร้างเว็บสำหรับนำไป host แบบ static
npm run docs:build
npm run docs:preview`,
  },
  html: {
    filename: "index.html",
    code: `<label for="province">จังหวัด</label>
<select id="province"></select>

<label for="district">อำเภอ / เขต</label>
<select id="district"></select>

<label for="subDistrict">ตำบล / แขวง</label>
<select id="subDistrict"></select>

<label for="zipCode">รหัสไปรษณีย์</label>
<input id="zipCode" readonly />

<script type="module" src="/main.js"></script>`,
  },
  javascript: {
    filename: "main.js",
    code: `import { ThaiAddressSelect, loadData } from "thai-address-select";

// ปัจจุบันข้อมูลพร้อมจาก import แล้ว
await loadData();

const address = new ThaiAddressSelect({
  provinceEl: document.getElementById("province"),
  districtEl: document.getElementById("district"),
  subDistrictEl: document.getElementById("subDistrict"),
});

const zipCode = document.getElementById("zipCode");
const updateZipCode = () => {
  zipCode.value = address.getValue().zip_code ?? "";
};

const events = [
  "provinceChange", "districtChange", "subDistrictChange"
];
events.forEach((event) => {
  address.addEventListener(event, updateZipCode);
});
updateZipCode();`,
  },
  events: {
    filename: "main.js · ต่อจากตัวอย่างด้านบน",
    code: `const onComplete = (event) => {
  console.log(event.detail);
  // { province: "กรุงเทพมหานคร", district: "เขตบางรัก",
  //   subDistrict: "สีลม", zip_code: "10500" }
};

address.addEventListener("selectChange", onComplete);

// เรียกเมื่อถอดฟอร์มหรือเปลี่ยนหน้าในแอปของคุณ
function cleanupAddressForm() {
  events.forEach((event) => {
    address.removeEventListener(event, updateZipCode);
  });
  address.removeEventListener("selectChange", onComplete);
  address.destroy();
}`,
  },
  customize: {
    filename: "main.js · ใช้กับ HTML ในตัวอย่างเริ่มต้น",
    description:
      "ใช้แทน main.js เดิมเพื่อกำหนด placeholder และที่อยู่เริ่มต้น พร้อมอัปเดตรหัสไปรษณีย์เมื่อผู้ใช้เปลี่ยนค่า",
    code: `import { ThaiAddressSelect } from "thai-address-select";

const address = new ThaiAddressSelect({
  provinceEl: document.getElementById("province"),
  districtEl: document.getElementById("district"),
  subDistrictEl: document.getElementById("subDistrict"),
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

const sync = () => {
  document.getElementById("zipCode").value =
    address.getValue().zip_code ?? "";
};
const events = [
  "provinceChange", "districtChange", "subDistrictChange"
];
events.forEach((event) => address.addEventListener(event, sync));
sync(); // initialValue ไม่ส่ง event

function resetAddress() {
  address.setValue({});
  sync(); // setValue() ไม่ส่ง event เช่นกัน
}

function cleanupAddressForm() {
  events.forEach((event) => address.removeEventListener(event, sync));
  address.destroy();
}`,
  },
  react: {
    filename: "AddressForm.tsx",
    description:
      "สร้าง instance หลัง mount บน client พร้อม cleanup และป้องกัน async initialization หลัง unmount ใช้ใน React หรือ Next.js Client Component",
    code: `"use client";

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
          provinceEl, districtEl, subDistrictEl,
        });
        const sync = () => {
          setZipCode(address.getValue().zip_code ?? "");
        };
        const events = [
          "provinceChange", "districtChange", "subDistrictChange"
        ];
        events.forEach((event) => address.addEventListener(event, sync));
        dispose = () => {
          events.forEach((event) => {
            address.removeEventListener(event, sync);
          });
          address.destroy();
        };
        sync();
        setReady(true);
      } catch {
        if (!cancelled) setError("โหลดข้อมูลไม่สำเร็จ กรุณาโหลดหน้าใหม่");
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
      <label>จังหวัด <select ref={provinceRef} /></label>
      <label>อำเภอ / เขต <select ref={districtRef} /></label>
      <label>ตำบล / แขวง <select ref={subDistrictRef} /></label>
      <label>รหัสไปรษณีย์ <input value={zipCode} readOnly /></label>
      {error && <p role="alert">{error}</p>}
    </fieldset>
  );
}`,
  },
  utilities: {
    filename: "address-data.js",
    description:
      "ใช้ข้อมูลกับ UI ของคุณเอง โดยไม่ต้องสร้าง ThaiAddressSelect ค่า string ต้องตรงกับชื่อใน dataset",
    code: `import {
  loadData,
  getProvinces,
  getDistricts,
  getSubDistricts,
  getzip_code,
  findProvinceByName,
} from "thai-address-select/utils";

await loadData();

const provinces = getProvinces(); // string[] เรียงตามภาษาไทย
const districts = getDistricts("กรุงเทพมหานคร");
const subDistricts = getSubDistricts("กรุงเทพมหานคร", "เขตบางรัก");

const zipCode = getzip_code("กรุงเทพมหานคร", "เขตบางรัก", "สีลม");
console.log(zipCode); // "10500" (string)

console.log(findProvinceByName("เชียง"));
// ["เชียงราย", "เชียงใหม่"]

console.log(getDistricts("ไม่มีจังหวัดนี้")); // []
console.log(getzip_code("ไม่มีจังหวัดนี้", "", "")); // undefined`,
  },
  structure: {
    filename: "Project structure",
    code: `src/
├── index.ts                       # public exports และ types
├── components/
│   └── ThaiAddressSelect.ts        # DOM, state และ events
├── utils/
│   └── filterAddress.ts            # ฟังก์ชันค้นหาข้อมูล
└── data/
    └── thai-address.json           # จังหวัด → อำเภอ → ตำบล

dist/                              # ผล build ไลบรารี (tsc)
docs/                              # style, interaction และตัวอย่าง
index.html                         # เว็บเอกสารนี้
vite.config.mjs                    # config สำหรับเว็บเอกสาร
docs-dist/                         # ผล build เว็บ (ไม่ commit)
test.ts                            # ตัวอย่างทดลอง DOM ไม่ใช่ test runner`,
  },
};
