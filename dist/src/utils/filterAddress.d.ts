export type ThaiAddressData = Record<string, Record<string, string[]>>;
/**
 * ฟังก์ชันโหลดข้อมูลจากไฟล์ JSON
 */
export declare function loadData(): Promise<void>;
/**
 * คืนค่าชื่อจังหวัดทั้งหมด (sorted)
 */
export declare function getProvinces(): string[];
/**
 * คืนค่าอำเภอ/เขต ของจังหวัดที่ระบุ
 */
export declare function getDistricts(province: string): string[];
/**
 * คืนชื่อตำบล ของจังหวัด + อำเภอที่ระบุ
 */
export declare function getSubDistricts(province: string, district: string): string[];
export declare function getzip_code(province: string, district: string, subDistrict: string): string | undefined;
/**
 * ค้นหาข้อมูลแบบ fuzzy (optional)
 */
export declare function findProvinceByName(q: string): string[];
declare const _default: {
    getProvinces: typeof getProvinces;
    getDistricts: typeof getDistricts;
    getSubDistricts: typeof getSubDistricts;
    getzip_code: typeof getzip_code;
    findProvinceByName: typeof findProvinceByName;
};
export default _default;
