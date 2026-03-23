<template>
	<view class="container">
		<view class="header">
			<text class="title">用户管理</text>
		</view>
		
		<view class="user-section">
			<view class="section-header">
				<text class="section-title">用户列表</text>
			</view>
			
			<view class="user-list">
				<view class="user-item" v-for="(user, index) in users" :key="index">
					<view class="user-info">
						<text class="user-name">{{ user.name }}</text>
						<text class="user-level">{{ user.level === 1 ? '管理员' : '普通用户' }}</text>
					</view>
					
					<view class="user-actions">
						<view class="level-selector">
							<text class="selector-label">用户级别：</text>
							<radio-group :value="user.level.toString()" @change="(e) => onLevelChange(e, index)">
								<label class="radio-item">
									<radio value="0" /> 普通用户
								</label>
								<label class="radio-item">
									<radio value="1" /> 管理员
								</label>
							</radio-group>
						</view>
					</view>
				</view>
				
				<view class="empty-tip" v-if="users.length === 0">
					<text>暂无用户数据</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			users: [],
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
			// 从本地存储加载所有用户
			const users = uni.getStorageSync('users') || [];
			this.users = users;
		},
		onLevelChange(e, index) {
			const newLevel = parseInt(e.detail.value);
			// 更新用户级别
			this.users[index].level = newLevel;
			// 保存到本地存储
			uni.setStorageSync('users', this.users);
			// 显示提示
			uni.showToast({
				title: '用户级别已更新',
				icon: 'success'
			});
		}
	}
};
</script>

<style scoped>
.container {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
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

.user-section {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-header {
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.user-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.user-item {
	background-color: #f9f9f9;
	border-radius: 8rpx;
	padding: 20rpx;
}

.user-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.user-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.user-level {
	font-size: 24rpx;
	padding: 4rpx 12rpx;
	border-radius: 15rpx;
	font-weight: bold;
}

.user-level::before {
	content: '[';
}

.user-level::after {
	content: ']';
}

.user-item:nth-child(odd) .user-level {
	background-color: #e8f8f5;
	color: #4cd964;
}

.user-item:nth-child(even) .user-level {
	background-color: #e3f2fd;
	color: #2196f3;
}

.user-actions {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.level-selector {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.selector-label {
	font-size: 24rpx;
	color: #666;
}

.radio-group {
	display: flex;
	gap: 30rpx;
}

.radio-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
	font-size: 24rpx;
	color: #333;
}

.empty-tip {
	text-align: center;
	padding: 40rpx 0;
	color: #999;
	font-size: 24rpx;
}
</style>