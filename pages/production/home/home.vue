<template>
	<view class="container">
		<view class="particles">
			<view class="particle" v-for="n in 15" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		
		<template v-if="isAdmin">
			<view class="header">
				<view class="header-content">
					<view class="logo-section">
						<view class="logo-icon">
							<text class="logo-text">E</text>
						</view>
						<view class="title-section">
							<text class="title">企业生产管理系统</text>
							<text class="subtitle">Enterprise Production Management</text>
						</view>
					</view>
					<view class="user-info">
						<view class="user-avatar">
							<text class="avatar-text">{{ username.charAt(0) }}</text>
						</view>
						<text class="username">{{ username }}</text>
					</view>
				</view>
			</view>
			
			<view class="stats-section">
				<view class="stat-card">
					<view class="stat-icon production">
						<uni-icons type="trending-up" size="28"></uni-icons>
					</view>
					<view class="stat-content">
						<text class="stat-value">128</text>
						<text class="stat-label">今日产量</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon quality">
						<uni-icons type="check-circle" size="28"></uni-icons>
					</view>
					<view class="stat-content">
						<text class="stat-value">98.5%</text>
						<text class="stat-label">合格率</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon order">
						<uni-icons type="list" size="28"></uni-icons>
					</view>
					<view class="stat-content">
						<text class="stat-value">24</text>
						<text class="stat-label">在产订单</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon equipment">
						<uni-icons type="settings" size="28"></uni-icons>
					</view>
					<view class="stat-content">
						<text class="stat-value">100%</text>
						<text class="stat-label">设备运行</text>
					</view>
				</view>
			</view>
			
			<view class="menu-section">
				<view class="section-header">
					<text class="section-title">功能菜单</text>
				</view>
				<view class="menu-grid">
					<view class="menu-item" @click="navigateTo('plan')">
						<view class="menu-icon-wrapper">
							<uni-icons custom-prefix="iconfont" type="calendar-filled" size="40" class="menu-icon"></uni-icons>
						</view>
						<text class="menu-text">生产计划</text>
					</view>
					<view class="menu-item" @click="navigateTo('execution')">
						<view class="menu-icon-wrapper execution">
							<uni-icons custom-prefix="iconfont" type="spinner-cycle" size="40" class="menu-icon"></uni-icons>
						</view>
						<text class="menu-text">工序进度</text>
					</view>
					<view class="menu-item" @click="navigateTo('quality')">
						<view class="menu-icon-wrapper quality">
							<uni-icons custom-prefix="iconfont" type="arrow-up" size="40" class="menu-icon"></uni-icons>
						</view>
						<text class="menu-text">质量检验</text>
					</view>
					<view class="menu-item" @click="navigateTo('record')">
						<view class="menu-icon-wrapper record">
							<uni-icons custom-prefix="iconfont" type="more-filled" size="40" class="menu-icon"></uni-icons>
						</view>
						<text class="menu-text">生产记录</text>
					</view>
					<view class="menu-item" @click="navigateTo('inventory')">
						<view class="menu-icon-wrapper inventory">
							<uni-icons custom-prefix="iconfont" type="bars" size="40" class="menu-icon"></uni-icons>
						</view>
						<text class="menu-text">库存管理</text>
					</view>
					<view class="menu-item" @click="navigateTo('management')">
						<view class="menu-icon-wrapper management">
							<uni-icons custom-prefix="iconfont" type="staff-filled" size="40" class="menu-icon"></uni-icons>
						</view>
						<text class="menu-text">用户管理</text>
					</view>
					<view class="menu-item" @click="navigateTo('equipment')">
						<view class="menu-icon-wrapper equipment">
							<uni-icons custom-prefix="iconfont" type="settings" size="40" class="menu-icon"></uni-icons>
						</view>
						<text class="menu-text">设备管理</text>
					</view>
				</view>
			</view>
			
			<view class="recent-section">
				<view class="section-header">
					<text class="section-title">最近订单</text>
					<text class="more" @click="navigateTo('plan')">查看全部</text>
				</view>
				<view class="order-list">
					<view class="order-card" v-for="(order, index) in recentOrders" :key="index">
						<view class="order-info">
							<view class="order-id-wrapper">
								<uni-icons type="file-text" size="20" class="order-icon"></uni-icons>
								<text class="order-id">订单#{{ order.id }}</text>
							</view>
							<view class="order-status" :class="order.status">
								<view class="status-dot"></view>
								<text>{{ order.statusText }}</text>
							</view>
						</view>
						<view class="order-details">
							<text class="product">{{ order.product }}</text>
							<text class="quantity">数量: {{ order.quantity }}</text>
						</view>
					</view>
				</view>
			</view>
		</template>
		
		<template v-else>
			<view class="user-header">
				<view class="user-greeting">
					<text class="greeting-text">您好，{{ username }}</text>
					<text class="date-text">{{ currentDate }}</text>
				</view>
				<view class="user-avatar-big">
					<text class="avatar-text-big">{{ username.charAt(0) }}</text>
				</view>
			</view>
			
			<view class="user-banner">
				<view class="banner-content">
					<view class="banner-icon">
						<uni-icons type="trending-up" size="48"></uni-icons>
					</view>
					<view class="banner-text">
						<text class="banner-title">今日任务</text>
						<text class="banner-subtitle">已完成 42 项任务，完成率 98.5%</text>
					</view>
				</view>
			</view>
			
			<view class="user-quick-section">
				<view class="quick-card" @click="navigateTo('plan')">
					<view class="quick-icon-wrapper plan">
						<uni-icons custom-prefix="iconfont" type="calendar-filled" size="36"></uni-icons>
					</view>
					<view class="quick-info">
						<text class="quick-title">生产计划</text>
						<text class="quick-desc">查看生产任务</text>
					</view>
					<uni-icons type="chevron-right" size="32" class="quick-arrow"></uni-icons>
				</view>
				<view class="quick-card" @click="navigateTo('execution')">
					<view class="quick-icon-wrapper execution">
						<uni-icons custom-prefix="iconfont" type="spinner-cycle" size="36"></uni-icons>
					</view>
					<view class="quick-info">
						<text class="quick-title">工序进度</text>
						<text class="quick-desc">追踪生产流程</text>
					</view>
					<uni-icons type="chevron-right" size="32" class="quick-arrow"></uni-icons>
				</view>
			</view>
			
			<view class="user-stats-section">
				<view class="user-stat-card">
					<text class="user-stat-value">42</text>
					<text class="user-stat-label">完成任务</text>
				</view>
				<view class="user-stat-card">
					<text class="user-stat-value">98.5%</text>
					<text class="user-stat-label">完成率</text>
				</view>
			</view>
			
			<view class="user-more-section">
				<view class="section-header">
					<text class="section-title">更多功能</text>
				</view>
				<view class="more-list">
					<view class="more-item" @click="navigateTo('quality')">
						<view class="more-icon-wrapper">
							<uni-icons custom-prefix="iconfont" type="arrow-up" size="32"></uni-icons>
						</view>
						<text class="more-text">质量检验</text>
						<uni-icons type="chevron-right" size="28" class="more-arrow"></uni-icons>
					</view>
					<view class="more-item" @click="navigateTo('record')">
						<view class="more-icon-wrapper record">
							<uni-icons custom-prefix="iconfont" type="more-filled" size="32"></uni-icons>
						</view>
						<text class="more-text">生产记录</text>
						<uni-icons type="chevron-right" size="28" class="more-arrow"></uni-icons>
					</view>
				</view>
			</view>
			
			<view class="user-task-section">
				<view class="section-header">
					<text class="section-title">最近任务</text>
					<text class="more" @click="navigateTo('plan')">全部</text>
				</view>
				<view class="task-list">
					<view class="task-card" v-for="(order, index) in recentOrders" :key="index">
						<view class="task-info">
							<text class="task-name">{{ order.product }}</text>
							<text class="task-id">任务#{{ order.id }}</text>
						</view>
						<view class="task-status" :class="order.status">
							{{ order.statusText }}
						</view>
						<text class="task-quantity">{{ order.quantity }} 件</text>
					</view>
				</view>
			</view>
		</template>
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
		},
		currentDate() {
			const now = new Date();
			const month = now.getMonth() + 1;
			const day = now.getDate();
			return `${month}月${day}日`;
		}
	},
	onLoad() {
		this.loadData();
		this.refreshUserInfo();
	},
	onShow() {
		this.loadData();
		this.refreshUserInfo();
	},
	methods: {
		refreshUserInfo() {
			this.$forceUpdate();
		},
		checkUserLevel() {
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo) {
				uni.redirectTo({ url: '/pages/production/login/login' });
			}
		},
		refreshTabBar() {
			if (typeof this.$mp.page.getTabBar === 'function') {
				const tabBar = this.$mp.page.getTabBar();
				if (tabBar && tabBar.updateTabList) {
					tabBar.updateTabList();
				}
			}
		},
		getParticleStyle(n) {
			const colors = ['#c9a962', '#d4b896', '#c5a788', '#d4c4a8', '#bfbdba'];
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
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #d4d8dc 100%);
	min-height: 100vh;
	position: relative;
}

