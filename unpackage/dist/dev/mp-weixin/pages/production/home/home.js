"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  plan: {
    getPlans: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/plan${queryString ? `?${queryString}` : ""}`,
          method: "GET"
        });
        common_vendor.index.__f__("log", "at pages/production/home/home.vue:103", "Get plans API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/home/home.vue:115", "Get plans error:", error);
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
        common_vendor.index.__f__("log", "at pages/production/home/home.vue:129", "Get records API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/home/home.vue:141", "Get records error:", error);
        throw error;
      }
    }
  }
};
const _sfc_main = {
  data() {
    return {
      recentOrders: []
    };
  },
  computed: {
    username() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo ? userInfo.username : "未登录";
    },
    isAdmin() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo && userInfo.level === 1;
    }
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  methods: {
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.redirectTo({ url: "/pages/production/login/login" });
      }
    },
    loadData() {
      this.loadRecentOrders();
      this.loadStats();
    },
    // 加载最近订单
    loadRecentOrders() {
      api.plan.getPlans({ page: 1, pageSize: 4 }).then((res) => {
        if (res.success) {
          this.recentOrders = res.data.list.map((plan) => ({
            id: plan.plan_id,
            product: plan.product,
            quantity: plan.quantity,
            status: plan.status,
            statusText: plan.statusText
          }));
        }
      });
    },
    // 加载统计数据
    loadStats() {
      api.record.getRecords({ date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }).then((res) => {
        if (res.success) {
          res.data.list.reduce((sum, record) => sum + record.output, 0);
        }
      });
    },
    navigateTo(page) {
      common_vendor.index.navigateTo({
        url: `/pages/production/${page}/${page}`
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.username),
    b: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "calendar-filled",
      size: "35"
    }),
    c: common_vendor.o(($event) => $options.navigateTo("plan"), "ae"),
    d: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "spinner-cycle",
      size: "35"
    }),
    e: common_vendor.o(($event) => $options.navigateTo("execution"), "e3"),
    f: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "arrow-up",
      size: "35"
    }),
    g: common_vendor.o(($event) => $options.navigateTo("quality"), "d6"),
    h: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "more-filled",
      size: "35"
    }),
    i: common_vendor.o(($event) => $options.navigateTo("record"), "86"),
    j: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "bars",
      size: "35"
    }),
    k: common_vendor.o(($event) => $options.navigateTo("inventory"), "57"),
    l: $options.isAdmin
  }, $options.isAdmin ? {
    m: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "staff-filled",
      size: "35"
    }),
    n: common_vendor.o(($event) => $options.navigateTo("management"), "d4")
  } : {}, {
    o: common_vendor.o(($event) => $options.navigateTo("plan"), "2d"),
    p: common_vendor.f($data.recentOrders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.id),
        b: common_vendor.t(order.statusText),
        c: common_vendor.n(order.status),
        d: common_vendor.t(order.product),
        e: common_vendor.t(order.quantity),
        f: index
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f60c7ad9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/home/home.js.map
