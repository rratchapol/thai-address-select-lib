# thai-address-select

[English](#english) | [ไทย](#thai)

---

<a name="english"></a>
## English

A lightweight TypeScript library for creating linked dropdowns for Thai address selection (Province → District → Subdistrict) with automatic postal code retrieval.

### Features

- 🇹🇭 **Complete Thai address database** - All provinces, districts, subdistricts, and postal codes
- 🔗 **Auto-linked dropdowns** - Selecting province automatically filters districts, and so on
- 📮 **Automatic postal code** - Postal code is retrieved when address is complete
- 🎨 **Framework agnostic** - Works with Vanilla JS, React, Vue, Angular, etc.
- 💪 **TypeScript support** - Full type definitions included
- 📦 **Zero dependencies** - Lightweight and fast
- 🚀 **Easy to use** - Simple API with minimal setup

### Installation

```bash
npm install thai-address-select
```

### Quick Start

#### Basic HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<body>
  <select id="province"></select>
  <select id="district"></select>
  <select id="subDistrict"></select>
  <input id="zipCode" readonly>

  <script type="module">
    import { ThaiAddressSelect } from './node_modules/thai-address-select/dist/src/index.js';
    import { loadData } from './node_modules/thai-address-select/dist/src/utils/filterAddress.js';

    // 1. Load data first
    await loadData();

    // 2. Initialize
    const thaiAddress = new ThaiAddressSelect({
      provinceEl: document.getElementById("province"),
      districtEl: document.getElementById("district"),
      subDistrictEl: document.getElementById("subDistrict")
    });

    // 3. Listen for changes
    thaiAddress.addEventListener("selectChange", (e) => {
      document.getElementById("zipCode").value = e.detail.zip_code || "";
      console.log(e.detail); // { province, district, subDistrict, zip_code }
    });
  </script>
</body>
</html>
```

> **Note:** Make sure to run this through a local server (e.g., `npx serve .`) because ES modules don't work with `file://` protocol.

### Usage with React

```tsx
"use client";

import { useEffect, useRef, useState } from 'react';

export default function AddressForm() {
  const provinceRef = useRef<HTMLSelectElement>(null);
  const districtRef = useRef<HTMLSelectElement>(null);
  const subDistrictRef = useRef<HTMLSelectElement>(null);
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    let thaiAddress: any;

    const init = async () => {
      // Dynamic import to avoid SSR issues
      const { ThaiAddressSelect } = await import('thai-address-select');
      const { loadData } = await import('thai-address-select');

      await loadData();

      if (provinceRef.current && districtRef.current && subDistrictRef.current) {
        thaiAddress = new ThaiAddressSelect({
          provinceEl: provinceRef.current,
          districtEl: districtRef.current,
          subDistrictEl: subDistrictRef.current
        });

        thaiAddress.addEventListener('selectChange', (e: any) => {
          setZipCode(e.detail.zip_code || '');
        });
      }
    };

    init();

    return () => thaiAddress?.destroy();
  }, []);

  return (
    <div>
      <select ref={provinceRef} className="w-full p-2 border rounded" />
      <select ref={districtRef} className="w-full p-2 border rounded" />
      <select ref={subDistrictRef} className="w-full p-2 border rounded" />
      <input value={zipCode} readOnly className="w-full p-2 border rounded bg-gray-100" />
    </div>
  );
}
```

### API Reference

#### ThaiAddressSelect

##### Constructor Options

```typescript
interface ThaiAddressSelectOptions {
  provinceEl: HTMLSelectElement;      // Required: Province dropdown element
  districtEl: HTMLSelectElement;      // Required: District dropdown element
  subDistrictEl: HTMLSelectElement;   // Required: Subdistrict dropdown element
  placeholder?: {                     // Optional: Custom placeholder text
    province?: string;
    district?: string;
    subDistrict?: string;
  };
  initialValue?: {                    // Optional: Set initial values
    province?: string;
    district?: string;
    subDistrict?: string;
  };
}
```

##### Methods

**`getValue()`**  
Returns current selected values including postal code.

```javascript
const value = thaiAddress.getValue();
// Returns: { province?: string, district?: string, subDistrict?: string, zip_code?: string }
```

**`setValue(value)`**  
Set values programmatically.

```javascript
thaiAddress.setValue({
  province: "กรุงเทพมหานคร",
  district: "เขตบางรัก",
  subDistrict: "มหาพฤฒาราม"
});
```

**`destroy()`**  
Remove event listeners and clean up.

```javascript
thaiAddress.destroy();
```

##### Events

**`selectChange`**  
Fired when all dropdowns (province, district, subdistrict) have values.

```javascript
thaiAddress.addEventListener("selectChange", (e) => {
  console.log(e.detail.province);     // "กรุงเทพมหานคร"
  console.log(e.detail.district);     // "เขตบางรัก"
  console.log(e.detail.subDistrict);  // "มหาพฤฒาราม"
  console.log(e.detail.zip_code);     // "10500"
});
```

**`provinceChange`, `districtChange`, `subDistrictChange`**  
Fired when individual dropdown changes.

```javascript
thaiAddress.addEventListener("provinceChange", (e) => {
  console.log(e.detail.province);
});
```

#### Utility Functions

These functions can be used independently without creating a ThaiAddressSelect instance.

**`loadData()`**  
Must be called before using any other functions.

```javascript
import { loadData } from 'thai-address-select';
await loadData();
```

**`getProvinces()`**  
Returns array of all province names (sorted in Thai alphabetical order).

```javascript
import { getProvinces } from 'thai-address-select';
const provinces = getProvinces();
// ["กระบี่", "กรุงเทพมหานคร", ...]
```

**`getDistricts(province)`**  
Returns array of district names for a given province.

```javascript
import { getDistricts } from 'thai-address-select';
const districts = getDistricts("กรุงเทพมหานคร");
// ["เขตบางกอกน้อย", "เขตบางกอกใหญ่", ...]
```

**`getSubDistricts(province, district)`**  
Returns array of subdistrict names for a given province and district.

```javascript
import { getSubDistricts } from 'thai-address-select';
const subDistricts = getSubDistricts("กรุงเทพมหานคร", "เขตบางรัก");
// ["มหาพฤฒาราม", "สีลม", "สุริยวงศ์", ...]
```

**`getzip_code(province, district, subDistrict)`**  
Returns postal code for a given address.

```javascript
import { getzip_code } from 'thai-address-select';
const zipCode = getzip_code("กรุงเทพมหานคร", "เขตบางรัก", "มหาพฤฒาราม");
// "10500"
```

### Customization

#### Custom Placeholders

```javascript
const thaiAddress = new ThaiAddressSelect({
  provinceEl: provinceEl,
  districtEl: districtEl,
  subDistrictEl: subDistrictEl,
  placeholder: {
    province: "Select Province",
    district: "Select District",
    subDistrict: "Select Subdistrict"
  }
});
```

#### Initial Values

```javascript
const thaiAddress = new ThaiAddressSelect({
  provinceEl: provinceEl,
  districtEl: districtEl,
  subDistrictEl: subDistrictEl,
  initialValue: {
    province: "กรุงเทพมหานคร",
    district: "เขตบางรัก",
    subDistrict: "มหาพฤฒาราม"
  }
});
```

### Data Source

The library includes a complete database of Thai administrative divisions:
- 77 Provinces
- 928 Districts
- 7,255 Subdistricts
- Postal codes for all areas

### Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)


### Author

**rratchapol**


---

<a name="thai"></a>
## ไทย

ไลบรารี TypeScript น้ำหนักเบาสำหรับสร้าง dropdown เลือกที่อยู่ไทยแบบเชื่อมโยง (จังหวัด → อำเภอ → ตำบล) พร้อมดึงรหัสไปรษณีย์อัตโนมัติ

### ฟีเจอร์

- 🇹🇭 **ฐานข้อมูลที่อยู่ไทยครบถ้วน** - จังหวัด อำเภอ ตำบล และรหัสไปรษณีย์ทั้งหมด
- 🔗 **Dropdown เชื่อมโยงอัตโนมัติ** - เลือกจังหวัดแล้วกรองอำเภอให้อัตโนมัติ
- 📮 **รหัสไปรษณีย์อัตโนมัติ** - ดึงรหัสไปรษณีย์เมื่อเลือกที่อยู่ครบถ้วน
- 🎨 **ใช้ได้กับทุก Framework** - รองรับ Vanilla JS, React, Vue, Angular ฯลฯ
- 💪 **รองรับ TypeScript** - มี type definitions ครบถ้วน
- 📦 **ไม่มี dependencies** - เบาและรวดเร็ว
- 🚀 **ใช้งานง่าย** - API เรียบง่าย ติดตั้งไม่ยุ่งยาก

### การติดตั้ง

```bash
npm install thai-address-select
```

### เริ่มต้นใช้งาน

#### HTML + JavaScript พื้นฐาน

```html
<!DOCTYPE html>
<html>
<body>
  <select id="province"></select>
  <select id="district"></select>
  <select id="subDistrict"></select>
  <input id="zipCode" readonly>

  <script type="module">
    import { ThaiAddressSelect } from './node_modules/thai-address-select/dist/src/index.js';
    import { loadData } from './node_modules/thai-address-select/dist/src/utils/filterAddress.js';

    // 1. โหลดข้อมูลก่อน
    await loadData();

    // 2. สร้าง instance
    const thaiAddress = new ThaiAddressSelect({
      provinceEl: document.getElementById("province"),
      districtEl: document.getElementById("district"),
      subDistrictEl: document.getElementById("subDistrict")
    });

    // 3. รอรับการเปลี่ยนแปลง
    thaiAddress.addEventListener("selectChange", (e) => {
      document.getElementById("zipCode").value = e.detail.zip_code || "";
      console.log(e.detail); // { province, district, subDistrict, zip_code }
    });
  </script>
</body>
</html>
```

> **หมายเหตุ:** ต้องรันผ่าน local server (เช่น `npx serve .`) เพราะ ES modules ใช้งานไม่ได้กับ `file://` protocol

### การใช้งานกับ React

```tsx
"use client";

import { useEffect, useRef, useState } from 'react';

export default function AddressForm() {
  const provinceRef = useRef<HTMLSelectElement>(null);
  const districtRef = useRef<HTMLSelectElement>(null);
  const subDistrictRef = useRef<HTMLSelectElement>(null);
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    let thaiAddress: any;

    const init = async () => {
      // Dynamic import เพื่อหลีกเลี่ยงปัญหา SSR
      const { ThaiAddressSelect } = await import('thai-address-select');
      const { loadData } = await import('thai-address-select');

      await loadData();

      if (provinceRef.current && districtRef.current && subDistrictRef.current) {
        thaiAddress = new ThaiAddressSelect({
          provinceEl: provinceRef.current,
          districtEl: districtRef.current,
          subDistrictEl: subDistrictRef.current
        });

        thaiAddress.addEventListener('selectChange', (e: any) => {
          setZipCode(e.detail.zip_code || '');
        });
      }
    };

    init();

    return () => thaiAddress?.destroy();
  }, []);

  return (
    <div>
      <select ref={provinceRef} className="w-full p-2 border rounded" />
      <select ref={districtRef} className="w-full p-2 border rounded" />
      <select ref={subDistrictRef} className="w-full p-2 border rounded" />
      <input value={zipCode} readOnly className="w-full p-2 border rounded bg-gray-100" />
    </div>
  );
}
```

### API Reference

#### ThaiAddressSelect

##### ตัวเลือก Constructor

```typescript
interface ThaiAddressSelectOptions {
  provinceEl: HTMLSelectElement;      // จำเป็น: Element dropdown จังหวัด
  districtEl: HTMLSelectElement;      // จำเป็น: Element dropdown อำเภอ
  subDistrictEl: HTMLSelectElement;   // จำเป็น: Element dropdown ตำบล
  placeholder?: {                     // ไม่จำเป็น: ข้อความ placeholder
    province?: string;
    district?: string;
    subDistrict?: string;
  };
  initialValue?: {                    // ไม่จำเป็น: ค่าเริ่มต้น
    province?: string;
    district?: string;
    subDistrict?: string;
  };
}
```

##### Methods

**`getValue()`**  
คืนค่าที่เลือกปัจจุบัน รวมรหัสไปรษณีย์

```javascript
const value = thaiAddress.getValue();
// คืนค่า: { province?: string, district?: string, subDistrict?: string, zip_code?: string }
```

**`setValue(value)`**  
ตั้งค่าผ่านโค้ด

```javascript
thaiAddress.setValue({
  province: "กรุงเทพมหานคร",
  district: "เขตบางรัก",
  subDistrict: "มหาพฤฒาราม"
});
```

**`destroy()`**  
ลบ event listeners และทำความสะอาด

```javascript
thaiAddress.destroy();
```

##### Events

**`selectChange`**  
ทำงานเมื่อ dropdown ทั้งหมด (จังหวัด อำเภอ ตำบล) มีค่า

```javascript
thaiAddress.addEventListener("selectChange", (e) => {
  console.log(e.detail.province);     // "กรุงเทพมหานคร"
  console.log(e.detail.district);     // "เขตบางรัก"
  console.log(e.detail.subDistrict);  // "มหาพฤฒาราม"
  console.log(e.detail.zip_code);     // "10500"
});
```

**`provinceChange`, `districtChange`, `subDistrictChange`**  
ทำงานเมื่อ dropdown แต่ละตัวเปลี่ยนแปลง

```javascript
thaiAddress.addEventListener("provinceChange", (e) => {
  console.log(e.detail.province);
});
```

#### ฟังก์ชันเสริม

ฟังก์ชันเหล่านี้สามารถใช้งานแยกโดยไม่ต้องสร้าง instance ของ ThaiAddressSelect

**`loadData()`**  
ต้องเรียกก่อนใช้ฟังก์ชันอื่นๆ

```javascript
import { loadData } from 'thai-address-select';
await loadData();
```

**`getProvinces()`**  
คืน array ชื่อจังหวัดทั้งหมด (เรียงตามตัวอักษรไทย)

```javascript
import { getProvinces } from 'thai-address-select';
const provinces = getProvinces();
// ["กระบี่", "กรุงเทพมหานคร", ...]
```

**`getDistricts(province)`**  
คืน array ชื่ออำเภอของจังหวัดที่ระบุ

```javascript
import { getDistricts } from 'thai-address-select';
const districts = getDistricts("กรุงเทพมหานคร");
// ["เขตบางกอกน้อย", "เขตบางกอกใหญ่", ...]
```

**`getSubDistricts(province, district)`**  
คืน array ชื่อตำบลของจังหวัดและอำเภอที่ระบุ

```javascript
import { getSubDistricts } from 'thai-address-select';
const subDistricts = getSubDistricts("กรุงเทพมหานคร", "เขตบางรัก");
// ["มหาพฤฒาราม", "สีลม", "สุริยวงศ์", ...]
```

**`getzip_code(province, district, subDistrict)`**  
คืนรหัสไปรษณีย์ของที่อยู่ที่ระบุ

```javascript
import { getzip_code } from 'thai-address-select';
const zipCode = getzip_code("กรุงเทพมหานคร", "เขตบางรัก", "มหาพฤฒาราม");
// "10500"
```

### การปรับแต่ง

#### ปรับแต่ง Placeholder

```javascript
const thaiAddress = new ThaiAddressSelect({
  provinceEl: provinceEl,
  districtEl: districtEl,
  subDistrictEl: subDistrictEl,
  placeholder: {
    province: "เลือกจังหวัด",
    district: "เลือกอำเภอ",
    subDistrict: "เลือกตำบล"
  }
});
```

#### ตั้งค่าเริ่มต้น

```javascript
const thaiAddress = new ThaiAddressSelect({
  provinceEl: provinceEl,
  districtEl: districtEl,
  subDistrictEl: subDistrictEl,
  initialValue: {
    province: "กรุงเทพมหานคร",
    district: "เขตบางรัก",
    subDistrict: "มหาพฤฒาราม"
  }
});
```

### ข้อมูลที่รวมอยู่

ไลบรารีรวมฐานข้อมูลการแบ่งเขตการปกครองของไทยครบถ้วน:
- 77 จังหวัด
- 928 อำเภอ/เขต
- 7,255 ตำบล/แขวง
- รหัสไปรษณีย์ครบทุกพื้นที่

### Browser ที่รองรับ

- Browser สมัยใหม่ที่รองรับ ES6+
- Chrome, Firefox, Safari, Edge (เวอร์ชันล่าสุด)



### ผู้พัฒนา

**rratchapol**






