"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  user: {
    updateUser: async (id, data) => {
      const response = await common_vendor.index.request({
        url: `${API_BASE_URL}/user/${id}`,
        method: "PUT",
        data,
        header: {
          "Content-Type": "application/json"
        }
      });
      return response[1].data;
    }
  }
};
const _sfc_main = {
  data() {
    return {
      username: "",
      user: ""
    };
  },
  onLoad() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      this.username = userInfo.username;
    } else {
      common_vendor.index.redirectTo({ url: "/pages/production/login/login" });
    }
  },
  computed: {
    isAdmin() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo && userInfo.level === 1;
    }
  },
  methods: {
    close() {
      this.$refs.changePasswordPopup.close();
      this.$refs.editProfilePopup.close();
    },
    confirmChangePassword() {
      common_vendor.index.showLoading({ title: "修改中..." });
      api.user.updatePassword({
        oldPassword: "旧密码",
        newPassword: "新密码"
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.showToast({ title: "密码修改成功", icon: "success" });
          this.$refs.changePasswordPopup.close();
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "修改失败", icon: "none" });
      });
    },
    confirmEditProfile() {
      common_vendor.index.showLoading({ title: "更新中..." });
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      api.user.updateUser(userInfo.id, {
        name: this.user
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          this.username = this.user;
          common_vendor.index.setStorageSync("userInfo", { username: this.username, id: userInfo.id });
          common_vendor.index.showToast({ title: "编辑资料成功", icon: "success" });
          this.$refs.editProfilePopup.close();
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "更新失败", icon: "none" });
      });
    },
    // 个人设置
    editProfile() {
      this.$refs.editProfilePopup.open("center");
    },
    changePassword() {
      this.$refs.changePasswordPopup.open("center");
    },
    notificationSettings() {
      common_vendor.index.showToast({ title: "通知设置功能开发中", icon: "none" });
    },
    // 系统信息
    systemVersion() {
      common_vendor.index.showToast({ title: "版本信息功能开发中", icon: "none" });
    },
    checkUpdate() {
      common_vendor.index.showToast({ title: "已是最新版本", icon: "success" });
    },
    aboutSystem() {
      common_vendor.index.showToast({ title: "欢迎使用生产企业管理系统，我是作者联系方式：13811111111", icon: "none" });
    },
    // 退出登录
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.showToast({ title: "退出登录成功", icon: "success" });
            setTimeout(() => {
              common_vendor.index.redirectTo({ url: "/pages/production/login/login" });
            }, 1500);
          }
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
  return {
    a: common_vendor.t($data.username.charAt(0).toUpperCase()),
    b: common_vendor.t($data.username),
    c: common_vendor.t($options.isAdmin ? "管理员" : "普通用户"),
    d: common_vendor.o($options.close, "c3"),
    e: common_vendor.p({
      type: "clear",
      size: "30"
    }),
    f: $data.user,
    g: common_vendor.o(($event) => $data.user = $event.detail.value, "fe"),
    h: common_vendor.o((...args) => $options.confirmEditProfile && $options.confirmEditProfile(...args), "f2"),
    i: common_vendor.sr("editProfilePopup", "ade5d05f-0"),
    j: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    k: common_vendor.o((...args) => $options.editProfile && $options.editProfile(...args), "7c"),
    l: common_vendor.o($options.close, "13"),
    m: common_vendor.p({
      type: "clear",
      size: "30"
    }),
    n: common_vendor.o((...args) => $options.confirmChangePassword && $options.confirmChangePassword(...args), "1c"),
    o: common_vendor.sr("changePasswordPopup", "ade5d05f-2"),
    p: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    q: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args), "69"),
    r: common_vendor.o((...args) => $options.notificationSettings && $options.notificationSettings(...args), "16"),
    s: common_vendor.o((...args) => $options.systemVersion && $options.systemVersion(...args), "e2"),
    t: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args), "8a"),
    v: common_vendor.o((...args) => $options.aboutSystem && $options.aboutSystem(...args), "e2"),
    w: common_vendor.o((...args) => $options.logout && $options.logout(...args), "a0")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ade5d05f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/profile/profile.js.map
