"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  record: {
    getRecords: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/record${queryString ? `?${queryString}` : ""}`,
          method: "GET"
        });
        common_vendor.index.__f__("log", "at pages/production/record/record.vue:107", "Get records API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/record/record.vue:117", "Get records error:", error);
        throw error;
      }
    }
  },
  equipment: {
    getEquipments: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/equipment${queryString ? `?${queryString}` : ""}`,
          method: "GET"
        });
        common_vendor.index.__f__("log", "at pages/production/record/record.vue:130", "Get equipments API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/record/record.vue:140", "Get equipments error:", error);
        throw error;
      }
    }
  }
};
const _sfc_main = {
  name: "RecordPage",
  data() {
    return {
      filterDevices: [
        { id: 0, name: "全部设备" },
        { id: 1, name: "生产线1" },
        { id: 2, name: "生产线2" },
        { id: 3, name: "生产线3" }
      ],
      filters: {
        productName: "",
        equipmentName: "",
        reportDate: ""
      },
      equipmentFilterIndex: 0,
      productionRecords: []
    };
  },
  computed: {
    filteredRecords() {
      const records = Array.isArray(this.productionRecords) ? this.productionRecords : Object.values(this.productionRecords);
      return records.filter((record) => {
        if (this.filters.productName && !record.productName.includes(this.filters.productName)) {
          return false;
        }
        if (this.filters.equipmentName && this.filters.equipmentName.trim() && this.filters.equipmentName !== "全部设备" && record.equipmentName !== this.filters.equipmentName) {
          return false;
        }
        if (this.filters.reportDate) {
          const recordDate = record.reportTime.split(" ")[0];
          if (recordDate !== this.filters.reportDate) {
            return false;
          }
        }
        return true;
      });
    }
  },
  onLoad() {
    this.initData();
  },
  onShow() {
    this.loadRecords();
  },
  methods: {
    initData() {
      this.loadRecords();
      this.loadEquipments();
    },
    loadRecords() {
      common_vendor.index.showLoading({ title: "加载中..." });
      api.record.getRecords().then((res) => {
        common_vendor.index.hideLoading();
        if (res && res.success && res.data && res.data.list) {
          const records = res.data.list;
          if (records.length > 0) {
            this.productionRecords = records.map((record) => {
              const output = record.output || 0;
              const qual = record.qual || 0;
              const unqual = record.unqual || 0;
              const qualifiedRate = output > 0 ? Math.round(qual / output * 100 * 10) / 10 : 0;
              return {
                id: record.record_id,
                productName: record.product || "未知产品",
                quantity: output,
                qualifiedQuantity: qual,
                rejectQuantity: unqual,
                qualifiedRate,
                equipmentId: record.equio,
                equipmentName: record.equio || "未知设备",
                reportTime: record.date ? this.formatDate(record.date) : "未知时间",
                reportPerson: record.name || "未知人员",
                remark: record.md || ""
              };
            });
          } else {
            this.productionRecords = [];
          }
        } else {
          common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      });
    },
    formatDate(dateStr) {
      if (!dateStr)
        return "";
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    loadEquipments() {
      api.equipment.getEquipments().then((res) => {
        if (res.success) {
          this.filterDevices = [
            { id: 0, name: "全部设备" },
            ...res.data.list.map((equip) => ({
              id: equip.equioment_id,
              name: equip.equio
            }))
          ];
        }
      });
    },
    onEquipmentFilterChange(e) {
      this.equipmentFilterIndex = e.detail.value;
      this.filters.equipmentName = this.equipmentFilterIndex === 0 ? "" : this.filterDevices[this.equipmentFilterIndex].name;
      if (this.equipmentFilterIndex === 0) {
        this.searchRecords();
      }
    },
    onDateChange(e) {
      this.filters.reportDate = e.detail.value;
    },
    resetFilters() {
      this.filters = {
        productName: "",
        equipmentName: "",
        reportDate: ""
      };
      this.equipmentFilterIndex = 0;
    },
    searchRecords() {
      common_vendor.index.showLoading({ title: "查询中..." });
      const params = {};
      if (this.filters.productName)
        params.product = this.filters.productName;
      if (this.filters.equipmentName && this.filters.equipmentName.trim() && this.filters.equipmentName !== "全部设备")
        params.equio = this.filters.equipmentName;
      if (this.filters.reportDate)
        params.date = this.filters.reportDate;
      api.record.getRecords(params).then((res) => {
        common_vendor.index.hideLoading();
        if (res && res.success && res.data && res.data.list) {
          const records = res.data.list;
          if (records.length > 0) {
            this.productionRecords = records.map((record) => {
              const output = record.output || 0;
              const qual = record.qual || 0;
              const unqual = record.unqual || 0;
              const qualifiedRate = output > 0 ? Math.round(qual / output * 100 * 10) / 10 : 0;
              return {
                id: record.record_id,
                productName: record.product || "未知产品",
                quantity: output,
                qualifiedQuantity: qual,
                rejectQuantity: unqual,
                qualifiedRate,
                equipmentId: record.equio,
                equipmentName: record.equio || "未知设备",
                reportTime: record.date ? this.formatDate(record.date) : "未知时间",
                reportPerson: record.name || "未知人员",
                remark: record.md || ""
              };
            });
          } else {
            this.productionRecords = [];
          }
        } else {
          common_vendor.index.showToast({ title: "查询失败", icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.filters.productName,
    b: common_vendor.o(($event) => $data.filters.productName = $event.detail.value, "11"),
    c: common_vendor.t($data.equipmentFilterIndex === 0 ? "全部设备" : $data.filterDevices[$data.equipmentFilterIndex].name),
    d: common_vendor.o((...args) => $options.onEquipmentFilterChange && $options.onEquipmentFilterChange(...args), "13"),
    e: $data.equipmentFilterIndex,
    f: $data.filterDevices,
    g: common_vendor.t($data.filters.reportDate || "选择日期"),
    h: $data.filters.reportDate,
    i: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args), "db"),
    j: common_vendor.o((...args) => $options.searchRecords && $options.searchRecords(...args), "03"),
    k: common_vendor.o((...args) => $options.resetFilters && $options.resetFilters(...args), "00"),
    l: common_vendor.t($options.filteredRecords.length),
    m: common_vendor.f($options.filteredRecords, (record, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(record.id),
        b: common_vendor.t(record.productName),
        c: common_vendor.t(record.productName),
        d: common_vendor.t(record.quantity),
        e: common_vendor.t(record.qualifiedQuantity),
        f: common_vendor.t(record.rejectQuantity),
        g: common_vendor.t(record.qualifiedRate),
        h: common_vendor.t(record.equipmentName),
        i: common_vendor.t(record.reportTime),
        j: common_vendor.t(record.reportPerson),
        k: record.remark
      }, record.remark ? {
        l: common_vendor.t(record.remark)
      } : {}, {
        m: record.id
      });
    }),
    n: $options.filteredRecords.length === 0
  }, $options.filteredRecords.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0c295e82"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/record/record.js.map
