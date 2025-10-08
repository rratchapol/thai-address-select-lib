// src/utils/filterAddress.ts
// import rawData from "../data/thai-address.json";

export type ThaiAddressData = Record<string, Record<string, string[]>>;

let data: any = {};

/**
 * ฟังก์ชันโหลดข้อมูลจากไฟล์ JSON
 */
export async function loadData() {
  const res = await fetch('/dist/src/data/thai-address.json');
  data = await res.json();
}

/**
 * คืนค่าชื่อจังหวัดทั้งหมด (sorted)
 */
export function getProvinces(): string[] {
  return Object.keys(data).sort((a, b) => a.localeCompare(b, "th"));
}

/**
 * คืนค่าอำเภอ/เขต ของจังหวัดที่ระบุ
 */
export function getDistricts(province: string): string[] {
  if (!province || !data[province]) return [];
  return Object.keys(data[province]).sort((a, b) => a.localeCompare(b, "th"));
}

/**
 * คืนค่าตำบลของจังหวัด + อำเภอที่ระบุ
 */
export function getSubDistricts(province: string, district: string): string[] {
  if (!province || !district) return [];
  const p = data[province];
  if (!p) return [];
  return (p[district] || []).slice().sort((a: any, b: any) => a.localeCompare(b, "th"));
}

/**
 * ค้นหาข้อมูลแบบ fuzzy (optional)
 */
export function findProvinceByName(q: string): string[] {
  if (!q) return [];
  const ql = q.trim();
  return getProvinces().filter(p => p.includes(ql));
}

export default {
  getProvinces,
  getDistricts,
  getSubDistricts,
  findProvinceByName
};
