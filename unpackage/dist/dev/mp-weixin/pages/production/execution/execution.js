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
    }
  },
  plan: {
    getPlans: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/plan${queryString ? `?${queryString}` : ""}`,
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
    updatePlan: async (id, data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/plan/${id}`,
          method: "PUT",
          data,
          header: {
            "Content-Type": "application/json; charset=utf-8"
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
    }
  },
  record: {
    createRecord: async (data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/record`,
          method: "POST",
          data,
          header: {
            "Content-Type": "application/json; charset=utf-8"
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
    }
  },
  quality: {
    createQuality: async (data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/quality`,
          method: "POST",
          data,
          header: {
            "Content-Type": "application/json; charset=utf-8"
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
    }
  }
};
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const _sfc_main = {
  name: "ExecutionPage",
  computed: {
    // 所有设备列表（用于选择）
    allDevices() {
      return this.devices;
    }
  },
  data() {
    return {
      // 实时生产数据（基于生产计划计算）
      realtimeData: {
        currentProduction: 0,
        productionEfficiency: 0,
        dailyTarget: 0,
        completionRate: 0
      },
      // 生产任务列表（与生产计划对应）
      productionTasks: [],
      // 设备状态信息
      devices: [],
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
      this.loadDevices();
      this.loadProductionPlans();
    },
    // 加载设备列表
    loadDevices() {
      api.equipment.getEquipments().then((res) => {
        common_vendor.index.__f__("log", "at pages/production/execution/execution.vue:343", "设备列表响应:", res);
        if (res && res.success && res.data && res.data.list) {
          this.devices = res.data.list.map((equip) => ({
            id: equip.equioment_id,
            name: equip.equio,
            status: equip.status === "运行中" || equip.status === "运行" ? "running" : "idle",
            statusText: equip.status,
            params: equip.statusText || "正常运行"
          }));
          common_vendor.index.__f__("log", "at pages/production/execution/execution.vue:352", "设备列表已加载:", this.devices);
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/production/execution/execution.vue:355", "加载设备列表失败:", error);
      });
    },
    // 加载生产计划
    loadProductionPlans() {
      api.plan.getPlans().then((res) => {
        common_vendor.index.__f__("log", "at pages/production/execution/execution.vue:362", "生产计划响应:", res);
        if (res && res.success && res.data && res.data.list) {
          this.productionTasks = res.data.list.map((plan) => ({
            id: plan.plan_id,
            name: plan.product,
            planQuantity: plan.quantity,
            completedQuantity: Math.round(plan.quantity * plan.progress / 100),
            status: plan.status,
            statusText: plan.statusText
          }));
          common_vendor.index.__f__("log", "at pages/production/execution/execution.vue:372", "生产计划已加载:", this.productionTasks);
          this.calculateRealtimeData();
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/production/execution/execution.vue:377", "加载生产计划失败:", error);
      });
    },
    // 设备选择变更
    onEquipmentChange(e) {
      this.equipmentIndex = e.detail.value;
      if (this.allDevices[this.equipmentIndex]) {
        this.outputForm.equipmentId = this.allDevices[this.equipmentIndex].name;
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
        equipmentId: this.allDevices.length > 0 ? this.allDevices[0].name : "",
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
      common_vendor.index.showLoading({ title: "提交中..." });
      const qualified = this.outputForm.quantity - this.outputForm.rejectQuantity;
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const username = userInfo && userInfo.username ? userInfo.username : "默认用户";
      api.record.createRecord({
        plan_id: this.selectedTask.id,
        product: this.selectedTask.name,
        output: this.outputForm.quantity,
        unqual: this.outputForm.rejectQuantity,
        qual: qualified,
        equio: this.outputForm.equipmentId,
        date: formatDate(/* @__PURE__ */ new Date()),
        name: username,
        md: this.outputForm.remark
      }).then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("log", "at pages/production/execution/execution.vue:454", "创建记录响应:", JSON.stringify(res));
        if (res && res.success && res.data && res.data.insertId) {
          const recordId = res.data.insertId;
          common_vendor.index.__f__("log", "at pages/production/execution/execution.vue:458", "创建质检记录，record_id:", recordId);
          api.quality.createQuality({
            record_id: recordId,
            product: this.selectedTask.name,
            quantity: this.outputForm.quantity,
            qual: qualified,
            unqual: this.outputForm.rejectQuantity,
            inspection_time: formatDate(/* @__PURE__ */ new Date())
          }).then((qualityRes) => {
            common_vendor.index.__f__("log", "at pages/production/execution/execution.vue:467", "创建质检记录响应:", JSON.stringify(qualityRes));
          }).catch((qualityError) => {
            common_vendor.index.__f__("error", "at pages/production/execution/execution.vue:469", "创建质检记录失败:", qualityError);
          });
          const taskIndex = this.productionTasks.findIndex((t) => t.id === this.selectedTask.id);
          if (taskIndex !== -1) {
            const newCompletedQuantity = this.productionTasks[taskIndex].completedQuantity + this.outputForm.quantity;
            const newProgress = Math.round(newCompletedQuantity / this.productionTasks[taskIndex].planQuantity * 100);
            const finalProgress = Math.min(newProgress, 100);
            const finalCompletedQuantity = Math.min(newCompletedQuantity, this.productionTasks[taskIndex].planQuantity);
            this.productionTasks[taskIndex].completedQuantity = finalCompletedQuantity;
            let newStatus = this.productionTasks[taskIndex].status;
            let newStatusText = this.productionTasks[taskIndex].statusText;
            if (finalProgress === 100) {
              newStatus = "completed";
              newStatusText = "已完成";
            }
            api.plan.updatePlan(this.selectedTask.id, {
              progress: finalProgress,
              status: newStatus,
              statusText: newStatusText
            }).catch((error) => {
              common_vendor.index.__f__("error", "at pages/production/execution/execution.vue:500", "更新计划失败:", error);
            });
            this.productionTasks[taskIndex].status = newStatus;
            this.productionTasks[taskIndex].statusText = newStatusText;
          }
          common_vendor.index.showToast({ title: "产量上报成功", icon: "success" });
          this.closeOutputPopup();
          this.calculateRealtimeData();
        } else {
          const errorMsg = res ? res.message : "提交失败";
          common_vendor.index.showToast({ title: errorMsg, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/production/execution/execution.vue:522", "提交产量上报失败:", error);
        common_vendor.index.showToast({ title: "提交失败", icon: "none" });
      });
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
    h: common_vendor.o((...args) => $options.reportIssue && $options.reportIssue(...args), "88"),
    i: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args), "88"),
    j: common_vendor.sr("issuePopup", "51cb737f-0"),
    k: common_vendor.p({
      type: "center"
    }),
    l: common_vendor.t((_a = $data.selectedTask) == null ? void 0 : _a.name),
    m: $data.outputForm.quantity,
    n: common_vendor.o(common_vendor.m(($event) => $data.outputForm.quantity = $event.detail.value, {
      number: true
    }), "08"),
    o: $data.outputForm.rejectQuantity,
    p: common_vendor.o(common_vendor.m(($event) => $data.outputForm.rejectQuantity = $event.detail.value, {
      number: true
    }), "db"),
    q: common_vendor.t(((_b = $options.allDevices[$data.equipmentIndex]) == null ? void 0 : _b.name) || "请选择设备"),
    r: common_vendor.o((...args) => $options.onEquipmentChange && $options.onEquipmentChange(...args), "49"),
    s: $data.equipmentIndex,
    t: $options.allDevices,
    v: $data.outputForm.remark,
    w: common_vendor.o(($event) => $data.outputForm.remark = $event.detail.value, "81"),
    x: common_vendor.o((...args) => $options.closeOutputPopup && $options.closeOutputPopup(...args), "9e"),
    y: common_vendor.o((...args) => $options.submitOutput && $options.submitOutput(...args), "b0"),
    z: common_vendor.sr("outputPopup", "51cb737f-1"),
    A: common_vendor.p({
      type: "center"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-51cb737f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/execution/execution.js.map
