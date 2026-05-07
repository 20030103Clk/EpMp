<template>
	<view class="container">
		<view class="header">
			<text class="title">最近订单</text>
		</view>
		
		<view class="filter-section">
			<view class="filter-item">
				<text class="filter-label">状态：</text>
				<view class="filter-options">
					<text class="filter-option" :class="{ active: selectedStatus === 'all' }" @click="selectedStatus = 'all'">全部</text>
					<text class="filter-option" :class="{ active: selectedStatus === 'pending' }" @click="selectedStatus = 'pending'">待处理</text>
					<text class="filter-option" :class="{ active: selectedStatus === 'processing' }" @click="selectedStatus = 'processing'">处理中</text>
					<text class="filter-option" :class="{ active: selectedStatus === 'completed' }" @click="selectedStatus = 'completed'">已完成</text>
				</view>
			</view>
			<view class="filter-item">
				<text class="filter-label">时间：</text>
				<view class="filter-options">
					<text class="filter-option" :class="{ active: selectedTime === 'today' }" @click="selectedTime = 'today'">今日</text>
					<text class="filter-option" :class="{ active: selectedTime === 'week' }" @click="selectedTime = 'week'">本周</text>
					<text class="filter-option" :class="{ active: selectedTime === 'month' }" @click="selectedTime = 'month'">本月</text>
					<text class="filter-option" :class="{ active: selectedTime === 'all' }" @click="selectedTime = 'all'">全部</text>
				</view>
			</view>
		</view>
		
		<view class="order-list">
			<view class="order-item" v-for="(order, index) in filteredOrders" :key="index">
				<view class="order-header">
					<text class="order-id">订单#{{ order.id }}</text>
					<text class="order-status" :class="order.status">{{ order.statusText }}</text>
				</view>
				
				<view class="order-content">
					<view class="content-row">
						<text class="label">产品名称：</text>
						<text class="value">{{ order.product }}</text>
					</view>
					<view class="content-row">
						<text class="label">订单数量：</text>
						<text class="value">{{ order.quantity }} 件</text>
					</view>
					<view class="content-row">
						<text class="label">开始时间：</text>
						<text class="value">{{ order.orderDate }}</text>
					</view>
					<view class="content-row">
						<text class="label">结束时间：</text>
						<text class="value">{{ order.deliveryDate }}</text>
					</view>
				</view>
			</view>
			
			<view class="no-orders" v-if="filteredOrders.length === 0">
				<text class="no-orders-text">暂无订单数据</text>
			</view>
		</view>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  plan: {
    getPlans: async (params = {}) => {
      const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
      const response = await uni.request({
        url: `${API_BASE_URL}/plan${queryString ? `?${queryString}` : ''}`,
        method: 'GET'
      });
      return response[1].data;
    }
  }
};
export default {
	data() {
		return {
			selectedStatus: 'all',
			selectedTime: 'week',
			orders: []
		};
	},
	computed: {
		filteredOrders() {
			let filtered = this.orders;
			
			// 按状态筛选
			if (this.selectedStatus !== 'all') {
				filtered = filtered.filter(order => order.status === this.selectedStatus);
			}
			
			// 按时间筛选
			const today = new Date();
			const weekAgo = new Date();
			const monthAgo = new Date();
			weekAgo.setDate(today.getDate() - 7);
			monthAgo.setMonth(today.getMonth() - 1);
			
			switch (this.selectedTime) {
				case 'today':
					filtered = filtered.filter(order => new Date(order.orderDate) >= today.setHours(0, 0, 0, 0));
					break;
				case 'week':
					filtered = filtered.filter(order => new Date(order.orderDate) >= weekAgo);
					break;
				case 'month':
					filtered = filtered.filter(order => new Date(order.orderDate) >= monthAgo);
					break;
			}
			
			// 按订单日期倒序排序
			return filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
		}
	},
	onLoad() {
		this.loadOrders();
	},
	methods: {
		loadOrders() {
			uni.showLoading({ title: '加载中...' });
			api.plan.getPlans().then(res => {
				uni.hideLoading();
				if (res.success) {
					this.orders = res.data.list.map(plan => ({
						id: plan.plan_id,
						product: plan.product,
						quantity: plan.quantity,
						orderDate: plan.start_date,
						deliveryDate: plan.end_date,
						status: plan.status,
						statusText: plan.statusText
					}));
				} else {
					uni.showToast({ title: '加载失败', icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		}
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
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

.filter-section {
	padding: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.filter-item {
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
}

.filter-item:last-child {
	margin-bottom: 0;
}

.filter-label {
	font-size: 28rpx;
	color: #666;
	margin-right: 20rpx;
}

.filter-options {
	display: flex;
	gap: 15rpx;
}

.filter-option {
	padding: 8rpx 16rpx;
	font-size: 24rpx;
	color: #8e8e93;
	background-color: #f0f0f0;
	border-radius: 20rpx;
	cursor: pointer;
	transition: all 0.3s;
}

.filter-option.active {
	background-color: #007aff;
	color: #fff;
}

.order-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.order-item {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.order-id {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.order-status {
	font-size: 24rpx;
	padding: 4rpx 12rpx;
	border-radius: 15rpx;
	font-weight: bold;
}

.order-status.pending {
	background-color: #f0f0f0;
	color: #8e8e93;
}

.order-status.processing {
	background-color: #e8f0fe;
	color: #007aff;
}

.order-status.completed {
	background-color: #e8f8f5;
	color: #4cd964;
}

.order-status.cancelled {
	background-color: #ffebee;
	color: #ff2d55;
}

.order-content {
	margin-bottom: 15rpx;
}

.content-row {
	display: flex;
	margin-bottom: 12rpx;
	align-items: center;
}

.content-row:last-child {
	margin-bottom: 0;
}

.label {
	font-size: 26rpx;
	color: #666;
	width: 150rpx;
}

.value {
	font-size: 26rpx;
	color: #333;
	flex: 1;
}

.order-actions {
	display: flex;
	justify-content: flex-end;
	padding-top: 15rpx;
	border-top: 1rpx solid #f0f0f0;
}

.no-orders {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 40rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	text-align: center;
}

.no-orders-text {
	font-size: 28rpx;
	color: #8e8e93;
}
</style>