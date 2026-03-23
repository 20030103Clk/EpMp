"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      recentOrders: [
        { id: "1001", product: "产品A", quantity: 500, status: "processing", statusText: "生产中" },
        { id: "1002", product: "产品B", quantity: 300, status: "pending", statusText: "待生产" },
        { id: "1003", product: "产品C", quantity: 800, status: "completed", statusText: "已完成" },
        { id: "1004", product: "产品D", quantity: 200, status: "quality", statusText: "质检中" }
      ]
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.username = userInfo.username;
      }
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
  return {
    a: common_vendor.t($data.username),
    b: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "calendar-filled",
      size: "35"
    }),
    c: common_vendor.o(($event) => $options.navigateTo("plan")),
    d: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "spinner-cycle",
      size: "35"
    }),
    e: common_vendor.o(($event) => $options.navigateTo("execution")),
    f: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "arrow-up",
      size: "35"
    }),
    g: common_vendor.o(($event) => $options.navigateTo("quality")),
    h: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "more-filled",
      size: "35"
    }),
    i: common_vendor.o(($event) => $options.navigateTo("record")),
    j: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "bars",
      size: "35"
    }),
    k: common_vendor.o(($event) => $options.navigateTo("inventory")),
    l: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "person-filled",
      size: "35"
    }),
    m: common_vendor.o(($event) => $options.navigateTo("profile")),
    n: common_vendor.p({
      ["custom-prefix"]: "iconfont",
      type: "staff-filled",
      size: "35"
    }),
    o: common_vendor.o(($event) => $options.navigateTo("management")),
    p: common_vendor.o(($event) => $options.navigateTo("plans")),
    q: common_vendor.f($data.recentOrders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.id),
        b: common_vendor.t(order.statusText),
        c: common_vendor.n(order.status),
        d: common_vendor.t(order.product),
        e: common_vendor.t(order.quantity),
        f: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f60c7ad9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/home/home.js.map
