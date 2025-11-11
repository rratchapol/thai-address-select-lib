# thai-address-select .

A lightweight, vanilla JavaScript library for creating linked province → district → subdistrict dropdowns for Thailand with automatic postal code retrieval.

## Features

- 🇹🇭 Complete Thai address database (provinces, districts, subdistricts, postal codes)
- 🔗 Auto-linked dropdowns (selecting province filters districts, etc.)
- 📮 Automatic postal code retrieval
- 🎨 Framework agnostic (works with Vanilla JS, React, Angular, Vue, etc.)
- 📦 Zero dependencies
- 💪 Written in TypeScript
- 🚀 Lightweight and fast

## Installation

```bash
npm install thai-address-select
```

## Usage

### HTML Setup

```html
<select id="province"></select>
<select id="district"></select>
<select id="subDistrict"></select>
<span id="postalCode"></span>
```

### JavaScript/TypeScript

```javascript
import ThaiAddressSelect from 'thai-address-select';
import { loadData } from 'thai-address-select/utils';

// Load data first
await loadData();

// Get select elements
const provinceEl = document.getElementById("province");
const districtEl = document.getElementById("district");
const subDistrictEl = document.getElementById("subDistrict");
const postalCodeEl = document.getElementById("postalCode");

// Initialize
const thaiAddress = new ThaiAddressSelect({
  provinceEl,
  districtEl,
  subDistrictEl,
  placeholder: {
    province: "Select Province",
    district: "Select District",
    subDistrict: "Select Subdistrict"
  }
});

// Listen for changes
thaiAddress.addEventListener("selectChange", (e) => {
  postalCodeEl.textContent = e.detail.zip_code ?? "-";
  console.log(e.detail); // { province, district, subDistrict, zip_code }
});
```

## API

### Constructor Options

```typescript
interface ThaiAddressSelectOptions {
  provinceEl: HTMLSelectElement;
  districtEl: HTMLSelectElement;
  subDistrictEl: HTMLSelectElement;
  placeholder?: {
    province?: string;
    district?: string;
    subDistrict?: string;
  };
  dataOverride?: any; // Optional custom data
}
```

### Methods

#### `getValue()`
Returns the current selected values.

```javascript
const value = thaiAddress.getValue();
// { province: "กรุงเทพมหานคร", district: "เขตบางรัก", subDistrict: "มหาพฤฒาราม", zip_code: "10500" }
```

#### `setValue(value)`
Set values programmatically.

```javascript
thaiAddress.setValue({
  province: "กรุงเทพมหานคร",
  district: "เขตบางรัก",
  subDistrict: "มหาพฤฒาราม"
});
```

#### `destroy()`
Remove event listeners and clean up.

```javascript
thaiAddress.destroy();
```

### Events

#### `selectChange`
Fired when any dropdown value changes.

```javascript
thaiAddress.addEventListener("selectChange", (e) => {
  console.log(e.detail);
  // { province, district, subDistrict, zip_code }
});
```

## Utility Functions

### `loadData()`
Loads the Thai address database (must be called before using the library).

```javascript
import { loadData } from 'thai-address-select/utils';
await loadData();
```

### `getProvinces()`
Returns all provinces.

```javascript
import { getProvinces } from 'thai-address-select/utils';
const provinces = getProvinces();
```

### `getDistricts(province)`
Returns districts for a given province.

```javascript
import { getDistricts } from 'thai-address-select/utils';
const districts = getDistricts("กรุงเทพมหานคร");
```

### `getSubDistricts(province, district)`
Returns subdistricts for a given province and district.

```javascript
import { getSubDistricts } from 'thai-address-select/utils';
const subDistricts = getSubDistricts("กรุงเทพมหานคร", "เขตบางรัก");
```

### `getzip_code(province, district, subDistrict)`
Returns postal code for a given address.

```javascript
import { getzip_code } from 'thai-address-select/utils';
const zipCode = getzip_code("กรุงเทพมหานคร", "เขตบางรัก", "มหาพฤฒาราม");
// "10500"
```

## Example with React

```jsx
import { useEffect, useRef, useState } from 'react';
import ThaiAddressSelect from 'thai-address-select';
import { loadData } from 'thai-address-select/utils';

function AddressForm() {
  const provinceRef = useRef(null);
  const districtRef = useRef(null);
  const subDistrictRef = useRef(null);
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    let thaiAddress;
    
    const init = async () => {
      await loadData();
      
      thaiAddress = new ThaiAddressSelect({
        provinceEl: provinceRef.current,
        districtEl: districtRef.current,
        subDistrictEl: subDistrictRef.current
      });

      thaiAddress.addEventListener('selectChange', (e) => {
        setZipCode(e.detail.zip_code || '');
      });
    };

    init();

    return () => {
      thaiAddress?.destroy();
    };
  }, []);

  return (
    <div>
      <select ref={provinceRef}></select>
      <select ref={districtRef}></select>
      <select ref={subDistrictRef}></select>
      <span>Postal Code: {zipCode}</span>
    </div>
  );
}
```


## Author

rratchapol

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
