"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "ExecutionPage",
  computed: {
    // 运行中的设备列表
    runningDevices() {
      return this.devices.filter((device) => device.status === "running");
    }
  },
  data() {
    const productionPlans = [
      { id: "P001", product: "产品A", quantity: 500, startDate: "2026-01-11", endDate: "2026-01-15", status: "processing", statusText: "生产中", progress: 60 },
      { id: "P002", product: "产品B", quantity: 300, startDate: "2026-01-12", endDate: "2026-01-16", status: "pending", statusText: "待生产", progress: 0 },
      { id: "P003", product: "产品C", quantity: 800, startDate: "2026-01-10", endDate: "2026-01-14", status: "completed", statusText: "已完成", progress: 100 },
      { id: "P004", product: "产品D", quantity: 200, startDate: "2026-01-11", endDate: "2026-01-13", status: "processing", statusText: "生产中", progress: 85 },
      { id: "P005", product: "产品E", quantity: 600, startDate: "2026-01-13", endDate: "2026-01-17", status: "pending", statusText: "待生产", progress: 0 }
    ];
    const processingPlans = productionPlans.filter((plan) => plan.status === "processing");
    const totalPlanQuantity = processingPlans.reduce((sum, plan) => sum + plan.quantity, 0);
    const totalCompleted = processingPlans.reduce((sum, plan) => sum + plan.quantity * plan.progress / 100, 0);
    return {
      // 实时生产数据（基于生产计划计算）
      realtimeData: {
        currentProduction: Math.round(totalCompleted),
        productionEfficiency: totalCompleted / 8,
        dailyTarget: totalPlanQuantity,
        completionRate: Math.round(totalCompleted / totalPlanQuantity * 100) || 0
      },
      // 生产任务列表（与生产计划对应）
      productionTasks: productionPlans.map((plan) => ({
        id: plan.id,
        name: plan.product,
        planQuantity: plan.quantity,
        completedQuantity: Math.round(plan.quantity * plan.progress / 100),
        status: plan.status,
        statusText: plan.statusText
      })),
      // 设备状态信息
      devices: [
        {
          id: 1,
          name: "生产线1",
          status: "running",
          statusText: "运行中",
          params: "产品A"
        },
        {
          id: 2,
          name: "生产线2",
          status: "running",
          statusText: "运行中",
          params: "产品D"
        },
        {
          id: 3,
          name: "生产线3",
          status: "idle",
          statusText: "待机中",
          params: "准备生产产品B"
        }
      ],
      // 上报产量表单数据
      selectedTask: null,
      outputForm: {
        quantity: 0,
        rejectQuantity: 0,
        equipmentId: "",
        remark: ""
      },
      // 设备选择索引
      equipmentIndex: 0
    };
  },
  onLoad() {
    this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      const savedPlans = common_vendor.index.getStorageSync("productionPlan");
      if (savedPlans && savedPlans.length > 0) {
        common_vendor.index.__f__("log", "at pages/production/execution/execution.vue:240", "已加载保存的生产计划:", savedPlans);
      }
    },
    // 设备选择变更
    onEquipmentChange(e) {
      this.equipmentIndex = e.detail.value;
      if (this.runningDevices[this.equipmentIndex]) {
        this.outputForm.equipmentId = this.runningDevices[this.equipmentIndex].id;
      }
    },
    // 报告异常
    reportIssue() {
      this.$refs.issuePopup.open();
    },
    // 关闭弹出层
    closePopup() {
      this.$refs.issuePopup.close();
    },
    // 打开产量上报表单
    reportOutput(task) {
      this.selectedTask = task;
      this.outputForm = {
        quantity: 0,
        rejectQuantity: 0,
        equipmentId: this.runningDevices.length > 0 ? this.runningDevices[0].id : "",
        remark: ""
      };
      this.equipmentIndex = 0;
      this.$refs.outputPopup.open();
    },
    // 关闭产量上报表单
    closeOutputPopup() {
      this.$refs.outputPopup.close();
      this.selectedTask = null;
    },
    // 提交产量上报
    submitOutput() {
      if (this.outputForm.quantity <= 0) {
        common_vendor.index.showToast({ title: "请输入有效产量", icon: "none" });
        return;
      }
      if (!this.outputForm.equipmentId) {
        common_vendor.index.showToast({ title: "请选择生产设备", icon: "none" });
        return;
      }
      const taskIndex = this.productionTasks.findIndex((t) => t.id === this.selectedTask.id);
      if (taskIndex !== -1) {
        this.productionTasks[taskIndex].completedQuantity += this.outputForm.quantity;
        if (this.productionTasks[taskIndex].completedQuantity > this.productionTasks[taskIndex].planQuantity) {
          this.productionTasks[taskIndex].completedQuantity = this.productionTasks[taskIndex].planQuantity;
        }
        if (this.productionTasks[taskIndex].completedQuantity >= this.productionTasks[taskIndex].planQuantity) {
          this.productionTasks[taskIndex].status = "completed";
          this.productionTasks[taskIndex].statusText = "已完成";
        }
      }
      this.saveProductionRecord();
      common_vendor.index.setStorageSync("productionTasks", this.productionTasks);
      common_vendor.index.showToast({ title: "产量上报成功", icon: "success" });
      this.closeOutputPopup();
      this.calculateRealtimeData();
    },
    // 保存生产记录
    saveProductionRecord() {
      const now = /* @__PURE__ */ new Date();
      const reportTime = now.toISOString().slice(0, 19).replace("T", " ");
      const totalQuantity = this.outputForm.quantity;
      const qualifiedQuantity = totalQuantity - this.outputForm.rejectQuantity;
      const qualifiedRate = totalQuantity > 0 ? Math.round(qualifiedQuantity / totalQuantity * 100) : 0;
      const equipment = this.devices.find((device) => device.id === this.outputForm.equipmentId);
      const equipmentName = equipment ? equipment.name : "未知设备";
      const recordId = "R" + now.getTime().toString().slice(-6);
      const newRecord = {
        id: recordId,
        productName: this.selectedTask.name,
        quantity: this.outputForm.quantity,
        rejectQuantity: this.outputForm.rejectQuantity,
        qualifiedRate,
        equipmentId: this.outputForm.equipmentId,
        equipmentName,
        reportTime,
        reportPerson: "当前用户",
        // 实际应用中应从登录信息获取
        remark: this.outputForm.remark
      };
      const existingRecords = common_vendor.index.getStorageSync("productionRecords") || [];
      existingRecords.unshift(newRecord);
      common_vendor.index.setStorageSync("productionRecords", existingRecords);
    },
    // 计算实时数据
    calculateRealtimeData() {
      const currentProduction = this.productionTasks.reduce((sum, task) => sum + task.completedQuantity, 0);
      const productionEfficiency = currentProduction / 4;
      const dailyTarget = this.productionTasks.filter((task) => task.status === "processing").reduce((sum, task) => sum + task.planQuantity, 0);
      const completionRate = dailyTarget > 0 ? Math.round(currentProduction / dailyTarget * 100) : 0;
      this.realtimeData = {
        currentProduction,
        productionEfficiency,
        dailyTarget,
        completionRate
      };
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
  var _a, _b;
  return {
    a: common_vendor.t($data.realtimeData.currentProduction),
    b: common_vendor.t($data.realtimeData.productionEfficiency),
    c: common_vendor.t($data.realtimeData.dailyTarget),
    d: common_vendor.t($data.realtimeData.completionRate),
    e: $data.realtimeData.completionRate + "%",
    f: common_vendor.f($data.productionTasks, (task, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(task.name),
        b: common_vendor.t(task.statusText),
        c: common_vendor.n("status-" + task.status),
        d: common_vendor.t(task.planQuantity),
        e: common_vendor.t(task.completedQuantity),
        f: task.status === "processing"
      }, task.status === "processing" ? {
        g: common_vendor.o(($event) => $options.reportOutput(task), task.id)
      } : {}, {
        h: task.id
      });
    }),
    g: common_vendor.f($data.devices, (device, k0, i0) => {
      return {
        a: common_vendor.t(device.name),
        b: common_vendor.t(device.statusText),
        c: common_vendor.n("status-" + device.status),
        d: common_vendor.t(device.params),
        e: device.id
      };
    }),
    h: common_vendor.o((...args) => $options.reportIssue && $options.reportIssue(...args)),
    i: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    j: common_vendor.sr("issuePopup", "51cb737f-0"),
    k: common_vendor.p({
      type: "center"
    }),
    l: common_vendor.t((_a = $data.selectedTask) == null ? void 0 : _a.name),
    m: $data.outputForm.quantity,
    n: common_vendor.o(common_vendor.m(($event) => $data.outputForm.quantity = $event.detail.value, {
      number: true
    })),
    o: $data.outputForm.rejectQuantity,
    p: common_vendor.o(common_vendor.m(($event) => $data.outputForm.rejectQuantity = $event.detail.value, {
      number: true
    })),
    q: common_vendor.t(((_b = $options.runningDevices[$data.equipmentIndex]) == null ? void 0 : _b.name) || "请选择设备"),
    r: common_vendor.o((...args) => $options.onEquipmentChange && $options.onEquipmentChange(...args)),
    s: $data.equipmentIndex,
    t: $options.runningDevices,
    v: $data.outputForm.remark,
    w: common_vendor.o(($event) => $data.outputForm.remark = $event.detail.value),
    x: common_vendor.o((...args) => $options.closeOutputPopup && $options.closeOutputPopup(...args)),
    y: common_vendor.o((...args) => $options.submitOutput && $options.submitOutput(...args)),
    z: common_vendor.sr("outputPopup", "51cb737f-1"),
    A: common_vendor.p({
      type: "center"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-51cb737f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/execution/execution.js.map
