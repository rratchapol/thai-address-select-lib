// src/utils/filterAddress.ts
// import rawData from "../data/thai-address.json";

export type ThaiAddressData = Record<string, Record<string, string[]>>;

let rawData: any[] = [];

/**
 * ฟังก์ชันโหลดข้อมูลจากไฟล์ JSON
 */
export async function loadData() {
  const res = await fetch('/dist/src/data/thai-address.json');
  rawData = await res.json();
}

/**
 * คืนค่าชื่อจังหวัดทั้งหมด (sorted)
 */
export function getProvinces(): string[] {
  return rawData.map(p => p.name_th).sort((a, b) => a.localeCompare(b, "th"));
}

/**
 * คืนค่าอำเภอ/เขต ของจังหวัดที่ระบุ
 */
export function getDistricts(province: string): string[] {
  const found = rawData.find(p => p.name_th === province);
  if (!found || !found.districts) return [];
  return found.districts.map((d: any) => d.name_th).sort((a:any, b:any) => a.localeCompare(b, "th"));
}

/**
 * คืนชื่อตำบล ของจังหวัด + อำเภอที่ระบุ
 */
export function getSubDistricts(province: string, district: string): string[] {
  const found = rawData.find(p => p.name_th === province);
  if (!found || !found.districts) return [];
  const foundDistrict = found.districts.find((d: any) => d.name_th === district);
  if (!foundDistrict || !foundDistrict.sub_districts) return [];
  return foundDistrict.sub_districts.map((s: any) => s.name_th).sort((a: any, b: any) => a.localeCompare(b, "th"));
}

export function getzip_code(province: string, district: string, subDistrict: string): string | undefined {
  const found = rawData.find(p => p.name_th === province);
  if (!found || !found.districts) return undefined;
  const foundDistrict = found.districts.find((d: any) => d.name_th === district);
  if (!foundDistrict || !foundDistrict.sub_districts) return undefined;
  const foundSub = foundDistrict.sub_districts.find((s: any) => s.name_th === subDistrict);
  return foundSub?.zip_code;
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
  getzip_code,
  findProvinceByName
};
