"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  user: {
    login: async (data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/user/login`,
          method: "POST",
          data: JSON.stringify(data),
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/production/login/login.vue:58", "Login API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/login/login.vue:70", "Login error:", error);
        throw error;
      }
    },
    register: async (data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/user/register`,
          method: "POST",
          data: JSON.stringify(data),
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/production/login/login.vue:85", "Register API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/login/login.vue:97", "Register error:", error);
        throw error;
      }
    }
  }
};
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
      api.user.login({
        name: this.form.username,
        pass: this.form.password
      }).then((res) => {
        common_vendor.index.__f__("log", "at pages/production/login/login.vue:147", "Login response:", res);
        if (res && res.success) {
          common_vendor.index.setStorageSync("userInfo", {
            username: res.data.user.name,
            level: res.data.user.remark
          });
          common_vendor.index.setStorageSync("token", res.data.token);
          common_vendor.index.reLaunch({ url: "/pages/production/home/home" });
        } else {
          this.errorMsg = res ? res.message : "登录失败，请稍后重试";
          this.loading = false;
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/production/login/login.vue:160", "Login error:", error);
        this.errorMsg = "登录失败，请检查用户名和密码";
        this.loading = false;
      });
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
      api.user.register({
        name: this.newform.name,
        pass: this.newform.pass,
        remark: 0
      }).then((res) => {
        common_vendor.index.__f__("log", "at pages/production/login/login.vue:217", "Register response:", res);
        if (res && res.success) {
          common_vendor.index.setStorageSync("userInfo", { username: this.newform.name });
          this.user.name = this.newform.name;
          this.user.pass = this.newform.pass;
          this.close();
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success"
          });
        } else {
          this.errorMsg = res ? res.message : "注册失败，请稍后重试";
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/production/login/login.vue:231", "Register error:", error);
        if (error && error.statusCode === 409) {
          this.errorMsg = "用户名已存在";
        } else {
          this.errorMsg = "注册失败，请稍后重试";
        }
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
    b: common_vendor.o(($event) => $data.form.username = $event.detail.value, "f4"),
    c: $data.form.password,
    d: common_vendor.o(($event) => $data.form.password = $event.detail.value, "02"),
    e: $data.errorMsg
  }, $data.errorMsg ? {
    f: common_vendor.t($data.errorMsg)
  } : {}, {
    g: common_vendor.t($data.loading ? "登录中..." : "登录"),
    h: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args), "fe"),
    i: $data.loading,
    j: common_vendor.o((...args) => $options.open && $options.open(...args), "19"),
    k: common_vendor.o($options.close, "2f"),
    l: common_vendor.p({
      type: "clear",
      size: "30"
    }),
    m: $data.newform.name,
    n: common_vendor.o(($event) => $data.newform.name = $event.detail.value, "fa"),
    o: $data.newform.pass,
    p: common_vendor.o(($event) => $data.newform.pass = $event.detail.value, "88"),
    q: $data.newform.confirmPassword,
    r: common_vendor.o(($event) => $data.newform.confirmPassword = $event.detail.value, "47"),
    s: $data.errorMsg
  }, $data.errorMsg ? {
    t: common_vendor.t($data.errorMsg)
  } : {}, {
    v: common_vendor.o((...args) => $options.opclose && $options.opclose(...args), "9c"),
    w: common_vendor.sr("popup", "39c23589-0"),
    x: common_vendor.p({
      ["mask-click"]: false
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-39c23589"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/login/login.js.map
