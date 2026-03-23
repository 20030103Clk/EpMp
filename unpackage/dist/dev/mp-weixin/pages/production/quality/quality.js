"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      passRate: "",
      todayInspections: 0,
      rejectCount: 0,
      inspectionForm: {
        product: "",
        quantity: "",
        result: "pass"
      },
      inspectionRecords: [
        {
          id: "Q001",
          product: "产品A",
          quantity: 100,
          result: "pass",
          resultText: "合格",
          inspectionTime: "2026-01-11 14:30"
        },
        {
          id: "Q002",
          product: "产品B",
          quantity: 80,
          result: "pass",
          resultText: "合格",
          inspectionTime: "2026-01-11 13:15"
        },
        {
          id: "Q003",
          product: "产品C",
          quantity: 120,
          result: "fail",
          resultText: "不合格",
          inspectionTime: "2026-01-11 11:45"
        },
        {
          id: "Q004",
          product: "产品A",
          quantity: 90,
          result: "pass",
          resultText: "合格",
          inspectionTime: "2026-01-11 10:20"
        },
        {
          id: "Q005",
          product: "产品D",
          quantity: 60,
          result: "fail",
          resultText: "不合格",
          inspectionTime: "2026-01-11 09:30"
        }
      ]
    };
  },
  computed: {
    // 计算合格率
    computedPassRate() {
      if (this.inspectionRecords.length === 0)
        return 0;
      const sum = this.inspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
      const passCount = this.inspectionRecords.filter((item) => item.result === "pass").reduce((acc, cur) => acc + cur.quantity, 0);
      return sum > 0 ? (passCount / sum * 100).toFixed(2) : "0.00";
    },
    // 计算今日合格率
    computedTodayPassRate() {
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
      const todayRecords = this.inspectionRecords.filter((item) => item.inspectionTime.startsWith(today));
      if (todayRecords.length === 0)
        return 0;
      const sum = todayRecords.reduce((acc, cur) => acc + cur.quantity, 0);
      const passCount = todayRecords.filter((item) => item.result === "pass").reduce((acc, cur) => acc + cur.quantity, 0);
      return sum > 0 ? (passCount / sum * 100).toFixed(2) : "0.00";
    },
    // 计算今日检测数量
    todayInspections() {
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
      return this.inspectionRecords.filter((item) => item.inspectionTime.startsWith(today)).reduce((acc, cur) => acc + cur.quantity, 0);
    },
    // 计算今日合格数量
    rejectCount() {
      const today = (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
      return this.inspectionRecords.filter((item) => item.inspectionTime.startsWith(today) && item.result === "pass").reduce((acc, cur) => acc + cur.quantity, 0);
    },
    // 计算总检测数量
    totalInspections() {
      return this.inspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
    },
    // 计算总合格数量
    computedPassCount() {
      return this.inspectionRecords.filter((item) => item.result === "pass").reduce((acc, cur) => acc + cur.quantity, 0);
    }
  },
  methods: {
    // 打开新建质检弹出层
    openNewInspection() {
      this.inspectionForm = {
        product: "",
        quantity: "",
        result: "pass"
      };
      this.$refs.newInspectionPopup.open("center");
    },
    // 关闭新建质检弹出层
    closeNewInspection() {
      this.$refs.newInspectionPopup.close();
    },
    // 处理检测结果变化
    onResultChange(e) {
      this.inspectionForm.result = e.detail.value;
    },
    // 提交新建质检
    submitNewInspection() {
      if (!this.inspectionForm.product.trim()) {
        common_vendor.index.showToast({ title: "请输入产品名称", icon: "none" });
        return;
      }
      if (!this.inspectionForm.quantity || isNaN(this.inspectionForm.quantity) || parseInt(this.inspectionForm.quantity) <= 0) {
        common_vendor.index.showToast({ title: "请输入有效的检测数量", icon: "none" });
        return;
      }
      const newId = "Q" + (this.inspectionRecords.length + 1).toString().padStart(3, "0");
      const newRecord = {
        id: newId,
        product: this.inspectionForm.product,
        quantity: parseInt(this.inspectionForm.quantity),
        result: this.inspectionForm.result,
        resultText: this.inspectionForm.result === "pass" ? "合格" : "不合格",
        inspectionTime: (/* @__PURE__ */ new Date()).toLocaleString("zh-CN"),
        defects: []
      };
      this.inspectionRecords.unshift(newRecord);
      this.closeNewInspection();
      common_vendor.index.showToast({
        title: "质检记录添加成功",
        icon: "success"
      });
    },
    openQualityReport() {
      this.$refs.qualityReportPopup.open("center");
    },
    closeQualityReport() {
      this.$refs.qualityReportPopup.close();
    },
    deleteInspection(index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条质检记录吗？",
        confirmText: "删除",
        confirmColor: "#ff2d55",
        success: (res) => {
          if (res.confirm) {
            this.inspectionRecords.splice(index, 1);
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
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($options.computedPassRate),
    b: common_vendor.t($options.totalInspections),
    c: common_vendor.t($options.computedPassCount),
    d: common_vendor.f($data.inspectionRecords, (item, index, i0) => {
      return {
        a: common_vendor.t(item.id),
        b: common_vendor.t(item.resultText),
        c: common_vendor.n(item.result),
        d: common_vendor.t(item.product),
        e: common_vendor.t(item.quantity),
        f: common_vendor.t(item.inspectionTime),
        g: common_vendor.o(($event) => $options.deleteInspection(index), index),
        h: index
      };
    }),
    e: common_vendor.o((...args) => $options.openNewInspection && $options.openNewInspection(...args)),
    f: common_vendor.o((...args) => $options.openQualityReport && $options.openQualityReport(...args)),
    g: $data.inspectionForm.product,
    h: common_vendor.o(($event) => $data.inspectionForm.product = $event.detail.value),
    i: $data.inspectionForm.quantity,
    j: common_vendor.o(($event) => $data.inspectionForm.quantity = $event.detail.value),
    k: $data.inspectionForm.result,
    l: common_vendor.o((...args) => $options.onResultChange && $options.onResultChange(...args)),
    m: common_vendor.o((...args) => $options.closeNewInspection && $options.closeNewInspection(...args)),
    n: common_vendor.o((...args) => $options.submitNewInspection && $options.submitNewInspection(...args)),
    o: common_vendor.sr("newInspectionPopup", "fa3ada11-0"),
    p: common_vendor.t((/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN")),
    q: common_vendor.t($options.todayInspections),
    r: common_vendor.t($options.rejectCount),
    s: common_vendor.t($options.computedTodayPassRate),
    t: common_vendor.o((...args) => $options.closeQualityReport && $options.closeQualityReport(...args)),
    v: common_vendor.sr("qualityReportPopup", "fa3ada11-1")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fa3ada11"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/quality/quality.js.map
