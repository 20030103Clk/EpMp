"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "RecordPage",
  data() {
    return {
      // 设备列表（用于过滤）
      filterDevices: [
        { id: 0, name: "全部设备" },
        { id: 1, name: "生产线1" },
        { id: 2, name: "生产线2" },
        { id: 3, name: "生产线3" }
      ],
      // 过滤条件
      filters: {
        productName: "",
        equipmentId: 0,
        reportDate: ""
      },
      // 设备过滤索引
      equipmentFilterIndex: 0,
      // 生产记录数据
      productionRecords: [
        {
          id: "R001",
          productName: "产品A",
          quantity: 100,
          rejectQuantity: 5,
          qualifiedRate: 95,
          equipmentId: 1,
          equipmentName: "生产线1",
          reportTime: "2026-01-19 09:30:00",
          reportPerson: "张三",
          remark: "正常生产"
        },
        {
          id: "R002",
          productName: "产品A",
          quantity: 120,
          rejectQuantity: 3,
          qualifiedRate: 97.5,
          equipmentId: 1,
          equipmentName: "生产线1",
          reportTime: "2026-01-19 11:30:00",
          reportPerson: "张三",
          remark: "生产效率提升"
        },
        {
          id: "R003",
          productName: "产品D",
          quantity: 80,
          rejectQuantity: 2,
          qualifiedRate: 97.5,
          equipmentId: 2,
          equipmentName: "生产线2",
          reportTime: "2026-01-19 10:00:00",
          reportPerson: "李四",
          remark: "设备运行稳定"
        },
        {
          id: "R004",
          productName: "产品D",
          quantity: 90,
          rejectQuantity: 1,
          qualifiedRate: 98.9,
          equipmentId: 2,
          equipmentName: "生产线2",
          reportTime: "2026-01-19 14:00:00",
          reportPerson: "李四",
          remark: "无异常"
        },
        {
          id: "R005",
          productName: "产品A",
          quantity: 110,
          rejectQuantity: 4,
          qualifiedRate: 96.4,
          equipmentId: 1,
          equipmentName: "生产线1",
          reportTime: "2026-01-19 16:00:00",
          reportPerson: "张三",
          remark: "接近目标产量"
        }
      ]
    };
  },
  computed: {
    // 过滤后的记录
    filteredRecords() {
      return this.productionRecords.filter((record) => {
        if (this.filters.productName && !record.productName.includes(this.filters.productName)) {
          return false;
        }
        if (this.filters.equipmentId && record.equipmentId !== this.filters.equipmentId) {
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
  methods: {
    // 初始化数据
    initData() {
      const savedRecords = common_vendor.index.getStorageSync("productionRecords");
      if (savedRecords && savedRecords.length > 0) {
        this.productionRecords = savedRecords;
      }
    },
    // 设备过滤变更
    onEquipmentFilterChange(e) {
      this.equipmentFilterIndex = e.detail.value;
      this.filters.equipmentId = this.filterDevices[this.equipmentFilterIndex].id;
    },
    // 日期选择变更
    onDateChange(e) {
      this.filters.reportDate = e.detail.value;
    },
    // 重置过滤条件
    resetFilters() {
      this.filters = {
        productName: "",
        equipmentId: 0,
        reportDate: ""
      };
      this.equipmentFilterIndex = 0;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.filters.productName,
    b: common_vendor.o(($event) => $data.filters.productName = $event.detail.value),
    c: common_vendor.t($data.equipmentFilterIndex === 0 ? "全部设备" : $data.filterDevices[$data.equipmentFilterIndex].name),
    d: common_vendor.o((...args) => $options.onEquipmentFilterChange && $options.onEquipmentFilterChange(...args)),
    e: $data.equipmentFilterIndex,
    f: $data.filterDevices,
    g: common_vendor.t($data.filters.reportDate || "选择日期"),
    h: $data.filters.reportDate,
    i: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    j: common_vendor.o((...args) => _ctx.searchRecords && _ctx.searchRecords(...args)),
    k: common_vendor.o((...args) => $options.resetFilters && $options.resetFilters(...args)),
    l: common_vendor.t($options.filteredRecords.length),
    m: common_vendor.f($options.filteredRecords, (record, k0, i0) => {
      return {
        a: common_vendor.t(record.productName),
        b: common_vendor.t(record.equipmentName),
        c: common_vendor.t(record.reportTime),
        d: common_vendor.t(record.reportPerson),
        e: record.id
      };
    }),
    n: $options.filteredRecords.length === 0
  }, $options.filteredRecords.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0c295e82"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/record/record.js.map
