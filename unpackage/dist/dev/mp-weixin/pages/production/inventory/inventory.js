"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  inventory: {
    getInventories: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/inventory${queryString ? `?${queryString}` : ""}`,
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
        throw error;
      }
    },
    createInventory: async (data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/inventory`,
          method: "POST",
          data: JSON.stringify(data),
          header: {
            "Content-Type": "application/json"
          }
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
        throw error;
      }
    },
    updateInventory: async (id, data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/inventory/${id}`,
          method: "PUT",
          data: JSON.stringify(data),
          header: {
            "Content-Type": "application/json"
          }
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
        throw error;
      }
    },
    deleteInventory: async (id) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/inventory/${id}`,
          method: "DELETE"
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
        throw error;
      }
    }
  }
};
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
      editProduct: {
        id: "",
        product: "",
        code: "",
        currentStock: 0,
        safeStock: 0,
        unit: "件",
        location: ""
      },
      inventoryItems: []
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
    },
    isAdmin() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo && userInfo.level === 1;
    }
  },
  onLoad() {
    this.loadInventory();
  },
  methods: {
    // 加载库存数据
    loadInventory() {
      common_vendor.index.showLoading({ title: "加载中..." });
      api.inventory.getInventories().then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          this.inventoryItems = res.data.list.map((item) => ({
            id: item.inventory_id,
            product: item.product,
            code: item.code,
            currentStock: item.currentStock,
            safeStock: item.safeStock,
            unit: item.unit || "件",
            location: item.location
          }));
        } else {
          common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      });
    },
    // 搜索库存
    search() {
      if (!this.searchValue.trim()) {
        this.loadInventory();
        return;
      }
      common_vendor.index.showLoading({ title: "搜索中..." });
      api.inventory.getInventories({ product: this.searchValue }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          this.inventoryItems = res.data.list.map((item) => ({
            id: item.inventory_id,
            product: item.product,
            code: item.code,
            currentStock: item.currentStock,
            safeStock: item.safeStock,
            unit: item.unit || "件",
            location: item.location
          }));
        } else {
          common_vendor.index.showToast({ title: "搜索失败", icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      });
    },
    // 清除搜索
    clear() {
      this.searchValue = "";
      this.loadInventory();
    },
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
      common_vendor.index.showLoading({ title: "提交中..." });
      api.inventory.createInventory({
        product: this.newProduct.product,
        code: this.newProduct.code,
        currentStock: this.newProduct.currentStock,
        safeStock: this.newProduct.safeStock,
        unit: this.newProduct.unit,
        location: this.newProduct.location
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({
            title: "产品添加成功",
            icon: "success"
          });
          this.loadInventory();
          this.closeAddPopup();
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "提交失败", icon: "none" });
      });
    },
    deleteInventory(index) {
      const item = this.inventoryItems[index];
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条库存记录吗？",
        confirmText: "删除",
        confirmColor: "#ff2d55",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "删除中..." });
            api.inventory.deleteInventory(item.id).then((res2) => {
              common_vendor.index.hideLoading();
              if (res2.success) {
                this.inventoryItems.splice(index, 1);
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({ title: res2.message, icon: "none" });
              }
            }).catch((error) => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            });
          }
        }
      });
    },
    // 打开编辑库存弹窗
    editInventory() {
      if (this.currentInventory.id) {
        this.editProduct = {
          id: this.currentInventory.id,
          product: this.currentInventory.product || "",
          code: this.currentInventory.code || "",
          currentStock: this.currentInventory.currentStock || 0,
          safeStock: this.currentInventory.safeStock || 0,
          unit: this.currentInventory.unit || "件",
          location: this.currentInventory.location || ""
        };
        this.$refs.popup.close();
        this.$refs.editPopup.open("center");
      }
    },
    // 关闭编辑库存弹窗
    closeEditPopup() {
      this.$refs.editPopup.close();
      this.editProduct = {
        id: "",
        product: "",
        code: "",
        currentStock: 0,
        safeStock: 0,
        unit: "件",
        location: ""
      };
    },
    // 提交编辑库存
    submitEditProduct() {
      if (!this.editProduct.product.trim()) {
        common_vendor.index.showToast({
          title: "请输入产品名称",
          icon: "none"
        });
        return;
      }
      if (this.editProduct.currentStock < 0) {
        common_vendor.index.showToast({
          title: "当前库存不能为负数",
          icon: "none"
        });
        return;
      }
      if (this.editProduct.safeStock < 0) {
        common_vendor.index.showToast({
          title: "安全库存不能为负数",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      api.inventory.updateInventory(this.editProduct.id, {
        product: this.editProduct.product,
        currentStock: this.editProduct.currentStock,
        safeStock: this.editProduct.safeStock,
        unit: this.editProduct.unit,
        location: this.editProduct.location
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({
            title: "编辑成功",
            icon: "success"
          });
          this.loadInventory();
          this.closeEditPopup();
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "提交失败", icon: "none" });
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
  return common_vendor.e({
    a: $options.isAdmin
  }, $options.isAdmin ? {
    b: common_vendor.o((...args) => $options.addproduct && $options.addproduct(...args), "45")
  } : {}, {
    c: common_vendor.o($options.search, "1c"),
    d: common_vendor.o(_ctx.blur, "f5"),
    e: common_vendor.o(_ctx.focus, "a1"),
    f: common_vendor.o(_ctx.input, "c4"),
    g: common_vendor.o(_ctx.cancel, "29"),
    h: common_vendor.o($options.clear, "19"),
    i: common_vendor.o(($event) => $data.searchValue = $event, "52"),
    j: common_vendor.p({
      focus: true,
      modelValue: $data.searchValue
    }),
    k: common_vendor.t($options.totalInventory),
    l: common_vendor.f($options.filterItems, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.product),
        b: common_vendor.t(item.code),
        c: common_vendor.t(item.currentStock),
        d: common_vendor.t(item.safeStock),
        e: common_vendor.t(item.unit),
        f: common_vendor.t(item.location),
        g: common_vendor.o(($event) => $options.viewInventory(item), index)
      }, $options.isAdmin ? {
        h: common_vendor.o(($event) => $options.deleteInventory(index), index)
      } : {}, {
        i: index
      });
    }),
    m: $options.isAdmin,
    n: common_vendor.o($options.closepopup, "98"),
    o: common_vendor.p({
      type: "close",
      size: "28"
    }),
    p: common_vendor.t($data.currentInventory.product),
    q: common_vendor.t($data.currentInventory.code),
    r: common_vendor.t($data.currentInventory.currentStock),
    s: common_vendor.t($data.currentInventory.safeStock),
    t: common_vendor.t($data.currentInventory.unit),
    v: common_vendor.t($data.currentInventory.location),
    w: $options.isAdmin
  }, $options.isAdmin ? {
    x: common_vendor.o((...args) => $options.editInventory && $options.editInventory(...args), "8b")
  } : {}, {
    y: common_vendor.o((...args) => $options.closepopup && $options.closepopup(...args), "10"),
    z: common_vendor.sr("popup", "0bf1e840-1"),
    A: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    B: common_vendor.o($options.closeAddPopup, "96"),
    C: common_vendor.p({
      type: "close",
      size: "28"
    }),
    D: $data.newProduct.product,
    E: common_vendor.o(($event) => $data.newProduct.product = $event.detail.value, "97"),
    F: $data.newProduct.code,
    G: common_vendor.o(($event) => $data.newProduct.code = $event.detail.value, "9a"),
    H: $data.newProduct.currentStock,
    I: common_vendor.o(($event) => $data.newProduct.currentStock = $event.detail.value, "01"),
    J: $data.newProduct.safeStock,
    K: common_vendor.o(($event) => $data.newProduct.safeStock = $event.detail.value, "12"),
    L: $data.newProduct.location,
    M: common_vendor.o(($event) => $data.newProduct.location = $event.detail.value, "d5"),
    N: common_vendor.o((...args) => $options.closeAddPopup && $options.closeAddPopup(...args), "b8"),
    O: common_vendor.o((...args) => $options.submitProduct && $options.submitProduct(...args), "98"),
    P: common_vendor.sr("addPopup", "0bf1e840-3"),
    Q: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    R: common_vendor.o($options.closeEditPopup, "3a"),
    S: common_vendor.p({
      type: "close",
      size: "28"
    }),
    T: $data.editProduct.product,
    U: common_vendor.o(($event) => $data.editProduct.product = $event.detail.value, "7c"),
    V: $data.editProduct.code,
    W: common_vendor.o(($event) => $data.editProduct.code = $event.detail.value, "56"),
    X: $data.editProduct.currentStock,
    Y: common_vendor.o(($event) => $data.editProduct.currentStock = $event.detail.value, "03"),
    Z: $data.editProduct.safeStock,
    aa: common_vendor.o(($event) => $data.editProduct.safeStock = $event.detail.value, "65"),
    ab: $data.editProduct.unit,
    ac: common_vendor.o(($event) => $data.editProduct.unit = $event.detail.value, "e6"),
    ad: $data.editProduct.location,
    ae: common_vendor.o(($event) => $data.editProduct.location = $event.detail.value, "4b"),
    af: common_vendor.o((...args) => $options.closeEditPopup && $options.closeEditPopup(...args), "91"),
    ag: common_vendor.o((...args) => $options.submitEditProduct && $options.submitEditProduct(...args), "b9"),
    ah: common_vendor.sr("editPopup", "0bf1e840-5"),
    ai: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0bf1e840"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/inventory/inventory.js.map
