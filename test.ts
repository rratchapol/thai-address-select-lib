import ThaiAddressSelect from "./src/components/ThaiAddressSelect";

// สร้าง element จำลอง
const provinceEl = document.createElement("select");
const districtEl = document.createElement("select");
const subDistrictEl = document.createElement("select");

// สร้าง instance
const thaiAddress = new ThaiAddressSelect({
  provinceEl,
  districtEl,
  subDistrictEl,
  placeholder: {
    province: "เลือกจังหวัด",
    district: "เลือกอำเภอ",
    subDistrict: "เลือกตำบล"
  }
});

// ทดลองตั้งค่าเริ่มต้น
thaiAddress.setValue({
  province: "กรุงเทพมหานคร",
  district: "บางรัก",
  subDistrict: "มหาพฤฒาราม"
});

// อ่านค่าที่เลือก
console.log(thaiAddress.getValue());

// ทดลองฟัง event
thaiAddress.addEventListener("selectChange", (e: any) => {
  console.log("เลือกครบ:", e.detail);
});