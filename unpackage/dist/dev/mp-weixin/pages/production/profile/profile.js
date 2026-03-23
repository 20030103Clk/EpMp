"use strict";
const common_vendor = require("../../../common/vendor.js");
const uniIcons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _sfc_main = {
  components: { uniIcons },
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
  methods: {
    close() {
      this.$refs.changePasswordPopup.close();
      this.$refs.editProfilePopup.close();
    },
    confirmChangePassword() {
      common_vendor.index.showToast({ title: "修改密码功能开发中", icon: "none" });
      this.$refs.changePasswordPopup.close();
    },
    confirmEditProfile() {
      this.username = this.user;
      common_vendor.index.setStorageSync("userInfo", { username: this.username });
      common_vendor.index.showToast({ title: "编辑资料成功", icon: "success" });
      this.$refs.editProfilePopup.close();
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
    c: common_vendor.o($options.close),
    d: common_vendor.p({
      type: "clear",
      size: "30"
    }),
    e: $data.user,
    f: common_vendor.o(($event) => $data.user = $event.detail.value),
    g: common_vendor.o((...args) => $options.confirmEditProfile && $options.confirmEditProfile(...args)),
    h: common_vendor.sr("editProfilePopup", "ade5d05f-0"),
    i: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    j: common_vendor.o((...args) => $options.editProfile && $options.editProfile(...args)),
    k: common_vendor.o($options.close),
    l: common_vendor.p({
      type: "clear",
      size: "30"
    }),
    m: common_vendor.o((...args) => $options.confirmChangePassword && $options.confirmChangePassword(...args)),
    n: common_vendor.sr("changePasswordPopup", "ade5d05f-2"),
    o: common_vendor.p({
      ["mask-click"]: false,
      background: "rgba(0, 0, 0, 0.6)"
    }),
    p: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args)),
    q: common_vendor.o((...args) => $options.notificationSettings && $options.notificationSettings(...args)),
    r: common_vendor.o((...args) => $options.systemVersion && $options.systemVersion(...args)),
    s: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    t: common_vendor.o((...args) => $options.aboutSystem && $options.aboutSystem(...args)),
    v: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ade5d05f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/profile/profile.js.map
