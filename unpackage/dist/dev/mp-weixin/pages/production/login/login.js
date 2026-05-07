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
        common_vendor.index.__f__("log", "at pages/production/login/login.vue:75", "Login API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/login/login.vue:85", "Login error:", error);
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
        common_vendor.index.__f__("log", "at pages/production/login/login.vue:99", "Register API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/login/login.vue:109", "Register error:", error);
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
  onLoad() {
    common_vendor.index.removeStorageSync("userInfo");
    common_vendor.index.removeStorageSync("token");
  },
  methods: {
    getParticleStyle(n) {
      const colors = ["#c9a962", "#d4b896", "#c5a788", "#d4c4a8", "#bfbdba"];
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 4;
      const size = 8 + Math.random() * 16;
      return {
        left: `${left}%`,
        width: `${size}rpx`,
        height: `${size}rpx`,
        background: colors[n % colors.length],
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      };
    },
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
        common_vendor.index.__f__("log", "at pages/production/login/login.vue:176", "Login response:", res);
        if (res && res.success) {
          const userLevel = res.data.user.remark;
          common_vendor.index.setStorageSync("userInfo", {
            username: res.data.user.name,
            level: userLevel
          });
          common_vendor.index.setStorageSync("token", res.data.token);
          common_vendor.index.reLaunch({ url: "/pages/production/home/home" });
        } else {
          this.errorMsg = res ? res.message : "登录失败，请稍后重试";
          this.loading = false;
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/production/login/login.vue:191", "Login error:", error);
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
        common_vendor.index.__f__("log", "at pages/production/login/login.vue:224", "Register response:", res);
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
        common_vendor.index.__f__("error", "at pages/production/login/login.vue:238", "Register error:", error);
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
    a: common_vendor.f(20, (n, k0, i0) => {
      return {
        a: n,
        b: common_vendor.s($options.getParticleStyle(n))
      };
    }),
    b: common_vendor.p({
      type: "user",
      size: "24"
    }),
    c: $data.form.username,
    d: common_vendor.o(($event) => $data.form.username = $event.detail.value, "74"),
    e: common_vendor.p({
      type: "lock",
      size: "24"
    }),
    f: $data.form.password,
    g: common_vendor.o(($event) => $data.form.password = $event.detail.value, "74"),
    h: $data.errorMsg
  }, $data.errorMsg ? {
    i: common_vendor.t($data.errorMsg)
  } : {}, {
    j: common_vendor.t($data.loading ? "登录中..." : "登录"),
    k: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args), "c5"),
    l: $data.loading,
    m: common_vendor.o((...args) => $options.open && $options.open(...args), "fb"),
    n: common_vendor.o($options.close, "2c"),
    o: common_vendor.p({
      type: "clear",
      size: "30"
    }),
    p: $data.newform.name,
    q: common_vendor.o(($event) => $data.newform.name = $event.detail.value, "a6"),
    r: $data.newform.pass,
    s: common_vendor.o(($event) => $data.newform.pass = $event.detail.value, "a9"),
    t: $data.newform.confirmPassword,
    v: common_vendor.o(($event) => $data.newform.confirmPassword = $event.detail.value, "41"),
    w: $data.errorMsg
  }, $data.errorMsg ? {
    x: common_vendor.t($data.errorMsg)
  } : {}, {
    y: common_vendor.o((...args) => $options.close && $options.close(...args), "db"),
    z: common_vendor.o((...args) => $options.opclose && $options.opclose(...args), "60"),
    A: common_vendor.sr("popup", "39c23589-2"),
    B: common_vendor.p({
      ["mask-click"]: false
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-39c23589"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/login/login.js.map
