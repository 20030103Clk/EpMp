"use strict";
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  state: {
    hasLogin: false,
    loginProvider: "",
    openid: null,
    userInfo: null
  },
  mutations: {
    login(state, userInfo) {
      state.hasLogin = true;
      state.userInfo = userInfo;
    },
    logout(state) {
      state.hasLogin = false;
      state.openid = null;
      state.userInfo = null;
    },
    setOpenid(state, openid) {
      state.openid = openid;
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.hasLogin;
    },
    currentUser(state) {
      return state.userInfo;
    }
  },
  actions: {
    // 登录
    login(context, userInfo) {
      context.commit("login", userInfo);
    },
    // 退出登录
    logout(context) {
      context.commit("logout");
    }
  }
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
