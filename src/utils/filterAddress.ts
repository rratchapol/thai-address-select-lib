// src/utils/filterAddress.ts
import rawAddressData from "../data/thai-address.json";

let data: any[] = rawAddressData;

/**
 * ฟังก์ชันโหลดข้อมูลจากไฟล์ JSON
 */
export async function loadData() {
  // Data already loaded from import
  return Promise.resolve();
}

/**
 * คืนค่าชื่อจังหวัดทั้งหมด (sorted)
 */
export function getProvinces(): string[] {
  return [...new Set(data.map(p => p.name_th))].sort((a, b) => a.localeCompare(b, "th"));
}

/**
 * คืนค่าอำเภอ/เขต ของจังหวัดที่ระบุ
 */
export function getDistricts(province: string): string[] {
  const found = data.find(p => p.name_th === province);
  if (!found || !found.districts) return [];
  return found.districts.map((d: any) => d.name_th).sort((a: any, b: any) => a.localeCompare(b, "th"));
}

/**
 * คืนชื่อตำบล ของจังหวัด + อำเภอที่ระบุ
 */
export function getSubDistricts(province: string, district: string): string[] {
  const found = data.find(p => p.name_th === province);
  if (!found || !found.districts) return [];
  const foundDistrict = found.districts.find((d: any) => d.name_th === district);
  if (!foundDistrict || !foundDistrict.sub_districts) return [];
  return foundDistrict.sub_districts.map((s: any) => s.name_th).sort((a: any, b: any) => a.localeCompare(b, "th"));
}

export function getzip_code(province: string, district: string, subDistrict: string): string | undefined {
  const foundProvince = data.find(p => p.name_th === province);
  if (!foundProvince || !foundProvince.districts) return undefined;
  const foundDistrict = foundProvince.districts.find((d: any) => d.name_th === district);
  if (!foundDistrict || !foundDistrict.sub_districts) return undefined;
  const foundSub = foundDistrict.sub_districts.find((s: any) => s.name_th === subDistrict);
  return foundSub?.zip_code?.toString();
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
  loadData,
  getProvinces,
  getDistricts,
  getSubDistricts,
  getzip_code,
  findProvinceByName
};
