"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        level: 0,
        username: "",
        password: ""
      },
      newform: {
        level: 0,
        name: "",
        pass: "",
        confirmPassword: ""
      },
      user: { level: 0, name: "", pass: "" },
      errorMsg: "",
      loading: false
    };
  },
  methods: {
    validateForm() {
      if (!this.form.username.trim()) {
        this.errorMsg = "请输入用户名";
        return false;
      }
      if (!this.form.password.trim()) {
        this.errorMsg = "请输入密码";
        return false;
      }
      this.errorMsg = "";
      return true;
    },
    handleLogin() {
      if (!this.validateForm()) {
        return;
      }
      this.loading = true;
      common_vendor.index.reLaunch({ url: "/pages/production/home/home" });
    },
    open() {
      this.$refs.popup.open("center");
      this.errorMsg = "";
      this.newform.name = "";
      this.newform.pass = "";
      this.newform.confirmPassword = "";
    },
    close() {
      this.$refs.popup.close();
      this.errorMsg = "";
      this.newform.name = "";
      this.newform.pass = "";
      this.newform.confirmPassword = "";
    },
    opclose() {
      if (this.newform.name === "" || this.newform.pass === "" || this.newform.confirmPassword === "") {
        this.errorMsg = "请填写完整的注册信息";
        return;
      }
      if (this.newform.pass !== this.newform.confirmPassword) {
        this.errorMsg = "两次密码输入不一致";
        return;
      }
      const existingUsers = common_vendor.index.getStorageSync("users") || [];
      const isUsernameExists = existingUsers.some((user) => user.name === this.newform.name);
      if (isUsernameExists) {
        this.errorMsg = "用户名已存在";
        return;
      }
      const newUser = {
        name: this.newform.name,
        pass: this.newform.pass,
        level: 0
        // 默认普通用户
      };
      existingUsers.push(newUser);
      common_vendor.index.setStorageSync("users", existingUsers);
      common_vendor.index.setStorageSync("userInfo", { username: this.newform.name });
      this.user.name = this.newform.name;
      this.user.pass = this.newform.pass;
      this.close();
      common_vendor.index.showToast({
        title: "注册成功",
        icon: "success"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.username,
    b: common_vendor.o(($event) => $data.form.username = $event.detail.value),
    c: $data.form.password,
    d: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    e: $data.errorMsg
  }, $data.errorMsg ? {
    f: common_vendor.t($data.errorMsg)
  } : {}, {
    g: common_vendor.t($data.loading ? "登录中..." : "登录"),
    h: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    i: $data.loading,
    j: common_vendor.o((...args) => $options.open && $options.open(...args)),
    k: common_vendor.o($options.close),
    l: common_vendor.p({
      type: "clear",
      size: "30"
    }),
    m: $data.newform.name,
    n: common_vendor.o(($event) => $data.newform.name = $event.detail.value),
    o: $data.newform.pass,
    p: common_vendor.o(($event) => $data.newform.pass = $event.detail.value),
    q: $data.newform.confirmPassword,
    r: common_vendor.o(($event) => $data.newform.confirmPassword = $event.detail.value),
    s: $data.errorMsg
  }, $data.errorMsg ? {
    t: common_vendor.t($data.errorMsg)
  } : {}, {
    v: common_vendor.o((...args) => $options.opclose && $options.opclose(...args)),
    w: common_vendor.sr("popup", "39c23589-0"),
    x: common_vendor.p({
      ["mask-click"]: false
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-39c23589"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/login/login.js.map
