<template>
	<view class="container">
		<view class="header">
			<text class="title">企业生产管理系统</text>
			<view class="user-info" >
				<text>{{ username }}</text>
			</view>
		</view>
		
		<view class="stats-section">
			<view class="stat-item">
				<text class="stat-value">128</text>
				<text class="stat-label">今日产量</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">98.5%</text>
				<text class="stat-label">合格率</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">24</text>
				<text class="stat-label">在产订单</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">100%</text>
				<text class="stat-label">设备运行</text>
			</view>
		</view>
		
		<view class="menu-section">
			<view class="menu-grid">
				<view class="menu-item" @click="navigateTo('plan')">
					<view class="menu-icon plan">
						<uni-icons custom-prefix="iconfont" type="calendar-filled" size="35" class="profile-icon"></uni-icons>
					</view>
					<text class="menu-text">生产计划</text>
				</view>
				<view class="menu-item" @click="navigateTo('execution')">
					<view class="menu-icon execution">
						<uni-icons custom-prefix="iconfont" type="spinner-cycle" size="35" class="profile-icon"></uni-icons>
					</view>
					<text class="menu-text">工序进度</text>
				</view>
				<view class="menu-item" @click="navigateTo('quality')">
					<view class="menu-icon quality">
						<uni-icons custom-prefix="iconfont" type="arrow-up" size="35" class="profile-icon"></uni-icons>
					</view>
					<text class="menu-text">质量检验</text>
				</view>
				<view class="menu-item" @click="navigateTo('record')">
					<view class="menu-icon record">
						<uni-icons custom-prefix="iconfont" type="more-filled" size="35" class="profile-icon"></uni-icons>
					</view>
					<text class="menu-text">生产记录</text>
				</view>
				<view class="menu-item" @click="navigateTo('inventory')">
					<view class="menu-icon inventory">
						<uni-icons custom-prefix="iconfont" type="bars" size="35" class="profile-icon"></uni-icons>
					</view>
					<text class="menu-text">库存管理</text>
				</view>
				<view class="menu-item" @click="navigateTo('profile')">
					<view class="menu-icon profile">
						<uni-icons custom-prefix="iconfont" type="person-filled" size="35" class="profile-icon"></uni-icons>
					</view>
					<text class="menu-text">个人中心</text>
				</view>
				<view class="menu-item" @click="navigateTo('management')">
					<view class="menu-icon profile">
						<uni-icons custom-prefix="iconfont" type="staff-filled" size="35" class="profile-icon"></uni-icons>
					</view>
					<text class="menu-text">用户管理</text>
				</view>
			</view>
		</view>
		
		<view class="recent-section">
			<view class="section-header">
				<text class="section-title">最近订单</text>
				<text class="more" @click="navigateTo('plans')">查看全部</text>
			</view>
			<view class="order-list">
				<view class="order-item" v-for="(order, index) in recentOrders" :key="index">
					<view class="order-info">
						<text class="order-id">订单#{{ order.id }}</text>
						<text class="order-status" :class="order.status">{{ order.statusText }}</text>
					</view>
					<view class="order-details">
						<text class="product">{{ order.product }}</text>
						<text class="quantity">数量: {{ order.quantity }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			username: '',
			recentOrders: [
				{ id: '1001', product: '产品A', quantity: 500, status: 'processing', statusText: '生产中' },
				{ id: '1002', product: '产品B', quantity: 300, status: 'pending', statusText: '待生产' },
				{ id: '1003', product: '产品C', quantity: 800, status: 'completed', statusText: '已完成' },
				{ id: '1004', product: '产品D', quantity: 200, status: 'quality', statusText: '质检中' }
			]
		};
	},
	onLoad() {
		// 检查登录状态
		this.checkLoginStatus();
	},
	methods: {
		checkLoginStatus() {
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.username = userInfo.username;
			} else {
				// 未登录，跳转到登录页面
				//uni.redirectTo({ url: '/pages/production/login/login' });
			}
		},
		navigateTo(page) {
			uni.navigateTo({
				url: `/pages/production/${page}/${page}`
			});
		}
	}
};
</script>

<style scoped>
@font-face {
	font-family: CustomFont;
	src: url('./iconfont.ttf');
}
.container {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	background-color: #fff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.user-info {
	font-size: 28rpx;
	color: #666;
}

.stats-section {
	display: flex;
	justify-content: space-around;
	background-color: #fff;
	border-radius: 10rpx;
	padding: 30rpx 0;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #007aff;
	margin-bottom: 10rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #666;
}

.menu-section {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.menu-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20rpx;
}

.menu-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 10rpx;
	cursor: pointer;
	transition: all 0.3s;
}

.menu-item:hover {
	background-color: #e8f0fe;
	transform: translateY(-2rpx);
}

.menu-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	margin-bottom: 15rpx;
}

.menu-icon.plan {
	background-color: #bfbdba;
}

.menu-icon.execution {
	background-color: #4cd964;
}

.menu-icon.quality {
	background-color: #ff9500;
}

.menu-icon.equipment {
	background-color: #5856d6;
}

.menu-icon.inventory {
	background-color: #ff2d55;
}

.menu-icon.report {
	background-color: #af52de;
}

.menu-icon.profile {
	background-color: #007aff;
}

.menu-text {
	font-size: 24rpx;
	color: #333;
}

.recent-section {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.more {
	font-size: 24rpx;
	color: #007aff;
	cursor: pointer;
}

.order-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.order-item {
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 8rpx;
	border-left: 5rpx solid #007aff;
}

.order-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.order-id {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.order-status {
	font-size: 24rpx;
	padding: 4rpx 12rpx;
	border-radius: 15rpx;
	font-weight: bold;
}

.order-status.processing {
	background-color: #e8f0fe;
	color: #007aff;
}

.order-status.pending {
	background-color: #f0f0f0;
	color: #8e8e93;
}

.order-status.completed {
	background-color: #e8f8f5;
	color: #4cd964;
}

.order-status.quality {
	background-color: #fff3e0;
	color: #ff9500;
}

.order-details {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.product {
	font-size: 26rpx;
	color: #666;
}

.quantity {
	font-size: 24rpx;
	color: #8e8e93;
}
.profile-icon{
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 8rpx;
}
</style>