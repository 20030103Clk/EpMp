<template>
	<view class="custom-tabbar">
		<view class="tabbar-wrapper">
			<view class="tabbar-item" v-for="(item, index) in tabList" :key="index" @click="switchTab(item.pagePath)">
				<view class="icon-wrapper">
					<image :src="currentIndex === index ? item.selectedIconPath : item.iconPath" mode="aspectFit" class="tab-icon"></image>
				</view>
				<text class="tab-text" :class="{ active: currentIndex === index }">{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CustomTabbar',
	data() {
		return {
			currentIndex: 0
		};
	},
	computed: {
		tabList() {
			const userInfo = uni.getStorageSync('userInfo');
			const homePath = userInfo && userInfo.level === 1 
				? '/pages/production/home/home' 
				: '/pages/production/home-user/home-user';
			return [
				{
					pagePath: homePath,
					text: '首页',
					iconPath: '/static/home.png',
					selectedIconPath: '/static/home-active.png'
				},
				{
					pagePath: '/pages/production/report/report',
					text: '生产报表',
					iconPath: '/static/templateHL.png',
					selectedIconPath: '/static/templateHL.png'
				},
				{
					pagePath: '/pages/production/profile/profile',
					text: '个人中心',
					iconPath: '/static/logo.png',
					selectedIconPath: '/static/logo.png'
				}
			];
		}
	},
	mounted() {
		this.getCurrentPage();
	},
	onShow() {
		this.getCurrentPage();
	},
	methods: {
		getCurrentPage() {
			const pages = getCurrentPages();
			if (pages.length > 0) {
				const currentPage = pages[pages.length - 1];
				const route = '/' + currentPage.route;
				console.log('Current route:', route);
				console.log('Tab list:', this.tabList);
				const index = this.tabList.findIndex(item => item.pagePath === route);
				console.log('Current index:', index);
				if (index !== -1) {
					this.currentIndex = index;
				}
			}
		},
		switchTab(pagePath) {
			uni.switchTab({ url: pagePath });
		}
	}
};
</script>

<style scoped>
.custom-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-top: 1rpx solid rgba(0, 0, 0, 0.08);
	padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}

.tabbar-wrapper {
	display: flex;
	padding: 16rpx 0;
}

.tabbar-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	transition: all 0.3s ease;
}

.tabbar-item:active {
	opacity: 0.7;
}

.icon-wrapper {
	width: 48rpx;
	height: 48rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.tab-icon {
	width: 100%;
	height: 100%;
}

.tab-text {
	font-size: 22rpx;
	color: #95a5a6;
	transition: color 0.3s ease;
}

.tab-text.active {
	color: #c9a962;
	font-weight: 500;
}
</style>