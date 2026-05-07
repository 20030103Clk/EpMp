<template>
  <view class="custom-tabbar">
    <view class="tabbar-inner">
      <view 
        v-for="(item, index) in displayTabList" 
        :key="index"
        class="tab-item"
        :class="{ active: currentIndex === index }"
        @click="switchTab(item.pagePath, index)"
      >
        <view class="tab-icon-wrap">
          <image :src="currentIndex === index ? item.selectedIconPath : item.iconPath" mode="aspectFit" class="tab-icon"></image>
        </view>
        <text class="tab-label" :class="{ active: currentIndex === index }">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
Component({
  data: {
    currentIndex: 0,
    tabList: [
      { pagePath: '/pages/production/home/home', text: '首页', iconPath: '/static/home.png', selectedIconPath: '/static/home-active.png' },
      { pagePath: '/pages/production/home-user/home-user', text: '首页', iconPath: '/static/home.png', selectedIconPath: '/static/home-active.png' },
      { pagePath: '/pages/production/report/report', text: '报表', iconPath: '/static/templateHL.png', selectedIconPath: '/static/templateHL.png' },
      { pagePath: '/pages/production/profile/profile', text: '个人', iconPath: '/static/logo.png', selectedIconPath: '/static/logo.png' }
    ],
    displayTabList: []
  },
  attached() {
    this.updateDisplayTabList();
    this.getCurrentPage();
  },
  methods: {
    updateDisplayTabList() {
      const userInfo = uni.getStorageSync('userInfo');
      const isAdmin = userInfo && userInfo.level === 1;
      
      if (isAdmin) {
        this.setData({
          displayTabList: [
            this.tabList[0],
            this.tabList[2],
            this.tabList[3]
          ]
        });
      } else {
        this.setData({
          displayTabList: [
            this.tabList[1],
            this.tabList[2],
            this.tabList[3]
          ]
        });
      }
    },
    getCurrentPage() {
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const currentPath = '/' + currentPage.route;
        
        const userInfo = uni.getStorageSync('userInfo');
        const isAdmin = userInfo && userInfo.level === 1;
        
        let index = 0;
        if (isAdmin) {
          if (currentPath === '/pages/production/home/home') index = 0;
          else if (currentPath === '/pages/production/report/report') index = 1;
          else if (currentPath === '/pages/production/profile/profile') index = 2;
        } else {
          if (currentPath === '/pages/production/home-user/home-user') index = 0;
          else if (currentPath === '/pages/production/report/report') index = 1;
          else if (currentPath === '/pages/production/profile/profile') index = 2;
        }
        this.setData({ currentIndex: index });
      }
    },
    switchTab(pagePath, index) {
      this.setData({ currentIndex: index });
      uni.switchTab({ url: pagePath });
    }
  }
});
</script>

<style>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(120rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.08);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}

.tabbar-inner {
  flex: 1;
  display: flex;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 0;
  flex: 1;
}

.tab-item.active {
  opacity: 1;
}

.tab-item:not(.active) {
  opacity: 0.6;
}

.tab-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8rpx;
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
}

.tab-label {
  font-size: 22rpx;
  color: #95a5a6;
}

.tab-label.active {
  color: #c9a962;
  font-weight: 500;
}
</style>