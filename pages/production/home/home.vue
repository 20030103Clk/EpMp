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
				<view class="menu-item" @click="navigateTo('management')" v-if="isAdmin">
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
				<text class="more" @click="navigateTo('plan')">查看全部</text>
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
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  plan: {
    getPlans: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/plan${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
        console.log('Get plans API response:', response);
        // 检查响应格式
        if (response && (response[1] || response.data)) {
          // 处理不同格式的响应
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        console.error('Get plans error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    }
  },
  record: {
    getRecords: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/record${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
        console.log('Get records API response:', response);
        // 检查响应格式
        if (response && (response[1] || response.data)) {
          // 处理不同格式的响应
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        console.error('Get records error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    }
  }
};
export default {
	data() {
		return {
			recentOrders: []
		};
	},
	computed: {
		username() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo ? userInfo.username : '未登录';
		},
		isAdmin() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo && userInfo.level === 1;
		}
	},
	onLoad() {
		// 加载数据
		this.loadData();
	},
	onShow() {
		// 每次页面显示时重新加载数据，确保删除计划后能更新显示
		this.loadData();
	},
	methods: {
		checkLoginStatus() {
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				uni.redirectTo({ url: '/pages/production/login/login' });
			}
		},
		loadData() {
			// 加载最近订单
			this.loadRecentOrders();
			// 加载统计数据
			this.loadStats();
		},
		// 加载最近订单
		loadRecentOrders() {
			api.plan.getPlans({ page: 1, pageSize: 4 }).then(res => {
				if (res.success) {
					this.recentOrders = res.data.list.map(plan => ({
						id: plan.plan_id,
						product: plan.product,
						quantity: plan.quantity,
						status: plan.status,
						statusText: plan.statusText
					}));
				}
			});
		},
		// 加载统计数据
		loadStats() {
			// 这里可以根据需要调用不同的API获取统计数据
			// 今日产量
			api.record.getRecords({ date: new Date().toISOString().split('T')[0] }).then(res => {
				if (res.success) {
					const totalOutput = res.data.list.reduce((sum, record) => sum + record.output, 0);
					// 更新今日产量
					// this.stats.todayOutput = totalOutput;
				}
			});
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