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
  onShow() {
  },
  computed: {
    isAdmin() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo && userInfo.level === 1;
    }
  },
  methods: {
    getParticleStyle(n) {
      const colors = ["#c9a962", "#d4b896", "#c5a788", "#d4c4a8", "#bfbdba"];
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 4 + Math.random() * 5;
      const size = 6 + Math.random() * 12;
      return {
        left: `${left}%`,
        width: `${size}rpx`,
        height: `${size}rpx`,
        background: colors[n % colors.length],
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      };
    },
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
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(10, (n, k0, i0) => {
      return {
        a: n,
        b: common_vendor.s($options.getParticleStyle(n))
      };
    }),
    b: common_vendor.t($data.username.charAt(0).toUpperCase()),
    c: common_vendor.t($data.username),
    d: common_vendor.t($options.isAdmin ? "管理员" : "普通用户"),
    e: common_vendor.o((...args) => $options.editProfile && $options.editProfile(...args), "89"),
    f: common_vendor.o((...args) => $options.changePassword && $options.changePassword(...args), "0c"),
    g: common_vendor.o((...args) => $options.notificationSettings && $options.notificationSettings(...args), "9d"),
    h: $data.user,
    i: common_vendor.o(($event) => $data.user = $event.detail.value, "ed"),
    j: common_vendor.o((...args) => $options.close && $options.close(...args), "6b"),
    k: common_vendor.o((...args) => $options.confirmEditProfile && $options.confirmEditProfile(...args), "13"),
    l: common_vendor.sr("editProfilePopup", "ade5d05f-0"),
    m: common_vendor.p({
      type: "center"
    }),
    n: common_vendor.o((...args) => $options.close && $options.close(...args), "ae"),
    o: common_vendor.o((...args) => $options.confirmChangePassword && $options.confirmChangePassword(...args), "20"),
    p: common_vendor.sr("changePasswordPopup", "ade5d05f-1"),
    q: common_vendor.p({
      type: "center"
    }),
    r: common_vendor.o((...args) => $options.systemVersion && $options.systemVersion(...args), "85"),
    s: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args), "23"),
    t: common_vendor.o((...args) => $options.aboutSystem && $options.aboutSystem(...args), "70"),
    v: common_vendor.o((...args) => $options.logout && $options.logout(...args), "a4")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ade5d05f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/profile/profile.js.map
