"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  quality: {
    getQualities: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/quality${queryString ? `?${queryString}` : ""}`,
          method: "GET"
        });
        common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:128", "GET qualities API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/quality/quality.vue:140", "Get qualities error:", error);
        throw error;
      }
    },
    createQuality: async (data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/quality`,
          method: "POST",
          data,
          header: {
            "Content-Type": "application/json; charset=utf-8"
          }
        });
        common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:155", "Create quality API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/quality/quality.vue:167", "Create quality error:", error);
        throw error;
      }
    },
    deleteQuality: async (id) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/quality/${id}`,
          method: "DELETE"
        });
        common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:178", "Delete quality API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/quality/quality.vue:190", "Delete quality error:", error);
        throw error;
      }
    }
  },
  record: {
    getRecords: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/record${queryString ? `?${queryString}` : ""}`,
          method: "GET"
        });
        common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:204", "Get records API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/quality/quality.vue:216", "Get records error:", error);
        throw error;
      }
    }
  }
};
const _sfc_main = {
  data() {
    return {
      passRate: "",
      inspectionRecords: [],
      productionRecords: []
    };
  },
  computed: {
    // 计算合格率
    computedPassRate() {
      if (this.inspectionRecords.length === 0 && this.productionRecords.length === 0)
        return 0;
      let totalQuantity = 0;
      let passQuantity = 0;
      totalQuantity += this.inspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
      passQuantity += this.inspectionRecords.filter((item) => item.result === "pass").reduce((acc, cur) => acc + cur.quantity, 0);
      totalQuantity += this.productionRecords.reduce((acc, cur) => acc + cur.output, 0);
      passQuantity += this.productionRecords.reduce((acc, cur) => acc + cur.qual, 0);
      return totalQuantity > 0 ? (passQuantity / totalQuantity * 100).toFixed(2) : "0.00";
    },
    // 计算今日合格率
    computedTodayPassRate() {
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
      let totalQuantity = 0;
      let passQuantity = 0;
      const todayInspectionRecords = this.inspectionRecords.filter((item) => item.inspectionTime.startsWith(today));
      totalQuantity += todayInspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
      passQuantity += todayInspectionRecords.filter((item) => item.result === "pass").reduce((acc, cur) => acc + cur.quantity, 0);
      const todayProductionRecords = this.productionRecords.filter((item) => item.date && item.date.toString().startsWith(today));
      totalQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.output, 0);
      passQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.qual, 0);
      return totalQuantity > 0 ? (passQuantity / totalQuantity * 100).toFixed(2) : "0.00";
    },
    // 计算今日检测数量
    todayInspections() {
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
      let totalQuantity = 0;
      const todayInspectionRecords = this.inspectionRecords.filter((item) => item.inspectionTime.startsWith(today));
      totalQuantity += todayInspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
      const todayProductionRecords = this.productionRecords.filter((item) => item.date && item.date.toString().startsWith(today));
      totalQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.output, 0);
      return totalQuantity;
    },
    // 计算今日合格数量
    rejectCount() {
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
      let passQuantity = 0;
      const todayInspectionRecords = this.inspectionRecords.filter((item) => item.inspectionTime.startsWith(today));
      passQuantity += todayInspectionRecords.filter((item) => item.result === "pass").reduce((acc, cur) => acc + cur.quantity, 0);
      const todayProductionRecords = this.productionRecords.filter((item) => item.date && item.date.toString().startsWith(today));
      passQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.qual, 0);
      return passQuantity;
    },
    // 计算今日不合格数量
    todayUnqualCount() {
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
      let unqualQuantity = 0;
      const todayInspectionRecords = this.inspectionRecords.filter((item) => item.inspectionTime.startsWith(today));
      unqualQuantity += todayInspectionRecords.filter((item) => item.result === "fail").reduce((acc, cur) => acc + cur.quantity, 0);
      const todayProductionRecords = this.productionRecords.filter((item) => item.date && item.date.toString().startsWith(today));
      unqualQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.unqual, 0);
      return unqualQuantity;
    },
    // 计算总检测数量
    totalInspections() {
      let totalQuantity = 0;
      totalQuantity += this.inspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
      totalQuantity += this.productionRecords.reduce((acc, cur) => acc + cur.output, 0);
      return totalQuantity;
    },
    // 计算总合格数量
    computedPassCount() {
      let passQuantity = 0;
      passQuantity += this.inspectionRecords.filter((item) => item.result === "pass").reduce((acc, cur) => acc + cur.quantity, 0);
      passQuantity += this.productionRecords.reduce((acc, cur) => acc + cur.qual, 0);
      return passQuantity;
    },
    // 计算总不合格数量
    totalUnqualCount() {
      let unqualQuantity = 0;
      const inspectionUnqual = this.inspectionRecords.reduce((acc, cur) => acc + (cur.unqual || 0), 0);
      unqualQuantity += inspectionUnqual;
      const productionUnqual = this.productionRecords.reduce((acc, cur) => acc + (cur.unqual || 0), 0);
      unqualQuantity += productionUnqual;
      common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:357", "总不合格数量计算:", {
        inspectionUnqual,
        productionUnqual,
        unqualQuantity,
        productionRecordsLength: this.productionRecords.length
      });
      return unqualQuantity;
    },
    // 按产品分类统计不合格数量
    unqualByProduct() {
      const unqualByProductMap = /* @__PURE__ */ new Map();
      this.inspectionRecords.forEach((record) => {
        const product = record.product || "未知产品";
        const currentUnqual = unqualByProductMap.get(product) || 0;
        unqualByProductMap.set(product, currentUnqual + (record.unqual || 0));
      });
      this.productionRecords.forEach((record) => {
        const product = record.product || "未知产品";
        const currentUnqual = unqualByProductMap.get(product) || 0;
        unqualByProductMap.set(product, currentUnqual + (record.unqual || 0));
      });
      return Array.from(unqualByProductMap.entries()).map(([product, unqual]) => ({
        product,
        unqual
      }));
    },
    // 判断是否为管理员
    isAdmin() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo && userInfo.level === 1;
    }
  },
  onLoad() {
    this.loadQualityRecords();
    this.loadProductionRecords();
  },
  methods: {
    // 加载质检记录
    loadQualityRecords() {
      common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:405", "开始加载质检记录...");
      common_vendor.index.showLoading({ title: "加载中..." });
      api.quality.getQualities().then((res) => {
        common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:408", "Get qualities API response:", res);
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:411", "质检记录数据:", res.data.list);
          this.inspectionRecords = res.data.list.map((record) => ({
            id: record.quality_id,
            product: record.product,
            quantity: record.quantity,
            qual: record.qual,
            unqual: record.unqual,
            result: record.qual > record.unqual ? "pass" : "fail",
            resultText: record.qual > record.unqual ? "合格" : "不合格",
            inspectionTime: record.inspection_time
          }));
          common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:422", "inspectionRecords 数组长度:", this.inspectionRecords.length);
        } else {
          common_vendor.index.__f__("error", "at pages/production/quality/quality.vue:424", "加载质检记录失败:", res.message);
          common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/production/quality/quality.vue:428", "加载质检记录失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      });
    },
    // 加载生产记录，用于统计不合格数据
    loadProductionRecords() {
      common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:437", "开始加载生产记录...");
      api.record.getRecords({ pageSize: 1e3 }).then((res) => {
        common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:439", "Get records API response:", res);
        if (res.success) {
          common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:441", "生产记录数据:", res.data.list);
          this.productionRecords = res.data.list;
          common_vendor.index.__f__("log", "at pages/production/quality/quality.vue:443", "productionRecords 数组长度:", this.productionRecords.length);
        } else {
          common_vendor.index.__f__("error", "at pages/production/quality/quality.vue:445", "加载生产记录失败:", res.message);
          this.productionRecords = [];
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/production/quality/quality.vue:450", "加载生产记录失败:", error);
        this.productionRecords = [];
      });
    },
    openQualityReport() {
      this.$refs.qualityReportPopup.open("center");
    },
    closeQualityReport() {
      this.$refs.qualityReportPopup.close();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.computedPassRate),
    b: common_vendor.t($options.totalInspections),
    c: common_vendor.t($options.computedPassCount),
    d: common_vendor.t($options.totalUnqualCount),
    e: common_vendor.f($data.inspectionRecords, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.id),
        b: common_vendor.t(item.resultText),
        c: common_vendor.n(item.result),
        d: common_vendor.t(item.product),
        e: common_vendor.t(item.quantity),
        f: common_vendor.t(item.inspectionTime)
      }, $options.isAdmin ? {
        g: common_vendor.o(($event) => _ctx.deleteInspection(index), index)
      } : {}, {
        h: index
      });
    }),
    f: $options.isAdmin,
    g: common_vendor.o((...args) => $options.openQualityReport && $options.openQualityReport(...args), "91"),
    h: common_vendor.t((/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN")),
    i: common_vendor.t($options.todayInspections),
    j: common_vendor.t($options.rejectCount),
    k: common_vendor.t($options.todayUnqualCount),
    l: common_vendor.t($options.computedTodayPassRate),
    m: common_vendor.f($options.unqualByProduct, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.product),
        b: common_vendor.t(item.unqual),
        c: item.product
      };
    }),
    n: $options.unqualByProduct.length === 0
  }, $options.unqualByProduct.length === 0 ? {} : {}, {
    o: common_vendor.o((...args) => $options.closeQualityReport && $options.closeQualityReport(...args), "c3"),
    p: common_vendor.sr("qualityReportPopup", "fa3ada11-0")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fa3ada11"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/quality/quality.js.map
