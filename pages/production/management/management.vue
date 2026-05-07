<template>
	<view class="container">
		<view class="particles">
			<view class="particle" v-for="n in 10" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		<view class="header">
			<view class="header-content">
				<view class="title-section">
					<text class="title">用户管理</text>
					<text class="subtitle">User Management</text>
				</view>
			</view>
		</view>
		
		<view class="user-section" v-if="isAdmin">
			<view class="section-header">
				<text class="section-title">用户列表</text>
			</view>
			
			<view class="user-list">
				<view class="user-item" v-for="(user, index) in users" :key="index">
					<view class="user-info">
						<text class="user-name">{{ user.name }}</text>
						<text class="user-level" :class="user.level === 1 ? 'admin' : 'normal'">[{{ user.level === 1 ? '管理员' : '普通用户' }}]</text>
					</view>
					
					<view class="user-actions" v-if="isAdmin">
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
						<button class="delete-btn" @click="deleteUser(index)">删除</button>
					</view>
				</view>
				
				<view class="empty-tip" v-if="users.length === 0">
					<text>暂无用户数据</text>
				</view>
			</view>
		</view>
		
		<view class="no-permission" v-else>
			<text class="no-permission-text">您没有权限访问此页面</text>
			<text class="no-permission-hint">请联系管理员获取权限</text>
		</view>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  user: {
    getUsers: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/user${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
        console.log('Get users API response:', response);
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
        console.error('Get users error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    },
    updateUser: async (id, data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/user/${id}`,
          method: 'PUT',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Update user API response:', response);
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
        console.error('Update user error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    },
    deleteUser: async (id) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/user/${id}`,
          method: 'DELETE'
        });
        console.log('Delete user API response:', response);
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
        console.error('Delete user error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    }
  }
};
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
	computed: {
		isAdmin() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo && userInfo.level === 1;
		}
	},
	methods: {
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
		loadUsers() {
			uni.showLoading({ title: '加载中...' });
			api.user.getUsers().then(res => {
				uni.hideLoading();
				if (res.success) {
					this.users = res.data.list.map(user => ({
						id: user.id,
						name: user.name,
						level: user.remark || 0
					}));
				} else {
					uni.showToast({ title: '加载失败', icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		},
		onLevelChange(e, index) {
			const newLevel = parseInt(e.detail.value);
			const user = this.users[index];
			
			uni.showLoading({ title: '更新中...' });
			api.user.updateUser(user.id, {
				remark: newLevel
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					// 更新用户级别
					this.users[index].level = newLevel;
					// 显示提示
					uni.showToast({
						title: '用户级别已更新',
						icon: 'success'
					});
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '更新失败', icon: 'none' });
			});
		},
		deleteUser(index) {
			const user = this.users[index];
			uni.showModal({
				title: '删除用户',
				content: `确定要删除用户"${user.name}"吗？`,
				confirmText: '删除',
				confirmColor: '#ff2d55',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '删除中...' });
						api.user.deleteUser(user.id).then(res => {
							uni.hideLoading();
							if (res.success) {
								this.users.splice(index, 1);
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
							} else {
								uni.showToast({ title: res.message, icon: 'none' });
							}
						}).catch(error => {
							uni.hideLoading();
							uni.showToast({ title: '删除失败', icon: 'none' });
						});
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.container {
	padding: 20rpx;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #d4d8dc 100%);
	min-height: 100vh;
	position: relative;
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
	opacity: 0.4;
	animation: float linear infinite;
}

@keyframes float {
	0% {
		transform: translateY(100vh) rotate(0deg);
		opacity: 0;
	}
	10% {
		opacity: 0.4;
	}
	90% {
		opacity: 0.4;
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
	margin-top: 4rpx;
}

.user-section {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	position: relative;
	z-index: 10;
}

.section-header {
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2c3e50;
}

.user-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.user-item {
	background: rgba(248, 249, 250, 0.9);
	border-radius: 16rpx;
	padding: 20rpx;
	border: 1rpx solid rgba(201, 169, 98, 0.1);
	transition: all 0.3s ease;
}

.user-item:active {
	background: rgba(201, 169, 98, 0.08);
}

.user-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
	padding-bottom: 16rpx;
	border-bottom: 1rpx solid rgba(201, 169, 98, 0.1);
}

.user-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
}

.user-level {
	font-size: 24rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	font-weight: 500;
}

.user-level.admin {
	background: rgba(76, 217, 100, 0.15);
	color: #4cd964;
}

.user-level.normal {
	background: rgba(201, 169, 98, 0.15);
	color: #c9a962;
}

.user-actions {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex-wrap: wrap;
	gap: 16rpx;
}

.level-selector {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.selector-label {
	font-size: 26rpx;
	color: #6c757d;
	font-weight: 500;
}

.radio-group {
	display: flex;
	gap: 30rpx;
}

.radio-item {
	display: flex;
	align-items: center;
	gap: 10rpx;
	font-size: 26rpx;
	color: #2c3e50;
}

.delete-btn {
	padding: 12rpx 28rpx;
	background: rgba(255, 77, 79, 0.9);
	color: #fff;
	border: none;
	border-radius: 12rpx;
	font-size: 26rpx;
	box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.3);
	transition: all 0.3s ease;
}

.delete-btn:active {
	transform: scale(0.96);
}

.empty-tip {
	text-align: center;
	padding: 60rpx 0;
	color: #95a5a6;
	font-size: 28rpx;
}

.no-permission {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 40rpx;
	position: relative;
	z-index: 10;
}

.no-permission-text {
	font-size: 32rpx;
	color: #ff6b6b;
	font-weight: 600;
	margin-bottom: 20rpx;
}

.no-permission-hint {
	font-size: 28rpx;
	color: #95a5a6;
}

</style>