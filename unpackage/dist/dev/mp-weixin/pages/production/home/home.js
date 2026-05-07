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
        common_vendor.index.__f__("log", "at pages/production/home/home.vue:250", "Get plans API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/home/home.vue:262", "Get plans error:", error);
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
        common_vendor.index.__f__("log", "at pages/production/home/home.vue:276", "Get records API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/home/home.vue:288", "Get records error:", error);
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
    },
    currentDate() {
      const now = /* @__PURE__ */ new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      return `${month}月${day}日`;
    }
  },
  onLoad() {
    this.loadData();
    this.refreshUserInfo();
  },
  onShow() {
    this.loadData();
    this.refreshUserInfo();
  },
  methods: {
    refreshUserInfo() {
      this.$forceUpdate();
    },
    checkUserLevel() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.redirectTo({ url: "/pages/production/login/login" });
      }
    },
    refreshTabBar() {
      if (typeof this.$mp.page.getTabBar === "function") {
        const tabBar = this.$mp.page.getTabBar();
        if (tabBar && tabBar.updateTabList) {
          tabBar.updateTabList();
        }
      }
    },
    getParticleStyle(n) {
      const colors = ["#c9a962", "#d4b896", "#c5a788", "#d4c4a8", "#bfbdba"];
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 4 + Math.random() * 5;
      const size = 6 + Math.random() * 12;
      return {
        left: `${left}%`,
        width: `${size}rpx`,
        height: `${size}rpx`,
        background: colors[n % colors.length],
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      };
    },
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
    a: common_vendor.f(15, (n, k0, i0) => {
      return {
        a: n,
        b: common_vendor.s($options.getParticleStyle(n))
      };
    }),
    b: $options.isAdmin
  }, $options.isAdmin ? {
    c: common_vendor.t($options.username.charAt(0)),
    d: common_vendor.t($options.username),
    e: common_vendor.p({
      type: "trending-up",
      size: "28"
    }),
    f: common_vendor.p({
      type: "check-circle",
      size: "28"
    }),
    g: common_vendor.p({
      type: "list",
      size: "28"
    }),
    h: common_vendor.p({
      type: "settings",
      size: "28"
    }),
    i: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "calendar-filled",
      size: "40"
    }),
    j: common_vendor.o(($event) => $options.navigateTo("plan"), "60"),
    k: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "spinner-cycle",
      size: "40"
    }),
    l: common_vendor.o(($event) => $options.navigateTo("execution"), "1b"),
    m: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "arrow-up",
      size: "40"
    }),
    n: common_vendor.o(($event) => $options.navigateTo("quality"), "e3"),
    o: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "more-filled",
      size: "40"
    }),
    p: common_vendor.o(($event) => $options.navigateTo("record"), "01"),
    q: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "bars",
      size: "40"
    }),
    r: common_vendor.o(($event) => $options.navigateTo("inventory"), "f2"),
    s: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "staff-filled",
      size: "40"
    }),
    t: common_vendor.o(($event) => $options.navigateTo("management"), "07"),
    v: common_vendor.o(($event) => $options.navigateTo("plan"), "e3"),
    w: common_vendor.f($data.recentOrders, (order, index, i0) => {
      return {
        a: "f60c7ad9-10-" + i0,
        b: common_vendor.t(order.id),
        c: common_vendor.t(order.statusText),
        d: common_vendor.n(order.status),
        e: common_vendor.t(order.product),
        f: common_vendor.t(order.quantity),
        g: index
      };
    }),
    x: common_vendor.p({
      type: "file-text",
      size: "20"
    })
  } : {
    y: common_vendor.t($options.username),
    z: common_vendor.t($options.currentDate),
    A: common_vendor.t($options.username.charAt(0)),
    B: common_vendor.p({
      type: "trending-up",
      size: "48"
    }),
    C: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "calendar-filled",
      size: "36"
    }),
    D: common_vendor.p({
      type: "chevron-right",
      size: "32"
    }),
    E: common_vendor.o(($event) => $options.navigateTo("plan"), "80"),
    F: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "spinner-cycle",
      size: "36"
    }),
    G: common_vendor.p({
      type: "chevron-right",
      size: "32"
    }),
    H: common_vendor.o(($event) => $options.navigateTo("execution"), "10"),
    I: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "arrow-up",
      size: "32"
    }),
    J: common_vendor.p({
      type: "chevron-right",
      size: "28"
    }),
    K: common_vendor.o(($event) => $options.navigateTo("quality"), "93"),
    L: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "more-filled",
      size: "32"
    }),
    M: common_vendor.p({
      type: "chevron-right",
      size: "28"
    }),
    N: common_vendor.o(($event) => $options.navigateTo("record"), "25"),
    O: common_vendor.o(($event) => $options.navigateTo("plan"), "b3"),
    P: common_vendor.f($data.recentOrders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.product),
        b: common_vendor.t(order.id),
        c: common_vendor.t(order.statusText),
        d: common_vendor.n(order.status),
        e: common_vendor.t(order.quantity),
        f: index
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f60c7ad9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/home/home.js.map
