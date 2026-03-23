"use strict";
const common_vendor = require("../../../common/vendor.js");
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
      plans: [
        { id: "P001", product: "产品A", quantity: 500, startDate: "2026-01-11", endDate: "2026-01-15", status: "processing", statusText: "生产中", progress: 60 },
        { id: "P002", product: "产品B", quantity: 300, startDate: "2026-01-12", endDate: "2026-01-16", status: "pending", statusText: "待生产", progress: 0 },
        { id: "P003", product: "产品C", quantity: 800, startDate: "2026-01-10", endDate: "2026-01-14", status: "completed", statusText: "已完成", progress: 100 },
        { id: "P004", product: "产品D", quantity: 200, startDate: "2026-01-11", endDate: "2026-01-13", status: "processing", statusText: "生产中", progress: 85 },
        { id: "P005", product: "产品E", quantity: 600, startDate: "2026-01-13", endDate: "2026-01-17", status: "pending", statusText: "待生产", progress: 0 }
      ],
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
        { text: "100%", value: "100%" },
        { text: "", value: "" },
        { text: "", value: "" },
        { text: "", value: "" }
      ]
    };
  },
  onLoad() {
    common_vendor.index.getStorageSync("userInfo");
  },
  computed: {
    filteredPlans() {
      if (this.selectedStatus === "all") {
        return this.plans;
      }
      return this.plans.filter((plan) => plan.status === this.selectedStatus);
    }
  },
  methods: {
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
      common_vendor.index.showToast({
        title: "计划提交成功",
        icon: "success"
      });
      this.plans.push({
        id: "P00" + (this.plans.length + 1),
        product: this.form.product,
        quantity: parseInt(this.form.quantity),
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        status: this.form.status,
        statusText: this.statusOptions.find((opt) => opt.value === this.form.status).text,
        progress
      });
      this.close();
    },
    editPlan(plan) {
      this.currentPlan = plan;
      this.form.progress = plan.progress + "%";
      this.$refs.editPopup.open("center");
    },
    // 保存进度修改
    saveProgress() {
      const progress = parseInt(this.form.progress);
      const plan = this.plans.find((p) => p.id === this.currentPlan.id);
      if (plan) {
        plan.progress = progress;
        if (progress === 100) {
          plan.status = "completed";
          plan.statusText = "已完成";
        }
      }
      common_vendor.index.showToast({
        title: "进度更新成功",
        icon: "success"
      });
      this.close1();
    },
    startProduction(id) {
      const plan = this.plans.find((p) => p.id === id);
      if (plan) {
        plan.status = "processing";
        plan.statusText = "生产中";
        common_vendor.index.showToast({
          title: "已开始生产",
          icon: "success"
        });
      }
    },
    completeProduction(id) {
      const plan = this.plans.find((p) => p.id === id);
      if (plan) {
        plan.status = "completed";
        plan.statusText = "已完成";
        plan.progress = 100;
        common_vendor.index.showToast({
          title: "已完成生产",
          icon: "success"
        });
      }
    },
    deletePlan(id) {
      common_vendor.index.showModal({
        title: "删除计划",
        content: "确定要删除这条计划吗？",
        confirmText: "删除",
        confirmColor: "#ff2d55",
        success: (res) => {
          if (res.confirm) {
            const index = this.plans.findIndex((p) => p.id === id);
            if (index !== -1) {
              this.plans.splice(index, 1);
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
            }
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
  return {
    a: common_vendor.o((...args) => $options.addPlan && $options.addPlan(...args)),
    b: common_vendor.o($options.close),
    c: common_vendor.p({
      type: "close",
      size: "28"
    }),
    d: $data.form.product,
    e: common_vendor.o(($event) => $data.form.product = $event.detail.value),
    f: $data.form.quantity,
    g: common_vendor.o(($event) => $data.form.quantity = $event.detail.value),
    h: common_vendor.o(($event) => $data.form.startDate = $event),
    i: common_vendor.p({
      type: "date",
      modelValue: $data.form.startDate
    }),
    j: common_vendor.o(($event) => $data.form.endDate = $event),
    k: common_vendor.p({
      type: "date",
      modelValue: $data.form.endDate
    }),
    l: common_vendor.o(($event) => $data.form.status = $event),
    m: common_vendor.p({
      label: "状态",
      localdata: $data.statusOptions,
      placeholder: "请选择状态",
      clearable: true,
      modelValue: $data.form.status
    }),
    n: common_vendor.o(($event) => $data.form.progress = $event),
    o: common_vendor.p({
      label: "进度",
      localdata: $data.candidates,
      placeholder: "请选择进度",
      clearable: true,
      modelValue: $data.form.progress
    }),
    p: common_vendor.o((...args) => $options.close && $options.close(...args)),
    q: common_vendor.o((...args) => $options.submitPlan && $options.submitPlan(...args)),
    r: common_vendor.sr("popup", "16b64818-0"),
    s: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    t: $data.selectedStatus === "all" ? 1 : "",
    v: common_vendor.o(($event) => $data.selectedStatus = "all"),
    w: $data.selectedStatus === "pending" ? 1 : "",
    x: common_vendor.o(($event) => $data.selectedStatus = "pending"),
    y: $data.selectedStatus === "processing" ? 1 : "",
    z: common_vendor.o(($event) => $data.selectedStatus = "processing"),
    A: $data.selectedStatus === "completed" ? 1 : "",
    B: common_vendor.o(($event) => $data.selectedStatus = "completed"),
    C: common_vendor.f($options.filteredPlans, (plan, index, i0) => {
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
        j: plan.status === "processing"
      }, plan.status === "processing" ? {
        k: common_vendor.o(($event) => $options.editPlan(plan), index)
      } : {}, {
        l: common_vendor.o(($event) => $options.deletePlan(plan.id), index),
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
    D: common_vendor.o($options.close1),
    E: common_vendor.p({
      type: "close",
      size: "28"
    }),
    F: common_vendor.t($data.currentPlan.id),
    G: common_vendor.o(($event) => $data.form.progress = $event),
    H: common_vendor.p({
      label: "进度",
      localdata: $data.candidates,
      placeholder: "请选择进度",
      clearable: true,
      modelValue: $data.form.progress
    }),
    I: common_vendor.o((...args) => $options.saveProgress && $options.saveProgress(...args)),
    J: common_vendor.sr("editPopup", "16b64818-6"),
    K: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-16b64818"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/plan/plan.js.map
