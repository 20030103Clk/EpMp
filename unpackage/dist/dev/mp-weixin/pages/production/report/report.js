"use strict";
const common_vendor = require("../../../common/vendor.js");
const formatDateLabel = (dateStr) => {
  if (!dateStr)
    return "";
  try {
    if (dateStr.includes("T")) {
      const date = new Date(dateStr);
      const day = date.getDate();
      return `${day}日`;
    } else if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (parts.length >= 3) {
        return `${parts[2]}日`;
      }
    }
    return dateStr;
  } catch (error) {
    common_vendor.index.__f__("error", "at pages/production/report/report.vue:87", "Date format error:", error);
    return dateStr;
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
    refreshTabBar() {
      if (typeof this.$mp.page.getTabBar === "function") {
        const tabBar = this.$mp.page.getTabBar();
        if (tabBar && tabBar.updateTabList) {
          tabBar.updateTabList();
        }
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    loadData() {
      this.loadMockData();
    },
    loadMockData() {
      this.totalOutput = 890;
      this.avgPassRate = 86.19;
      this.totalDevices = 11;
      this.deviceRunning = 8;
      this.deviceIdle = 2;
      this.deviceFault = 1;
      const mockYieldData = [
        { date: "18日", output: 120 },
        { date: "19日", output: 200 },
        { date: "20日", output: 150 },
        { date: "21日", output: 180 },
        { date: "22日", output: 240 }
      ];
      const maxOutput = Math.max(...mockYieldData.map((item) => item.output));
      common_vendor.index.__f__("log", "at pages/production/report/report.vue:188", "maxOutput:", maxOutput);
      this.yieldData = mockYieldData.map((item) => {
        const percent = item.output / maxOutput * 100;
        common_vendor.index.__f__("log", "at pages/production/report/report.vue:192", `日期: ${item.date}, 产量: ${item.output}, 百分比: ${percent}%`);
        return {
          date: item.date,
          output: item.output,
          percent
        };
      });
      common_vendor.index.__f__("log", "at pages/production/report/report.vue:200", "yieldData:", JSON.stringify(this.yieldData));
      this.qualityData = [
        { product: "不锈钢组件", rate: 90 },
        { product: "装配件", rate: 90 },
        { product: "茶", rate: 78.57 }
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
        const outputs = data.yieldData.map((item) => item.output || 0);
        const maxOutput = Math.max(...outputs);
        if (maxOutput > 0) {
          this.yieldData = data.yieldData.map((item) => ({
            date: formatDateLabel(item.date),
            output: item.output || 0,
            percent: item.output / maxOutput * 100
          }));
        } else {
          this.loadDefaultYieldData();
        }
      } else {
        this.loadDefaultYieldData();
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
          { product: "不锈钢组件", rate: 90 },
          { product: "装配件", rate: 90 },
          { product: "茶", rate: 78.57 }
        ];
        this.avgPassRate = 86.19;
      }
    },
    loadDefaultYieldData() {
      this.yieldData = [
        { date: "1日", output: 120, percent: 60 },
        { date: "2日", output: 150, percent: 75 },
        { date: "3日", output: 130, percent: 65 },
        { date: "4日", output: 180, percent: 90 },
        { date: "5日", output: 160, percent: 80 }
      ];
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
