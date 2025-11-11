export interface ThaiAddressSelectOptions {
    provinceEl: HTMLSelectElement;
    districtEl: HTMLSelectElement;
    subDistrictEl: HTMLSelectElement;
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
    getValue(): ThaiAddressValue & {
        zip_code?: string;
    };
    setValue(value: ThaiAddressValue): void;
    private init;
    destroy(): void;
}
export default ThaiAddressSelect;
