"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  equipment: {
    getEquipments: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/equipment${queryString ? `?${queryString}` : ""}`,
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
    createEquipment: async (data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/equipment`,
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
    updateEquipment: async (id, data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/equipment/${id}`,
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
    deleteEquipment: async (id) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/equipment/${id}`,
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
      searchText: "",
      equipmentList: [],
      showModal: false,
      isEdit: false,
      loadStatus: "more",
      pageNum: 1,
      pageSize: 10,
      statusOptions: [
        { value: "running", label: "运行中" },
        { value: "idle", label: "待机" },
        { value: "maintenance", label: "维修中" },
        { value: "stopped", label: "已停机" }
      ],
      formData: {
        equio: "",
        status: "running",
        statusText: "运行中"
      },
      editData: {
        id: 0
      }
    };
  },
  onLoad() {
    this.loadEquipmentList(1);
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case "running":
          return "status-running";
        case "idle":
          return "status-idle";
        case "maintenance":
          return "status-maintenance";
        case "stopped":
          return "status-stopped";
        default:
          return "";
      }
    },
    loadEquipmentList(page, keyword = "") {
      common_vendor.index.showLoading({ title: "加载中..." });
      const params = { page, pageSize: this.pageSize };
      if (keyword.trim()) {
        params.equio = keyword;
      }
      api.equipment.getEquipments(params).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          if (page === 1) {
            this.equipmentList = res.data.list.map((item) => ({
              id: item.equioment_id,
              equioment_id: item.equioment_id,
              equio: item.equio,
              status: item.status,
              statusText: item.statusText
            }));
          } else {
            this.equipmentList = [...this.equipmentList, ...res.data.list.map((item) => ({
              id: item.equioment_id,
              equioment_id: item.equioment_id,
              equio: item.equio,
              status: item.status,
              statusText: item.statusText
            }))];
          }
          this.loadStatus = res.data.list.length < this.pageSize ? "noMore" : "more";
        } else {
          common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      });
    },
    handleSearch() {
      this.pageNum = 1;
      this.loadEquipmentList(1, this.searchText);
    },
    clearSearch() {
      this.searchText = "";
      this.pageNum = 1;
      this.loadEquipmentList(1, "");
    },
    openAddModal() {
      this.isEdit = false;
      this.formData.equio = "";
      this.formData.status = "running";
      this.formData.statusText = "运行中";
      this.showModal = true;
    },
    editEquipment(item) {
      this.isEdit = true;
      this.editData.id = item.equioment_id;
      this.formData.equio = item.equio;
      this.formData.status = item.status;
      this.formData.statusText = item.statusText;
      this.showModal = true;
    },
    addEquipment() {
      if (!this.formData.equio.trim()) {
        common_vendor.index.showToast({ title: "请输入设备编号", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中..." });
      api.equipment.createEquipment({
        equio: this.formData.equio,
        status: this.formData.status,
        statusText: this.formData.statusText
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({ title: "添加成功", icon: "success" });
          this.closeModal();
          this.loadEquipmentList(1);
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "添加失败", icon: "none" });
      });
    },
    updateEquipment() {
      common_vendor.index.showLoading({ title: "提交中..." });
      api.equipment.updateEquipment(this.editData.id, {
        status: this.formData.status,
        statusText: this.formData.statusText
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({ title: "修改成功", icon: "success" });
          this.closeModal();
          this.loadEquipmentList(1);
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "修改失败", icon: "none" });
      });
    },
    deleteEquipment(id) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除该设备吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "删除中..." });
            api.equipment.deleteEquipment(id).then((res2) => {
              common_vendor.index.hideLoading();
              if (res2.success) {
                common_vendor.index.showToast({ title: "删除成功", icon: "success" });
                this.loadEquipmentList(1);
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
    submitForm() {
      if (this.isEdit) {
        this.updateEquipment();
      } else {
        this.addEquipment();
      }
    },
    closeModal() {
      this.showModal = false;
      this.isEdit = false;
      this.formData.equio = "";
      this.formData.status = "running";
      this.formData.statusText = "运行中";
      this.editData.id = 0;
    },
    loadMore() {
      if (this.loadStatus === "more") {
        this.pageNum++;
        this.loadEquipmentList(this.pageNum);
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  _easycom_uni_load_more2();
}
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  _easycom_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.searchText,
    b: common_vendor.o(($event) => $data.searchText = $event.detail.value, "4c"),
    c: $data.searchText
  }, $data.searchText ? {
    d: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args), "b2")
  } : {}, {
    e: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args), "ad"),
    f: common_vendor.o((...args) => $options.openAddModal && $options.openAddModal(...args), "60"),
    g: common_vendor.f($data.equipmentList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.equio),
        b: common_vendor.t(item.statusText),
        c: common_vendor.n($options.getStatusClass(item.status)),
        d: common_vendor.o(($event) => $options.editEquipment(item), item.equioment_id),
        e: common_vendor.o(($event) => $options.deleteEquipment(item.equioment_id), item.equioment_id),
        f: item.equioment_id
      };
    }),
    h: $data.equipmentList.length === 0
  }, $data.equipmentList.length === 0 ? {} : {}, {
    i: $data.equipmentList.length > 0
  }, $data.equipmentList.length > 0 ? {
    j: common_vendor.o($options.loadMore, "15"),
    k: common_vendor.p({
      status: $data.loadStatus
    })
  } : {}, {
    l: $data.showModal
  }, $data.showModal ? {
    m: common_vendor.t($data.isEdit ? "编辑设备" : "添加设备"),
    n: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args), "1a"),
    o: $data.isEdit,
    p: $data.formData.equio,
    q: common_vendor.o(($event) => $data.formData.equio = $event.detail.value, "4d"),
    r: common_vendor.f($data.statusOptions, (status, k0, i0) => {
      return {
        a: common_vendor.t(status.label),
        b: status.value,
        c: $data.formData.status === status.value ? 1 : "",
        d: common_vendor.o(($event) => {
          $data.formData.status = status.value;
          $data.formData.statusText = status.label;
        }, status.value)
      };
    }),
    s: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args), "84"),
    t: common_vendor.t($data.isEdit ? "保存修改" : "确认添加"),
    v: common_vendor.o((...args) => $options.submitForm && $options.submitForm(...args), "37"),
    w: common_vendor.o(() => {
    }, "eb"),
    x: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args), "56")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/equipment/equipment.js.map