.user-header {
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	border-radius: 0 0 32rpx 32rpx;
	padding: 60rpx 32rpx 40rpx;
	margin: -20rpx -20rpx 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	position: relative;
	z-index: 10;
}

.user-greeting {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.greeting-text {
	font-size: 40rpx;
	font-weight: 700;
	color: #fff;
}

.date-text {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.8);
}

.user-avatar-big {
	width: 88rpx;
	height: 88rpx;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	cursor: pointer;
}

.avatar-text-big {
	font-size: 36rpx;
	color: #c9a962;
	font-weight: 700;
}

.user-banner {
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20px);
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	position: relative;
	z-index: 10;
}

.banner-content {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.banner-icon {
	width: 96rpx;
	height: 96rpx;
	background: linear-gradient(135deg, rgba(201, 169, 98, 0.2) 0%, rgba(212, 184, 150, 0.2) 100%);
	border-radius: 24rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #c9a962;
}

.banner-text {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.banner-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2c3e50;
}

.banner-subtitle {
	font-size: 26rpx;
	color: #6c757d;
}

.user-quick-section {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	margin-bottom: 24rpx;
	position: relative;
	z-index: 10;
}

.quick-card {
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
	cursor: pointer;
	transition: all 0.3s ease;
}

.quick-card:active {
	background: rgba(201, 169, 98, 0.08);
}

.quick-icon-wrapper {
	width: 72rpx;
	height: 72rpx;
	background: linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(212, 184, 150, 0.15) 100%);
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.quick-icon-wrapper.plan {
	color: #c9a962;
}

.quick-icon-wrapper.execution {
	background: linear-gradient(135deg, rgba(76, 217, 100, 0.15) 0%, rgba(142, 230, 173, 0.15) 100%);
	color: #4cd964;
}

.quick-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.quick-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #2c3e50;
}

