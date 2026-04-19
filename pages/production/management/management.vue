<template>
	<view class="container">
		<view class="header">
			<text class="title">用户管理</text>
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

			.user-level.admin {
				background-color: #e8f8f5;
				color: #4cd964;
			}

			.user-level.normal {
				background-color: #e3f2fd;
				color: #2196f3;
			}

.user-actions {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex-wrap: wrap;
	gap: 15rpx;
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

.delete-btn {
	padding: 8rpx 20rpx;
	background-color: #ff2d55;
	color: #fff;
	border: none;
	border-radius: 8rpx;
	font-size: 24rpx;
	margin-left: 20rpx;
}

.empty-tip {
	text-align: center;
	padding: 40rpx 0;
	color: #999;
	font-size: 24rpx;
}

.no-permission {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 40rpx;
}

.no-permission-text {
	font-size: 32rpx;
	color: #ff4444;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.no-permission-hint {
	font-size: 26rpx;
	color: #999;
}
</style>