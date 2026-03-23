"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      selectedStatus: "all",
      selectedTime: "week",
      orders: [
        {
          id: "O001",
          product: "产品A",
          quantity: 500,
          orderDate: "2026-01-19",
          deliveryDate: "2026-01-23",
          status: "processing",
          statusText: "生产中"
        },
        {
          id: "O002",
          product: "产品B",
          quantity: 300,
          orderDate: "2026-01-18",
          deliveryDate: "2026-01-22",
          status: "pending",
          statusText: "待生产"
        },
        {
          id: "O003",
          product: "产品C",
          quantity: 800,
          orderDate: "2026-01-17",
          deliveryDate: "2026-01-21",
          status: "completed",
          statusText: "已完成"
        },
        {
          id: "O004",
          product: "产品E",
          quantity: 600,
          orderDate: "2026-01-15",
          deliveryDate: "2026-01-19",
          status: "completed",
          statusText: "已完成"
        }
      ]
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
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.selectedStatus === "all" ? 1 : "",
    b: common_vendor.o(($event) => $data.selectedStatus = "all"),
    c: $data.selectedStatus === "pending" ? 1 : "",
    d: common_vendor.o(($event) => $data.selectedStatus = "pending"),
    e: $data.selectedStatus === "processing" ? 1 : "",
    f: common_vendor.o(($event) => $data.selectedStatus = "processing"),
    g: $data.selectedStatus === "completed" ? 1 : "",
    h: common_vendor.o(($event) => $data.selectedStatus = "completed"),
    i: $data.selectedTime === "today" ? 1 : "",
    j: common_vendor.o(($event) => $data.selectedTime = "today"),
    k: $data.selectedTime === "week" ? 1 : "",
    l: common_vendor.o(($event) => $data.selectedTime = "week"),
    m: $data.selectedTime === "month" ? 1 : "",
    n: common_vendor.o(($event) => $data.selectedTime = "month"),
    o: $data.selectedTime === "all" ? 1 : "",
    p: common_vendor.o(($event) => $data.selectedTime = "all"),
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