.quick-desc {
	font-size: 24rpx;
	color: #95a5a6;
}

.quick-arrow {
	color: #c9a962;
}

.user-stats-section {
	display: flex;
	gap: 20rpx;
	margin-bottom: 24rpx;
	position: relative;
	z-index: 10;
}

.user-stat-card {
	flex: 1;
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 28rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.user-stat-value {
	font-size: 48rpx;
	font-weight: 700;
	color: #c9a962;
}

.user-stat-label {
	font-size: 24rpx;
	color: #6c757d;
}

.user-more-section {
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 28rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 10;
}

.more-list {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.more-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 24rpx 0;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
	cursor: pointer;
}

.more-item:last-child {
	border-bottom: none;
}

.more-item:active {
	background: rgba(201, 169, 98, 0.05);
}

.more-icon-wrapper {
	width: 64rpx;
	height: 64rpx;
	background: linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(212, 184, 150, 0.15) 100%);
	border-radius: 16rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #c9a962;
}

.more-icon-wrapper.record {
	background: linear-gradient(135deg, rgba(175, 82, 222, 0.15) 0%, rgba(212, 158, 255, 0.15) 100%);
	color: #af52de;
}

.more-text {
	flex: 1;
	font-size: 28rpx;
	color: #2c3e50;
}

