"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "SplashPage",
  data() {
    return {
      progress: 0,
      loadingText: "正在初始化...",
      loadingTexts: [
        "正在初始化...",
        "加载资源中...",
        "连接服务器...",
        "加载数据中...",
        "即将完成..."
      ],
      timer: null
    };
  },
  onLoad() {
    this.startLoading();
  },
  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    getParticleStyle(n) {
      const colors = ["#c9a962", "#d4b896", "#c5a788", "#d4c4a8", "#bfbdba"];
      const left = 10 + Math.random() * 80;
      const top = 10 + Math.random() * 80;
      const delay = Math.random() * 3;
      const duration = 3 + Math.random() * 4;
      const size = 8 + Math.random() * 16;
      return {
        left: `${left}%`,
        top: `${top}%`,
        width: `${size}rpx`,
        height: `${size}rpx`,
        background: colors[n % colors.length],
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      };
    },
    startLoading() {
      let step = 0;
      const totalSteps = 100;
      const intervalTime = 30;
      this.timer = setInterval(() => {
        step += Math.random() * 8 + 2;
        if (step >= totalSteps) {
          step = totalSteps;
          clearInterval(this.timer);
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/production/login/login"
            });
          }, 500);
        }
        this.progress = Math.round(step);
        this.updateLoadingText();
      }, intervalTime);
    },
    updateLoadingText() {
      const index = Math.min(Math.floor(this.progress / 25), this.loadingTexts.length - 1);
      this.loadingText = this.loadingTexts[index];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(15, (n, k0, i0) => {
      return {
        a: n,
        b: common_vendor.s($options.getParticleStyle(n))
      };
    }),
    b: $data.progress + "%",
    c: common_vendor.t($data.progress),
    d: common_vendor.t($data.loadingText)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4e2bb972"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/production/splash/splash.js.map
