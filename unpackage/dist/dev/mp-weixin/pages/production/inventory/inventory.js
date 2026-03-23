"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchValue: "",
      currentInventory: {},
      newProduct: {
        product: "",
        code: "",
        currentStock: 0,
        safeStock: 0,
        unit: "件",
        location: ""
      },
      inventoryItems: [
        {
          product: "产品A",
          code: "PROD-A001",
          currentStock: 2500,
          safeStock: 500,
          unit: "件",
          location: "仓库A-1区"
        },
        {
          product: "产品B",
          code: "PROD-B001",
          currentStock: 1200,
          safeStock: 300,
          unit: "件",
          location: "仓库A-2区"
        },
        {
          product: "产品C",
          code: "PROD-C001",
          currentStock: 350,
          safeStock: 500,
          unit: "件",
          location: "仓库B-1区"
        },
        {
          product: "产品D",
          code: "PROD-D001",
          currentStock: 4200,
          safeStock: 1e3,
          unit: "件",
          location: "仓库B-2区"
        }
      ]
    };
  },
  computed: {
    totalInventory() {
      if (this.inventoryItems.length === 0)
        return 0;
      return this.inventoryItems.reduce((sum, item) => sum + (Number(item.currentStock) || 0), 0);
    },
    filterItems() {
      if (this.searchValue === "")
        return this.inventoryItems;
      const keyword = this.searchValue.trim().toLowerCase();
      return this.inventoryItems.filter((item) => item.product.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword));
    }
  },
  methods: {
    viewInventory(itemid) {
      const code = itemid.code;
      this.currentInventory = this.filterItems.find((item) => item.code === code) || {};
      this.$refs.popup.open();
      common_vendor.index.showToast({
        title: `查看库存#${code}`,
        icon: "none"
      });
    },
    closepopup() {
      this.$refs.popup.close();
    },
    addproduct() {
      this.$refs.addPopup.open("center");
    },
    closeAddPopup() {
      this.$refs.addPopup.close();
      this.newProduct = {
        product: "",
        code: "",
        currentStock: 0,
        safeStock: 0,
        unit: "件",
        location: ""
      };
    },
    submitProduct() {
      if (!this.newProduct.product.trim()) {
        common_vendor.index.showToast({
          title: "请输入产品名称",
          icon: "none"
        });
        return;
      }
      if (!this.newProduct.code.trim()) {
        common_vendor.index.showToast({
          title: "请输入产品编号",
          icon: "none"
        });
        return;
      }
      if (this.newProduct.currentStock < 0) {
        common_vendor.index.showToast({
          title: "初始库存不能为负数",
          icon: "none"
        });
        return;
      }
      if (this.newProduct.safeStock < 0) {
        common_vendor.index.showToast({
          title: "安全库存不能为负数",
          icon: "none"
        });
        return;
      }
      this.inventoryItems.push({
        ...this.newProduct
      });
      this.closeAddPopup();
      common_vendor.index.showToast({
        title: "产品添加成功",
        icon: "success"
      });
    },
    deleteInventory(index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条库存记录吗？",
        confirmText: "删除",
        confirmColor: "#ff2d55",
        success: (res) => {
          if (res.confirm) {
            this.inventoryItems.splice(index, 1);
            common_vendor.index.showToast({
              title: "删除成功",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_search_bar = () => "../../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.addproduct && $options.addproduct(...args)),
    b: common_vendor.o(_ctx.search),
    c: common_vendor.o(_ctx.blur),
    d: common_vendor.o(_ctx.focus),
    e: common_vendor.o(_ctx.input),
    f: common_vendor.o(_ctx.cancel),
    g: common_vendor.o(_ctx.clear),
    h: common_vendor.o(($event) => $data.searchValue = $event),
    i: common_vendor.p({
      focus: true,
      modelValue: $data.searchValue
    }),
    j: common_vendor.t($options.totalInventory),
    k: common_vendor.f($options.filterItems, (item, index, i0) => {
      return {
        a: common_vendor.t(item.product),
        b: common_vendor.t(item.code),
        c: common_vendor.t(item.currentStock),
        d: common_vendor.t(item.safeStock),
        e: common_vendor.t(item.unit),
        f: common_vendor.t(item.location),
        g: common_vendor.o(($event) => $options.viewInventory(item), index),
        h: common_vendor.o(($event) => $options.deleteInventory(index), index),
        i: index
      };
    }),
    l: common_vendor.o($options.closepopup),
    m: common_vendor.p({
      type: "close",
      size: "28"
    }),
    n: common_vendor.t($data.currentInventory.product),
    o: common_vendor.t($data.currentInventory.code),
    p: common_vendor.t($data.currentInventory.currentStock),
    q: common_vendor.t($data.currentInventory.safeStock),
    r: common_vendor.t($data.currentInventory.unit),
    s: common_vendor.t($data.currentInventory.location),
    t: common_vendor.o((...args) => $options.closepopup && $options.closepopup(...args)),
    v: common_vendor.sr("popup", "0bf1e840-1"),
    w: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    x: common_vendor.o($options.closeAddPopup),
    y: common_vendor.p({
      type: "close",
      size: "28"
    }),
    z: $data.newProduct.product,
    A: common_vendor.o(($event) => $data.newProduct.product = $event.detail.value),
    B: $data.newProduct.code,
    C: common_vendor.o(($event) => $data.newProduct.code = $event.detail.value),
    D: $data.newProduct.currentStock,
    E: common_vendor.o(($event) => $data.newProduct.currentStock = $event.detail.value),
    F: $data.newProduct.safeStock,
    G: common_vendor.o(($event) => $data.newProduct.safeStock = $event.detail.value),
    H: $data.newProduct.location,
    I: common_vendor.o(($event) => $data.newProduct.location = $event.detail.value),
    J: common_vendor.o((...args) => $options.closeAddPopup && $options.closeAddPopup(...args)),
    K: common_vendor.o((...args) => $options.submitProduct && $options.submitProduct(...args)),
    L: common_vendor.sr("addPopup", "0bf1e840-3"),
    M: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0bf1e840"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/inventory/inventory.js.map
