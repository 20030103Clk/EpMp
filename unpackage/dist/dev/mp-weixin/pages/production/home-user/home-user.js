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
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/home-user/home-user.vue:126", "Get plans error:", error);
        throw error;
      }
    }
  }
};
const _sfc_main = {
  data() {
    return {
      recentOrders: [],
      completedTasks: 0,
      completionRate: 0
    };
  },
  computed: {
    username() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo ? userInfo.username : "未登录";
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
    loadData() {
      this.loadRecentOrders();
    },
    loadRecentOrders() {
      api.plan.getPlans({ page: 1, pageSize: 3 }).then((res) => {
        if (res.success) {
          this.recentOrders = res.data.list.map((plan) => ({
            id: plan.plan_id,
            product: plan.product,
            quantity: plan.quantity,
            status: plan.status,
            statusText: plan.statusText
          }));
          this.completedTasks = this.recentOrders.filter((o) => o.status === "completed").length * 42;
          this.completionRate = 98.5;
        } else {
          this.recentOrders = [
            { id: 1, product: "茶", quantity: 5e3, status: "in_progress", statusText: "生产中" },
            { id: 2, product: "不锈钢组装件", quantity: 800, status: "pending", statusText: "待生产" }
          ];
          this.completedTasks = 128;
          this.completionRate = 98.5;
        }
      }).catch(() => {
        this.recentOrders = [
          { id: 1, product: "茶", quantity: 5e3, status: "in_progress", statusText: "生产中" },
          { id: 2, product: "不锈钢组装件", quantity: 800, status: "pending", statusText: "待生产" }
        ];
        this.completedTasks = 128;
        this.completionRate = 98.5;
      });
    },
    navigateTo(page) {
      common_vendor.index.navigateTo({
        url: `/pages/production/${page}/${page}`
      });
    },
    navigateToProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/production/profile/profile"
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
  return {
    a: common_vendor.f(15, (n, k0, i0) => {
      return {
        a: n,
        b: common_vendor.s($options.getParticleStyle(n))
      };
    }),
    b: common_vendor.t($options.username),
    c: common_vendor.t($options.currentDate),
    d: common_vendor.t($options.username.charAt(0)),
    e: common_vendor.o((...args) => $options.navigateToProfile && $options.navigateToProfile(...args), "f7"),
    f: common_vendor.p({
      type: "calendar",
      size: "36"
    }),
    g: common_vendor.o(($event) => $options.navigateTo("plan"), "9c"),
    h: common_vendor.p({
      type: "gear",
      size: "36"
    }),
    i: common_vendor.o(($event) => $options.navigateTo("execution"), "1f"),
    j: common_vendor.t($data.completedTasks),
    k: common_vendor.t($data.completionRate),
    l: common_vendor.p({
      type: "checkmark",
      size: "32"
    }),
    m: common_vendor.o(($event) => $options.navigateTo("quality"), "8f"),
    n: common_vendor.p({
      type: "list",
      size: "32"
    }),
    o: common_vendor.o(($event) => $options.navigateTo("record"), "89"),
    p: common_vendor.p({
      type: "box",
      size: "32"
    }),
    q: common_vendor.o(($event) => $options.navigateTo("inventory"), "23"),
    r: common_vendor.o(($event) => $options.navigateTo("plan"), "8e"),
    s: common_vendor.f($data.recentOrders, (task, index, i0) => {
      return {
        a: common_vendor.t(task.product),
        b: common_vendor.t(task.statusText),
        c: common_vendor.n(task.status),
        d: common_vendor.t(task.id),
        e: common_vendor.t(task.quantity),
        f: index,
        g: common_vendor.o(($event) => $options.navigateTo("plan"), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-793d7e52"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/home-user/home-user.js.map
