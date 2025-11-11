// src/utils/filterAddress.ts
import rawAddressData from "../data/thai-address.json";
let data = rawAddressData;
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
export function getProvinces() {
    return [...new Set(data.map(p => p.name_th))].sort((a, b) => a.localeCompare(b, "th"));
}
/**
 * คืนค่าอำเภอ/เขต ของจังหวัดที่ระบุ
 */
export function getDistricts(province) {
    const found = data.find(p => p.name_th === province);
    if (!found || !found.districts)
        return [];
    return found.districts.map((d) => d.name_th).sort((a, b) => a.localeCompare(b, "th"));
}
/**
 * คืนชื่อตำบล ของจังหวัด + อำเภอที่ระบุ
 */
export function getSubDistricts(province, district) {
    const found = data.find(p => p.name_th === province);
    if (!found || !found.districts)
        return [];
    const foundDistrict = found.districts.find((d) => d.name_th === district);
    if (!foundDistrict || !foundDistrict.sub_districts)
        return [];
    return foundDistrict.sub_districts.map((s) => s.name_th).sort((a, b) => a.localeCompare(b, "th"));
}
export function getzip_code(province, district, subDistrict) {
    const foundProvince = data.find(p => p.name_th === province);
    if (!foundProvince || !foundProvince.districts)
        return undefined;
    const foundDistrict = foundProvince.districts.find((d) => d.name_th === district);
    if (!foundDistrict || !foundDistrict.sub_districts)
        return undefined;
    const foundSub = foundDistrict.sub_districts.find((s) => s.name_th === subDistrict);
    return foundSub?.zip_code?.toString();
}
/**
 * ค้นหาข้อมูลแบบ fuzzy (optional)
 */
export function findProvinceByName(q) {
    if (!q)
        return [];
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
