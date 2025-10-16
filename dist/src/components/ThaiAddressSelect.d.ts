import { ThaiAddressData } from "../utils/filterAddress.js";
export interface ThaiAddressSelectOptions {
    provinceEl: HTMLSelectElement;
    districtEl: HTMLSelectElement;
    subDistrictEl: HTMLSelectElement;
    data?: ThaiAddressData;
    placeholder?: {
        province?: string;
        district?: string;
        subDistrict?: string;
    };
    initialValue?: {
        province?: string;
        district?: string;
        subDistrict?: string;
    };
}
export interface ThaiAddressValue {
    province?: string;
    district?: string;
    subDistrict?: string;
}
export declare class ThaiAddressSelect extends EventTarget {
    private provinceEl;
    private districtEl;
    private subDistrictEl;
    private placeholder;
    private dataOverride?;
    constructor(options: ThaiAddressSelectOptions);
    private allProvinces;
    private districtsFor;
    private subDistrictsFor;
    private clearSelect;
    private addPlaceholder;
    private populateProvinces;
    private populateDistricts;
    private populateSubDistricts;
    private attachListeners;
    private onProvinceChange;
    private onDistrictChange;
    private onSubDistrictChange;
    private emitSelectIfComplete;
    /**
     * คืนค่าปัจจุบัน
     */
    getValue(): ThaiAddressValue & {
        zip_code?: string;
    };
    /**
     * ตั้งค่าจากภายนอก (ช่วยสำหรับกรณีต้องการ set ค่า default)
     */
    setValue(value: ThaiAddressValue): void;
    /**
     * เริ่มต้น
     */
    private init;
    /**
     * ทำความสะอาด listener เมื่อต้องการ destroy
     */
    destroy(): void;
}
export default ThaiAddressSelect;