.more-arrow {
	color: #c9a962;
}

.user-task-section {
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 10;
}

.task-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.task-card {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx;
	background: rgba(248, 249, 250, 0.8);
	border-radius: 16rpx;
	border-left: 6rpx solid #c9a962;
}

.task-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.task-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
}

.task-id {
	font-size: 24rpx;
	color: #95a5a6;
}

.task-status {
	padding: 8rpx 16rpx;
	border-radius: 16rpx;
	font-size: 22rpx;
	font-weight: 500;
}

.task-status.processing {
	background: rgba(0, 122, 255, 0.1);
	color: #007aff;
}

.task-status.completed {
	background: rgba(76, 217, 100, 0.1);
	color: #4cd964;
}

.task-status.pending {
	background: rgba(142, 142, 147, 0.1);
	color: #8e8e93;
}

.task-quantity {
	font-size: 24rpx;
	color: #6c757d;
}

.role {
	font-size: 22rpx;
	color: #c9a962;
	font-weight: 500;
}

.particles {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 1;
}

.particle {
	position: absolute;
	border-radius: 50%;
	opacity: 0.5;
	animation: float linear infinite;
}

@keyframes float {
	0% {
		transform: translateY(100vh) rotate(0deg);
		opacity: 0;
	}
	10% {
		opacity: 0.5;
	}
	90% {
		opacity: 0.5;
	}
	100% {
		transform: translateY(-10vh) rotate(360deg);
		opacity: 0;
	}
}

.header {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	position: relative;
	z-index: 10;
}

.header-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.logo-section {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.logo-icon {
	width: 72rpx;
	height: 72rpx;
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4rpx 16rpx rgba(201, 169, 98, 0.3);
}

.logo-icon .logo-text {
	font-size: 36rpx;
	color: #fff;
	font-weight: 700;
}

.title-section {
	display: flex;
	flex-direction: column;
}

.title {
	font-size: 36rpx;
	font-weight: 700;
	color: #2c3e50;
}

.subtitle {
	font-size: 20rpx;
	color: #95a5a6;
	letter-spacing: 1rpx;
}

.user-info {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
}

.user-avatar {
	width: 64rpx;
	height: 64rpx;
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(201, 169, 98, 0.3);
}

.avatar-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: 600;
}

.username {
	font-size: 24rpx;
	color: #6c757d;
}

.stats-section {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
	margin-bottom: 24rpx;
	position: relative;
	z-index: 10;
}

.stat-card {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 28rpx;
	display: flex;
	align-items: center;
	gap: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	transition: all 0.3s ease;
}

.stat-card:active {
	transform: scale(0.98);
}

.stat-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.stat-icon.production {
	background: linear-gradient(135deg, rgba(201, 169, 98, 0.2) 0%, rgba(212, 184, 150, 0.2) 100%);
	color: #c9a962;
}

.stat-icon.quality {
	background: linear-gradient(135deg, rgba(76, 217, 100, 0.2) 0%, rgba(142, 230, 173, 0.2) 100%);
	color: #4cd964;
}

.stat-icon.order {
	background: linear-gradient(135deg, rgba(0, 122, 255, 0.2) 0%, rgba(100, 181, 246, 0.2) 100%);
	color: #007aff;
}

.stat-icon.equipment {
	background: linear-gradient(135deg, rgba(88, 86, 214, 0.2) 0%, rgba(111, 97, 255, 0.2) 100%);
	color: #5856d6;
}

.stat-content {
	display: flex;
	flex-direction: column;
}

