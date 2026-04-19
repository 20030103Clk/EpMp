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
        common_vendor.index.__f__("log", "at pages/production/plan/plan.vue:145", "Get plans API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/plan/plan.vue:157", "Get plans error:", error);
        throw error;
      }
    },
    createPlan: async (data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/plan`,
          method: "POST",
          data: JSON.stringify(data),
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/production/plan/plan.vue:172", "Create plan API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/plan/plan.vue:184", "Create plan error:", error);
        throw error;
      }
    },
    updatePlan: async (id, data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/plan/${id}`,
          method: "PUT",
          data: JSON.stringify(data),
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/production/plan/plan.vue:199", "Update plan API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/plan/plan.vue:211", "Update plan error:", error);
        throw error;
      }
    },
    deletePlan: async (id) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/plan/${id}`,
          method: "DELETE"
        });
        common_vendor.index.__f__("log", "at pages/production/plan/plan.vue:222", "Delete plan API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/plan/plan.vue:234", "Delete plan error:", error);
        throw error;
      }
    }
  }
};
const _sfc_main = {
  data() {
    return {
      selectedStatus: "all",
      form: {
        product: "",
        quantity: "",
        startDate: "",
        endDate: "",
        status: "",
        statusText: "",
        progress: "0%"
      },
      currentPlan: {},
      plans: [],
      statusOptions: [
        { value: "pending", text: "待生产" },
        { value: "processing", text: "生产中" },
        { value: "completed", text: "已完成" }
      ],
      candidates: [
        { text: "0%", value: "0%" },
        { text: "10%", value: "10%" },
        { text: "20%", value: "20%" },
        { text: "30%", value: "30%" },
        { text: "40%", value: "40%" },
        { text: "50%", value: "50%" },
        { text: "60%", value: "60%" },
        { text: "70%", value: "70%" },
        { text: "80%", value: "80%" },
        { text: "90%", value: "90%" },
        { text: "100%", value: "100%" }
      ]
    };
  },
  onLoad() {
    common_vendor.index.getStorageSync("userInfo");
    this.loadPlans();
  },
  onShow() {
    this.loadPlans();
  },
  computed: {
    filteredPlans() {
      if (this.selectedStatus === "all") {
        return this.plans;
      }
      return this.plans.filter((plan) => plan.status === this.selectedStatus);
    },
    isAdmin() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo && userInfo.level === 1;
    }
  },
  methods: {
    loadPlans() {
      common_vendor.index.showLoading({ title: "加载中..." });
      api.plan.getPlans().then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          this.plans = res.data.list.map((plan) => {
            let statusText = plan.statusText;
            if (!statusText) {
              const statusMap = {
                "pending": "待生产",
                "processing": "生产中",
                "completed": "已完成"
              };
              statusText = statusMap[plan.status] || "未知状态";
            }
            let status = plan.status;
            if (!["pending", "processing", "completed"].includes(status)) {
              if (plan.progress === 0) {
                status = "pending";
              } else if (plan.progress === 100) {
                status = "completed";
              } else {
                status = "processing";
              }
            }
            return {
              id: plan.plan_id,
              product: plan.product,
              quantity: plan.quantity,
              startDate: plan.startDate,
              endDate: plan.endDate,
              status,
              statusText,
              progress: plan.progress
            };
          });
        } else {
          common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      });
    },
    addPlan() {
      this.form = {
        product: "",
        quantity: "",
        startDate: "",
        endDate: "",
        status: "",
        progress: "0%"
      };
      this.$refs.popup.open("center");
    },
    close() {
      this.$refs.popup.close();
    },
    close1() {
      this.$refs.editPopup.close();
    },
    onStatusChange(e) {
      this.form.status = e.detail.value;
    },
    submitPlan() {
      if (!this.form.product.trim()) {
        common_vendor.index.showToast({ title: "请输入产品名称", icon: "none" });
        return;
      }
      if (!this.form.quantity || isNaN(this.form.quantity) || parseInt(this.form.quantity) <= 0) {
        common_vendor.index.showToast({ title: "请输入有效的计划数量", icon: "none" });
        return;
      }
      if (!this.form.startDate) {
        common_vendor.index.showToast({ title: "请选择开始时间", icon: "none" });
        return;
      }
      if (!this.form.endDate) {
        common_vendor.index.showToast({ title: "请选择结束时间", icon: "none" });
        return;
      }
      if (!this.form.status) {
        common_vendor.index.showToast({ title: "请选择计划状态", icon: "none" });
        return;
      }
      const progress = parseInt(this.form.progress);
      common_vendor.index.showLoading({ title: "提交中..." });
      api.plan.createPlan({
        product: this.form.product,
        quantity: parseInt(this.form.quantity),
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        status: this.form.status,
        statusText: this.statusOptions.find((opt) => opt.value === this.form.status).text,
        progress
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({
            title: "计划提交成功",
            icon: "success"
          });
          this.loadPlans();
          this.close();
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "提交失败", icon: "none" });
      });
    },
    editPlan(plan) {
      this.currentPlan = plan;
      this.form.progress = plan.progress + "%";
      this.$refs.editPopup.open("center");
    },
    // 保存进度修改
    saveProgress() {
      const progress = parseInt(this.form.progress);
      common_vendor.index.showLoading({ title: "更新中..." });
      api.plan.updatePlan(this.currentPlan.id, {
        progress,
        status: progress === 100 ? "completed" : "processing",
        statusText: progress === 100 ? "已完成" : "生产中"
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({
            title: "进度更新成功",
            icon: "success"
          });
          this.loadPlans();
          this.close1();
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "更新失败", icon: "none" });
      });
    },
    startProduction(id) {
      common_vendor.index.showLoading({ title: "更新中..." });
      api.plan.updatePlan(id, {
        status: "processing",
        statusText: "生产中"
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({
            title: "已开始生产",
            icon: "success"
          });
          this.loadPlans();
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "更新失败", icon: "none" });
      });
    },
    completeProduction(id) {
      common_vendor.index.showLoading({ title: "更新中..." });
      api.plan.updatePlan(id, {
        status: "completed",
        statusText: "已完成",
        progress: 100
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({
            title: "已完成生产",
            icon: "success"
          });
          this.loadPlans();
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "更新失败", icon: "none" });
      });
    },
    deletePlan(id) {
      common_vendor.index.showModal({
        title: "删除计划",
        content: "确定要删除这条计划吗？",
        confirmText: "删除",
        confirmColor: "#ff2d55",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "删除中..." });
            api.plan.deletePlan(id).then((res2) => {
              common_vendor.index.hideLoading();
              if (res2.success) {
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                this.loadPlans();
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
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_datetime_picker2 + _easycom_uni_data_select2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_data_select = () => "../../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_datetime_picker + _easycom_uni_data_select + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.isAdmin
  }, $options.isAdmin ? {
    b: common_vendor.o((...args) => $options.addPlan && $options.addPlan(...args), "db")
  } : {}, {
    c: common_vendor.o($options.close, "c0"),
    d: common_vendor.p({
      type: "close",
      size: "28"
    }),
    e: $data.form.product,
    f: common_vendor.o(($event) => $data.form.product = $event.detail.value, "9e"),
    g: $data.form.quantity,
    h: common_vendor.o(($event) => $data.form.quantity = $event.detail.value, "c8"),
    i: common_vendor.o(($event) => $data.form.startDate = $event, "f3"),
    j: common_vendor.p({
      type: "date",
      modelValue: $data.form.startDate
    }),
    k: common_vendor.o(($event) => $data.form.endDate = $event, "21"),
    l: common_vendor.p({
      type: "date",
      modelValue: $data.form.endDate
    }),
    m: common_vendor.o(($event) => $data.form.status = $event, "e5"),
    n: common_vendor.p({
      label: "状态",
      localdata: $data.statusOptions,
      placeholder: "请选择状态",
      clearable: true,
      modelValue: $data.form.status
    }),
    o: common_vendor.o(($event) => $data.form.progress = $event, "69"),
    p: common_vendor.p({
      label: "进度",
      localdata: $data.candidates,
      placeholder: "请选择进度",
      clearable: true,
      modelValue: $data.form.progress
    }),
    q: common_vendor.o((...args) => $options.close && $options.close(...args), "e7"),
    r: common_vendor.o((...args) => $options.submitPlan && $options.submitPlan(...args), "56"),
    s: common_vendor.sr("popup", "16b64818-0"),
    t: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    v: $data.selectedStatus === "all" ? 1 : "",
    w: common_vendor.o(($event) => $data.selectedStatus = "all", "87"),
    x: $data.selectedStatus === "pending" ? 1 : "",
    y: common_vendor.o(($event) => $data.selectedStatus = "pending", "74"),
    z: $data.selectedStatus === "processing" ? 1 : "",
    A: common_vendor.o(($event) => $data.selectedStatus = "processing", "7c"),
    B: $data.selectedStatus === "completed" ? 1 : "",
    C: common_vendor.o(($event) => $data.selectedStatus = "completed", "67"),
    D: common_vendor.f($options.filteredPlans, (plan, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(plan.id),
        b: common_vendor.t(plan.statusText),
        c: common_vendor.n(plan.status),
        d: common_vendor.t(plan.product),
        e: common_vendor.t(plan.quantity),
        f: common_vendor.t(plan.startDate),
        g: common_vendor.t(plan.endDate),
        h: plan.progress + "%",
        i: common_vendor.t(plan.progress),
        j: plan.status === "processing" && $options.isAdmin
      }, plan.status === "processing" && $options.isAdmin ? {
        k: common_vendor.o(($event) => $options.editPlan(plan), index)
      } : {}, $options.isAdmin ? {
        l: common_vendor.o(($event) => $options.deletePlan(plan.id), index)
      } : {}, {
        m: plan.status === "pending"
      }, plan.status === "pending" ? {
        n: common_vendor.o(($event) => $options.startProduction(plan.id), index)
      } : {}, {
        o: plan.status === "processing"
      }, plan.status === "processing" ? {
        p: common_vendor.o(($event) => $options.completeProduction(plan.id), index)
      } : {}, {
        q: index
      });
    }),
    E: $options.isAdmin,
    F: common_vendor.o($options.close1, "d3"),
    G: common_vendor.p({
      type: "close",
      size: "28"
    }),
    H: common_vendor.t($data.currentPlan.id),
    I: common_vendor.o(($event) => $data.form.progress = $event, "0b"),
    J: common_vendor.p({
      label: "进度",
      localdata: $data.candidates,
      placeholder: "请选择进度",
      clearable: true,
      modelValue: $data.form.progress
    }),
    K: common_vendor.o((...args) => $options.saveProgress && $options.saveProgress(...args), "fb"),
    L: common_vendor.sr("editPopup", "16b64818-6"),
    M: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-16b64818"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/plan/plan.js.map
