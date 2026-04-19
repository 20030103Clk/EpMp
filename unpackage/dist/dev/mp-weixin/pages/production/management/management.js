"use strict";
const common_vendor = require("../../../common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const api = {
  user: {
    getUsers: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/user${queryString ? `?${queryString}` : ""}`,
          method: "GET"
        });
        common_vendor.index.__f__("log", "at pages/production/management/management.vue:60", "Get users API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/management/management.vue:72", "Get users error:", error);
        throw error;
      }
    },
    updateUser: async (id, data) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/user/${id}`,
          method: "PUT",
          data: JSON.stringify(data),
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/production/management/management.vue:87", "Update user API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/management/management.vue:99", "Update user error:", error);
        throw error;
      }
    },
    deleteUser: async (id) => {
      try {
        const response = await common_vendor.index.request({
          url: `${API_BASE_URL}/user/${id}`,
          method: "DELETE"
        });
        common_vendor.index.__f__("log", "at pages/production/management/management.vue:110", "Delete user API response:", response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error("Invalid response from server");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/production/management/management.vue:122", "Delete user error:", error);
        throw error;
      }
    }
  }
};
const _sfc_main = {
  data() {
    return {
      users: []
    };
  },
  onLoad() {
    this.loadUsers();
  },
  onShow() {
    this.loadUsers();
  },
  computed: {
    isAdmin() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo && userInfo.level === 1;
    }
  },
  methods: {
    loadUsers() {
      common_vendor.index.showLoading({ title: "加载中..." });
      api.user.getUsers().then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          this.users = res.data.list.map((user) => ({
            id: user.id,
            name: user.name,
            level: user.remark || 0
          }));
        } else {
          common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
      });
    },
    onLevelChange(e, index) {
      const newLevel = parseInt(e.detail.value);
      const user = this.users[index];
      common_vendor.index.showLoading({ title: "更新中..." });
      api.user.updateUser(user.id, {
        remark: newLevel
      }).then((res) => {
        common_vendor.index.hideLoading();
        if (res.success) {
          this.users[index].level = newLevel;
          common_vendor.index.showToast({
            title: "用户级别已更新",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({ title: res.message, icon: "none" });
        }
      }).catch((error) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "更新失败", icon: "none" });
      });
    },
    deleteUser(index) {
      const user = this.users[index];
      common_vendor.index.showModal({
        title: "删除用户",
        content: `确定要删除用户"${user.name}"吗？`,
        confirmText: "删除",
        confirmColor: "#ff2d55",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "删除中..." });
            api.user.deleteUser(user.id).then((res2) => {
              common_vendor.index.hideLoading();
              if (res2.success) {
                this.users.splice(index, 1);
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({ title: res2.message, icon: "none" });
              }
            }).catch((error) => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "删除失败", icon: "none" });
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.isAdmin
  }, $options.isAdmin ? common_vendor.e({
    b: common_vendor.f($data.users, (user, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(user.name),
        b: common_vendor.t(user.level === 1 ? "管理员" : "普通用户"),
        c: common_vendor.n(user.level === 1 ? "admin" : "normal")
      }, $options.isAdmin ? {
        d: user.level.toString(),
        e: common_vendor.o((e) => $options.onLevelChange(e, index), index),
        f: common_vendor.o(($event) => $options.deleteUser(index), index)
      } : {}, {
        g: index
      });
    }),
    c: $options.isAdmin,
    d: $data.users.length === 0
  }, $data.users.length === 0 ? {} : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-74f94787"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/management/management.js.map