.stat-value {
	font-size: 44rpx;
	font-weight: 700;
	color: #2c3e50;
}

.stat-label {
	font-size: 24rpx;
	color: #95a5a6;
	margin-top: 4rpx;
}

.menu-section {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 28rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	position: relative;
	z-index: 10;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2c3e50;
}

.more {
	font-size: 24rpx;
	color: #c9a962;
	cursor: pointer;
	font-weight: 500;
}

.menu-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24rpx;
}

.menu-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 28rpx 16rpx;
	background: rgba(250, 250, 250, 0.8);
	border-radius: 16rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 1rpx solid rgba(201, 169, 98, 0.1);
}

.menu-item:active {
	transform: translateY(-4rpx);
	background: rgba(201, 169, 98, 0.08);
	border-color: rgba(201, 169, 98, 0.3);
}

.menu-icon-wrapper {
	width: 88rpx;
	height: 88rpx;
	background: linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(212, 184, 150, 0.15) 100%);
	border-radius: 24rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 16rpx;
}

.menu-icon-wrapper.execution {
	background: linear-gradient(135deg, rgba(76, 217, 100, 0.15) 0%, rgba(142, 230, 173, 0.15) 100%);
}

.menu-icon-wrapper.quality {
	background: linear-gradient(135deg, rgba(255, 149, 0, 0.15) 0%, rgba(255, 191, 128, 0.15) 100%);
}

.menu-icon-wrapper.record {
	background: linear-gradient(135deg, rgba(175, 82, 222, 0.15) 0%, rgba(212, 158, 255, 0.15) 100%);
}

.menu-icon-wrapper.inventory {
	background: linear-gradient(135deg, rgba(255, 45, 85, 0.15) 0%, rgba(255, 114, 144, 0.15) 100%);
}

.menu-icon-wrapper.management {
	background: linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(100, 181, 246, 0.15) 100%);
}

.menu-icon-wrapper.equipment {
	background: linear-gradient(135deg, rgba(88, 86, 214, 0.15) 0%, rgba(111, 97, 255, 0.15) 100%);
}

.menu-icon {
	color: #6c757d;
}

.menu-icon-wrapper.execution .menu-icon { color: #4cd964; }
.menu-icon-wrapper.quality .menu-icon { color: #ff9500; }
.menu-icon-wrapper.record .menu-icon { color: #af52de; }
.menu-icon-wrapper.inventory .menu-icon { color: #ff2d55; }
.menu-icon-wrapper.management .menu-icon { color: #007aff; }
.menu-icon-wrapper.equipment .menu-icon { color: #5856d6; }

.menu-text {
	font-size: 26rpx;
	color: #495057;
	font-weight: 500;
}

.recent-section {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	position: relative;
	z-index: 10;
}

.order-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.order-card {
	padding: 24rpx;
	background: rgba(248, 249, 250, 0.8);
	border-radius: 16rpx;
	border-left: 6rpx solid #c9a962;
	transition: all 0.3s ease;
}

.order-card:active {
	background: rgba(201, 169, 98, 0.08);
}

.order-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.order-id-wrapper {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.order-icon {
	color: #c9a962;
}

.order-id {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
}

.order-status {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
}

.status-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
}

.order-status.processing {
	background: rgba(0, 122, 255, 0.1);
	color: #007aff;
}

.order-status.processing .status-dot { background: #007aff; }

.order-status.pending {
	background: rgba(142, 142, 147, 0.1);
	color: #8e8e93;
}

.order-status.pending .status-dot { background: #8e8e93; }

.order-status.completed {
	background: rgba(76, 217, 100, 0.1);
	color: #4cd964;
}

.order-status.completed .status-dot { background: #4cd964; }

.order-status.quality {
	background: rgba(255, 149, 0, 0.1);
	color: #ff9500;
}

.order-status.quality .status-dot { background: #ff9500; }

.order-details {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.product {
	font-size: 26rpx;
	color: #6c757d;
}

.quantity {
	font-size: 24rpx;
	color: #95a5a6;
}
</style>