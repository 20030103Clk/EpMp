"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  statistics: {
    getStatistics: async () => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/statistics`,
          method: "GET"
        });
        common_vendor.index.__f__("log", "at pages/production/report/report.vue:77", "Get statistics API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data.data;
          } else if (response.data) {
            return response.data.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/report/report.vue:87", "Get statistics error:", error);
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
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/report/report.vue:109", "Get records error:", error);
        throw error;
      }
    }
  }
};
const _sfc_main = {
  data() {
    return {
      totalOutput: 0,
      avgPassRate: 0,
      totalDevices: 0,
      deviceRunning: 8,
      deviceIdle: 2,
      deviceFault: 1,
      yieldData: [],
      qualityData: []
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  methods: {
    loadData() {
      common_vendor.index.showLoading({ title: "加载数据..." });
      api.statistics.getStatistics().then((data) => {
        common_vendor.index.hideLoading();
        this.updateCharts(data);
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "加载失败，使用模拟数据", icon: "none" });
        this.loadMockData();
      });
      api.record.getRecords().then((res) => {
        if (res.success) {
          const total = res.data.list.reduce((sum, record) => sum + (record.output || 0), 0);
          this.totalOutput = total;
        }
      }).catch(() => {
      });
    },
    loadMockData() {
      this.totalOutput = 1250;
      this.avgPassRate = 95.5;
      this.totalDevices = 11;
      this.deviceRunning = 8;
      this.deviceIdle = 2;
      this.deviceFault = 1;
      this.yieldData = [
        { date: "1日", output: 120, percent: 60 },
        { date: "2日", output: 150, percent: 75 },
        { date: "3日", output: 130, percent: 65 },
        { date: "4日", output: 180, percent: 90 },
        { date: "5日", output: 160, percent: 80 }
      ];
      this.qualityData = [
        { product: "产品A", rate: 98 },
        { product: "产品B", rate: 95 },
        { product: "产品C", rate: 92 },
        { product: "产品D", rate: 96 }
      ];
    },
    updateCharts(data) {
      this.totalDevices = 11;
      if (data.deviceData && data.deviceData.length > 0) {
        const running = data.deviceData.find((d) => d.status === "运行中");
        const idle = data.deviceData.find((d) => d.status === "待机");
        const fault = data.deviceData.find((d) => d.status === "故障");
        this.deviceRunning = running ? running.count : 8;
        this.deviceIdle = idle ? idle.count : 2;
        this.deviceFault = fault ? fault.count : 1;
      }
      if (data.yieldData && data.yieldData.length > 0) {
        const maxOutput = Math.max(...data.yieldData.map((item) => item.output));
        this.yieldData = data.yieldData.map((item) => ({
          date: item.date ? item.date.substring(5) : "",
          output: item.output,
          percent: maxOutput > 0 ? item.output / maxOutput * 100 : 0
        }));
      } else {
        this.yieldData = [
          { date: "1日", output: 120, percent: 60 },
          { date: "2日", output: 150, percent: 75 },
          { date: "3日", output: 130, percent: 65 },
          { date: "4日", output: 180, percent: 90 },
          { date: "5日", output: 160, percent: 80 }
        ];
      }
      if (data.qualityData && data.qualityData.length > 0) {
        this.qualityData = data.qualityData.map((item) => ({
          product: item.product || "产品",
          rate: item.rate ? Math.round(item.rate * 100) / 100 : 0
        }));
        const totalRate = this.qualityData.reduce((sum, item) => sum + item.rate, 0);
        this.avgPassRate = Math.round(totalRate / this.qualityData.length * 100) / 100;
      } else {
        this.qualityData = [
          { product: "产品A", rate: 98 },
          { product: "产品B", rate: 95 },
          { product: "产品C", rate: 92 },
          { product: "产品D", rate: 96 }
        ];
        this.avgPassRate = 95.25;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.totalOutput),
    b: common_vendor.t($data.avgPassRate),
    c: common_vendor.t($data.totalDevices),
    d: common_vendor.f($data.yieldData, (item, index, i0) => {
      return {
        a: item.percent + "%",
        b: common_vendor.t(item.date),
        c: common_vendor.t(item.output),
        d: index
      };
    }),
    e: common_vendor.f($data.qualityData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.product),
        b: item.rate + "%",
        c: common_vendor.t(item.rate),
        d: index
      };
    }),
    f: common_vendor.t($data.deviceRunning),
    g: common_vendor.t($data.deviceIdle),
    h: common_vendor.t($data.deviceFault)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5f1c47b3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/report/report.js.map
