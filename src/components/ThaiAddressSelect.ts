// src/components/ThaiAddressSelect.ts
import {
  getProvinces,
  getDistricts,
  getSubDistricts,
  ThaiAddressData,
  getzip_code
} from "../utils/filterAddress.js";

export interface ThaiAddressSelectOptions {
  provinceEl: HTMLSelectElement;
  districtEl: HTMLSelectElement;
  subDistrictEl: HTMLSelectElement;
  data?: ThaiAddressData; // optional override if user wants custom data
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

export class ThaiAddressSelect extends EventTarget {
  private provinceEl: HTMLSelectElement;
  private districtEl: HTMLSelectElement;
  private subDistrictEl: HTMLSelectElement;
  private placeholder: Required<ThaiAddressSelectOptions["placeholder"]>;
  private dataOverride?: ThaiAddressData;

  constructor(options: ThaiAddressSelectOptions) {
    super();
    if (!options || !options.provinceEl || !options.districtEl || !options.subDistrictEl) {
      throw new Error("provinceEl, districtEl and subDistrictEl are required");
    }

    this.provinceEl = options.provinceEl;
    this.districtEl = options.districtEl;
    this.subDistrictEl = options.subDistrictEl;
    this.dataOverride = options.data;

    this.placeholder = {
      province: options.placeholder?.province ?? "เลือกจังหวัด",
      district: options.placeholder?.district ?? "เลือกอำเภอ/เขต",
      subDistrict: options.placeholder?.subDistrict ?? "เลือกตำบล/แขวง"
    };

    this.init(options.initialValue);
    this.attachListeners();
  }

  private allProvinces(): string[] {
    if (this.dataOverride) return Object.keys(this.dataOverride);
    return getProvinces();
  }

  private districtsFor(province: string): string[] {
    if (!province) return [];
    if (this.dataOverride) return Object.keys(this.dataOverride[province] || {});
    return getDistricts(province);
  }

  private subDistrictsFor(province: string, district: string): string[] {
    if (!province || !district) return [];
    if (this.dataOverride) return this.dataOverride[province]?.[district] || [];
    return getSubDistricts(province, district);
  }

  private clearSelect(el: HTMLSelectElement) {
    el.innerHTML = "";
  }

  private addPlaceholder(el: HTMLSelectElement, text: string) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.text = text;
    opt.disabled = true;
    opt.selected = true;
    el.appendChild(opt);
  }

  private populateProvinces(selected?: string) {
    this.clearSelect(this.provinceEl);
    this.addPlaceholder(this.provinceEl, this.placeholder?.province ?? "เลือกจังหวัด");
    this.allProvinces().forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.text = p;
      if (selected && selected === p) opt.selected = true;
      this.provinceEl.appendChild(opt);
    });
  }

  private populateDistricts(province?: string, selected?: string) {
    this.clearSelect(this.districtEl);
    this.addPlaceholder(this.districtEl, this.placeholder?.district ?? "เลือกอำเภอ/เขต");
    if (!province) return;
    this.districtsFor(province).forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.text = d;
      if (selected && selected === d) opt.selected = true;
      this.districtEl.appendChild(opt);
    });
  }

  private populateSubDistricts(province?: string, district?: string, selected?: string) {
    this.clearSelect(this.subDistrictEl);
    this.addPlaceholder(this.subDistrictEl, this.placeholder?.subDistrict ?? "เลือกตำบล/แขวง");
    if (!province || !district) return;
    this.subDistrictsFor(province, district).forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.text = s;
      if (selected && selected === s) opt.selected = true;
      this.subDistrictEl.appendChild(opt);
    });
  }

  private attachListeners() {
    this.provinceEl.addEventListener("change", this.onProvinceChange);
    this.districtEl.addEventListener("change", this.onDistrictChange);
    this.subDistrictEl.addEventListener("change", this.onSubDistrictChange);
  }

  private onProvinceChange = (e: Event) => {
    const province = (e.target as HTMLSelectElement).value || undefined;
    // reset district & subdistrict
    this.populateDistricts(province);
    this.populateSubDistricts(undefined, undefined);
    this.dispatchEvent(
      new CustomEvent("provinceChange", { detail: { province } })
    );
    this.emitSelectIfComplete();
  };

  private onDistrictChange = (e: Event) => {
    const district = (e.target as HTMLSelectElement).value || undefined;
    const province = this.provinceEl.value || undefined;
    this.populateSubDistricts(province, district);
    this.dispatchEvent(
      new CustomEvent("districtChange", { detail: { province, district } })
    );
    this.emitSelectIfComplete();
  };

  private onSubDistrictChange = (e: Event) => {
    const subDistrict = (e.target as HTMLSelectElement).value || undefined;
    const province = this.provinceEl.value || undefined;
    const district = this.districtEl.value || undefined;
    this.dispatchEvent(
      new CustomEvent("subDistrictChange", { detail: { province, district, subDistrict } })
    );
    this.emitSelectIfComplete();
  };

  private emitSelectIfComplete() {
    const value = this.getValue();
    if (value.province && value.district && value.subDistrict) {
      this.dispatchEvent(new CustomEvent("selectChange", { detail: value }));
    }
  }

  /**
   * คืนค่าปัจจุบัน
   */
  public getValue(): ThaiAddressValue & { zip_code?: string } {
    const province = this.provinceEl.value || undefined;
    const district = this.districtEl.value || undefined;
    const subDistrict = this.subDistrictEl.value || undefined;
    const zip_code = province && district && subDistrict
      ? getzip_code(province, district, subDistrict)
      : undefined;
    return { province, district, subDistrict, zip_code };
  }

  /**
   * ตั้งค่าจากภายนอก (ช่วยสำหรับกรณีต้องการ set ค่า default)
   */
  public setValue(value: ThaiAddressValue) {
    const { province, district, subDistrict } = value || {};
    this.populateProvinces(province);
    if (province) {
      this.populateDistricts(province, district);
      if (district) {
        this.populateSubDistricts(province, district, subDistrict);
      } else {
        this.populateSubDistricts(undefined, undefined);
      }
    } else {
      this.populateDistricts(undefined);
      this.populateSubDistricts(undefined, undefined);
    }
  }

  /**
   * เริ่มต้น
   */
  private init(initial?: ThaiAddressValue) {
    this.populateProvinces(initial?.province);
    if (initial?.province) {
      this.populateDistricts(initial.province, initial?.district);
      if (initial?.district) {
        this.populateSubDistricts(initial.province, initial.district, initial?.subDistrict);
      }
    } else {
      this.populateDistricts(undefined);
      this.populateSubDistricts(undefined, undefined);
    }

    // ถ้ามีค่า initial แต่ไม่มีการเลือกแรก (placeholder selected) ให้ลบ selected attribute ของ placeholder
    // (ไม่บังคับ)
  }

  /**
   * ทำความสะอาด listener เมื่อต้องการ destroy
   */
  public destroy() {
    this.provinceEl.removeEventListener("change", this.onProvinceChange);
    this.districtEl.removeEventListener("change", this.onDistrictChange);
    this.subDistrictEl.removeEventListener("change", this.onSubDistrictChange);
  }
}

export default ThaiAddressSelect;
