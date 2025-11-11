// src/components/ThaiAddressSelect.ts
import { getProvinces, getDistricts, getSubDistricts, getzip_code } from "../utils/filterAddress.js";
export class ThaiAddressSelect extends EventTarget {
    constructor(options) {
        super();
        this.onProvinceChange = (e) => {
            const province = e.target.value || undefined;
            this.populateDistricts(province);
            this.populateSubDistricts(undefined, undefined);
            this.dispatchEvent(new CustomEvent("provinceChange", { detail: { province } }));
            this.emitSelectIfComplete();
        };
        this.onDistrictChange = (e) => {
            const district = e.target.value || undefined;
            const province = this.provinceEl.value || undefined;
            this.populateSubDistricts(province, district);
            this.dispatchEvent(new CustomEvent("districtChange", { detail: { province, district } }));
            this.emitSelectIfComplete();
        };
        this.onSubDistrictChange = (e) => {
            const subDistrict = e.target.value || undefined;
            const province = this.provinceEl.value || undefined;
            const district = this.districtEl.value || undefined;
            this.dispatchEvent(new CustomEvent("subDistrictChange", { detail: { province, district, subDistrict } }));
            this.emitSelectIfComplete();
        };
        if (!options || !options.provinceEl || !options.districtEl || !options.subDistrictEl) {
            throw new Error("provinceEl, districtEl and subDistrictEl are required");
        }
        this.provinceEl = options.provinceEl;
        this.districtEl = options.districtEl;
        this.subDistrictEl = options.subDistrictEl;
        this.placeholder = {
            province: options.placeholder?.province ?? "เลือกจังหวัด",
            district: options.placeholder?.district ?? "เลือกอำเภอ/เขต",
            subDistrict: options.placeholder?.subDistrict ?? "เลือกตำบล/แขวง"
        };
        this.init(options.initialValue);
        this.attachListeners();
    }
    allProvinces() {
        return getProvinces();
    }
    districtsFor(province) {
        if (!province)
            return [];
        return getDistricts(province);
    }
    subDistrictsFor(province, district) {
        if (!province || !district)
            return [];
        return getSubDistricts(province, district);
    }
    clearSelect(el) {
        el.innerHTML = "";
    }
    addPlaceholder(el, text) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.text = text;
        opt.disabled = true;
        opt.selected = true;
        el.appendChild(opt);
    }
    populateProvinces(selected) {
        this.clearSelect(this.provinceEl);
        this.addPlaceholder(this.provinceEl, this.placeholder?.province ?? "เลือกจังหวัด");
        this.allProvinces().forEach(p => {
            const opt = document.createElement("option");
            opt.value = p;
            opt.text = p;
            if (selected !== undefined && selected === p)
                opt.selected = true;
            this.provinceEl.appendChild(opt);
        });
    }
    populateDistricts(province, selected) {
        this.clearSelect(this.districtEl);
        this.addPlaceholder(this.districtEl, this.placeholder?.district ?? "เลือกอำเภอ/เขต");
        if (!province)
            return;
        this.districtsFor(province).forEach(d => {
            const opt = document.createElement("option");
            opt.value = d;
            opt.text = d;
            if (selected !== undefined && selected === d)
                opt.selected = true;
            this.districtEl.appendChild(opt);
        });
    }
    populateSubDistricts(province, district, selected) {
        this.clearSelect(this.subDistrictEl);
        this.addPlaceholder(this.subDistrictEl, this.placeholder?.subDistrict ?? "เลือกตำบล/แขวง");
        if (!province || !district)
            return;
        this.subDistrictsFor(province, district).forEach(s => {
            const opt = document.createElement("option");
            opt.value = s;
            opt.text = s;
            if (selected !== undefined && selected === s)
                opt.selected = true;
            this.subDistrictEl.appendChild(opt);
        });
    }
    attachListeners() {
        this.provinceEl.addEventListener("change", this.onProvinceChange);
        this.districtEl.addEventListener("change", this.onDistrictChange);
        this.subDistrictEl.addEventListener("change", this.onSubDistrictChange);
    }
    emitSelectIfComplete() {
        const value = this.getValue();
        if (value.province && value.district && value.subDistrict) {
            this.dispatchEvent(new CustomEvent("selectChange", { detail: value }));
        }
    }
    getValue() {
        const province = this.provinceEl.value || undefined;
        const district = this.districtEl.value || undefined;
        const subDistrict = this.subDistrictEl.value || undefined;
        const zip_code = province && district && subDistrict
            ? getzip_code(province, district, subDistrict)
            : undefined;
        return { province, district, subDistrict, zip_code };
    }
    setValue(value) {
        const { province, district, subDistrict } = value || {};
        this.populateProvinces(province);
        if (province) {
            this.populateDistricts(province, district);
            if (district) {
                this.populateSubDistricts(province, district, subDistrict);
            }
            else {
                this.populateSubDistricts(undefined, undefined);
            }
        }
        else {
            this.populateDistricts(undefined);
            this.populateSubDistricts(undefined, undefined);
        }
    }
    init(initial) {
        this.populateProvinces(initial?.province);
        if (initial?.province) {
            this.populateDistricts(initial.province, initial?.district);
            if (initial?.district) {
                this.populateSubDistricts(initial.province, initial.district, initial?.subDistrict);
            }
        }
        else {
            this.populateDistricts(undefined);
            this.populateSubDistricts(undefined, undefined);
        }
    }
    destroy() {
        this.provinceEl.removeEventListener("change", this.onProvinceChange);
        this.districtEl.removeEventListener("change", this.onDistrictChange);
        this.subDistrictEl.removeEventListener("change", this.onSubDistrictChange);
    }
}
export default ThaiAddressSelect;
