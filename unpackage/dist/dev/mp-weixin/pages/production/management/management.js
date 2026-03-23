"use strict";
const common_vendor = require("../../../common/vendor.js");
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
  methods: {
    loadUsers() {
      const users = common_vendor.index.getStorageSync("users") || [];
      this.users = users;
    },
    onLevelChange(e, index) {
      const newLevel = parseInt(e.detail.value);
      this.users[index].level = newLevel;
      common_vendor.index.setStorageSync("users", this.users);
      common_vendor.index.showToast({
        title: "用户级别已更新",
        icon: "success"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.users, (user, index, i0) => {
      return {
        a: common_vendor.t(user.name),
        b: common_vendor.t(user.level === 1 ? "管理员" : "普通用户"),
        c: user.level.toString(),
        d: common_vendor.o((e) => $options.onLevelChange(e, index), index),
        e: index
      };
    }),
    b: $data.users.length === 0
  }, $data.users.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-74f94787"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/management/management.js.map
