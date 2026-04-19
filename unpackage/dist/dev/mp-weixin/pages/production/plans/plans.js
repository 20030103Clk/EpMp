"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  plan: {
    getPlans: async (params = {}) => {
      const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
      const response = await common_vendor.index.request({
        url: `${API_BASE_URL}/plan${queryString ? `?${queryString}` : ""}`,
        method: "GET"
      });
      return response[1].data;
    }
  }
};
const _sfc_main = {
  data() {
    return {
      selectedStatus: "all",
      selectedTime: "week",
      orders: []
    };
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders;
      if (this.selectedStatus !== "all") {
        filtered = filtered.filter((order) => order.status === this.selectedStatus);
      }
      const today = /* @__PURE__ */ new Date();
      const weekAgo = /* @__PURE__ */ new Date();
      const monthAgo = /* @__PURE__ */ new Date();
      weekAgo.setDate(today.getDate() - 7);
      monthAgo.setMonth(today.getMonth() - 1);
      switch (this.selectedTime) {
        case "today":
          filtered = filtered.filter((order) => new Date(order.orderDate) >= today.setHours(0, 0, 0, 0));
          break;
        case "week":
          filtered = filtered.filter((order) => new Date(order.orderDate) >= weekAgo);
          break;
        case "month":
          filtered = filtered.filter((order) => new Date(order.orderDate) >= monthAgo);
          break;
      }
      return filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    }
  },
  onLoad() {
    this.loadOrders();
  },
  methods: {
    loadOrders() {
      common_vendor.index.showLoading({ title: "加载中..." });
      api.plan.getPlans().then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          this.orders = res.data.list.map((plan) => ({
            id: plan.plan_id,
            product: plan.product,
            quantity: plan.quantity,
            orderDate: plan.start_date,
            deliveryDate: plan.end_date,
            status: plan.status,
            statusText: plan.statusText
          }));
        } else {
          common_vendor.index.showToast({ title: "加载失败", icon: "none" });
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
    a: $data.selectedStatus === "all" ? 1 : "",
    b: common_vendor.o(($event) => $data.selectedStatus = "all", "87"),
    c: $data.selectedStatus === "pending" ? 1 : "",
    d: common_vendor.o(($event) => $data.selectedStatus = "pending", "be"),
    e: $data.selectedStatus === "processing" ? 1 : "",
    f: common_vendor.o(($event) => $data.selectedStatus = "processing", "85"),
    g: $data.selectedStatus === "completed" ? 1 : "",
    h: common_vendor.o(($event) => $data.selectedStatus = "completed", "63"),
    i: $data.selectedTime === "today" ? 1 : "",
    j: common_vendor.o(($event) => $data.selectedTime = "today", "cb"),
    k: $data.selectedTime === "week" ? 1 : "",
    l: common_vendor.o(($event) => $data.selectedTime = "week", "bf"),
    m: $data.selectedTime === "month" ? 1 : "",
    n: common_vendor.o(($event) => $data.selectedTime = "month", "82"),
    o: $data.selectedTime === "all" ? 1 : "",
    p: common_vendor.o(($event) => $data.selectedTime = "all", "2e"),
    q: common_vendor.f($options.filteredOrders, (order, index, i0) => {
      return {
        a: common_vendor.t(order.id),
        b: common_vendor.t(order.statusText),
        c: common_vendor.n(order.status),
        d: common_vendor.t(order.product),
        e: common_vendor.t(order.quantity),
        f: common_vendor.t(order.orderDate),
        g: common_vendor.t(order.deliveryDate),
        h: index
      };
    }),
    r: $options.filteredOrders.length === 0
  }, $options.filteredOrders.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-50a79e4a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/plans/plans.js.map
