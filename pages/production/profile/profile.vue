<template>
	<view class="container">
		<view class="particles">
			<view class="particle" v-for="n in 10" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		<view class="header">
			<view class="header-content">
				<view class="title-section">
					<text class="title">个人中心</text>
					<text class="subtitle">Profile</text>
				</view>
			</view>
		</view>
		
		<view class="user-info-section">
			<view class="user-avatar">
				<text class="avatar-text">{{ username.charAt(0).toUpperCase() }}</text>
			</view>
			<view class="user-details">
				<text class="user-name">{{ username }}</text>
				<text class="user-role">{{ isAdmin ? '管理员' : '普通用户' }}</text>
			</view>
		</view>
		
		<view class="setting-section">
			<text class="section-title">个人设置</text>
			<view class="setting-list">
				<view class="setting-item" @click="editProfile">
					<text class="item-text">编辑资料</text>
					<text class="item-arrow">></text>
				</view>
				<view class="setting-item" @click="changePassword">
					<text class="item-text">修改密码</text>
					<text class="item-arrow">></text>
				</view>
				<view class="setting-item" @click="notificationSettings">
					<text class="item-text">通知设置</text>
					<text class="item-arrow">></text>
				</view>
			</view>
		</view>
		
		<!-- 编辑资料弹出层 -->
		<uni-popup ref="editProfilePopup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">编辑资料</text>
				</view>
				<view class="popup-body">
					<view class="form-item">
						<text class="form-label">用户名</text>
						<input class="form-input" maxlength="20" placeholder="最大输入长度为20" v-model="user" />
					</view>
				</view>
				<view class="popup-footer">
					<button class="popup-btn cancel" @click="close">取消</button>
					<button class="popup-btn confirm" @click="confirmEditProfile">确认修改</button>
				</view>
			</view>
		</uni-popup>
		
		<!-- 修改密码弹出层 -->
		<uni-popup ref="changePasswordPopup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">修改密码</text>
				</view>
				<view class="popup-body">
					<view class="form-item">
						<text class="form-label">旧密码</text>
						<input class="form-input" password type="text" placeholder="请输入旧密码" />
					</view>
					<view class="form-item">
						<text class="form-label">新密码</text>
						<input class="form-input" password type="text" placeholder="请输入新密码" />
					</view>
					<view class="form-item">
						<text class="form-label">确认新密码</text>
						<input class="form-input" password type="text" placeholder="请再次输入新密码" />
					</view>
				</view>
				<view class="popup-footer">
					<button class="popup-btn cancel" @click="close">取消</button>
					<button class="popup-btn confirm" @click="confirmChangePassword">确认修改</button>
				</view>
			</view>
		</uni-popup>
		
		<view class="setting-section">
			<text class="section-title">系统信息</text>
			<view class="setting-list">
				<view class="setting-item" @click="systemVersion">
					<text class="item-text">版本信息</text>
					<text class="item-value">v1.0.0</text>
					<text class="item-arrow" ></text>
				</view>
				<view class="setting-item" @click="checkUpdate">
					<text class="item-text">检查更新</text>
					<text class="item-arrow" ></text>
				</view>
				<view class="setting-item" @click="aboutSystem">
					<text class="item-text">关于我们</text>
					<text class="item-arrow" ></text>
				</view>
			</view>
		</view>
		
		<view class="logout-section">
			<button class="logout-btn" @click="logout">退出登录</button>
		</view>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  user: {
    updateUser: async (id, data) => {
      const response = await uni.request({
        url: `${API_BASE_URL}/user/${id}`,
        method: 'PUT',
        data,
        header: {
          'Content-Type': 'application/json'
        }
      });
      return response[1].data;
    }
  }
};
export default {
	data() {
		return {
			username: '',
			user: ''
		};
	},
	onLoad() {
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo) {
			this.username = userInfo.username;
		} else {
			uni.redirectTo({ url: '/pages/production/login/login' });
		}
	},
	onShow() {
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
		close() {
			this.$refs.changePasswordPopup.close();
			this.$refs.editProfilePopup.close();
		},
		confirmChangePassword() {
			uni.showLoading({ title: '修改中...' });
			// 这里可以添加修改密码的API调用
			api.user.updatePassword({
				oldPassword: '旧密码',
				newPassword: '新密码'
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({ title: '密码修改成功', icon: 'success' });
					this.$refs.changePasswordPopup.close();
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '修改失败', icon: 'none' });
			});
		},
		confirmEditProfile() {
			uni.showLoading({ title: '更新中...' });
			// 这里可以添加更新用户信息的API调用
			const userInfo = uni.getStorageSync('userInfo');
			api.user.updateUser(userInfo.id, {
				name: this.user
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					this.username = this.user;
					uni.setStorageSync('userInfo', { username: this.username, id: userInfo.id });
					uni.showToast({ title: '编辑资料成功', icon: 'success' });
					this.$refs.editProfilePopup.close();
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '更新失败', icon: 'none' });
			});
		},
		// 个人设置
		editProfile() {
			this.$refs.editProfilePopup.open('center');
		},
		changePassword() {
			this.$refs.changePasswordPopup.open('center');
		},
		notificationSettings() {
			uni.showToast({ title: '通知设置功能开发中', icon: 'none' });
		},
		// 系统信息
		systemVersion() {
			uni.showToast({ title: '版本信息功能开发中', icon: 'none' });
		},
		checkUpdate() {
			uni.showToast({ title: '已是最新版本', icon: 'success' });
		},
		aboutSystem() {
			uni.showToast({ title: '欢迎使用生产企业管理系统，我是作者联系方式：13811111111', icon: 'none' });
		},
		// 退出登录
		logout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除用户信息
						uni.removeStorageSync('userInfo');
						uni.showToast({ title: '退出登录成功', icon: 'success' });
						// 跳转到登录页面
						setTimeout(() => {
							uni.redirectTo({ url: '/pages/production/login/login' });
						}, 1500);
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
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
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

.setting-section {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	position: relative;
	z-index: 10;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 16rpx;
}

.setting-list {
	display: flex;
	flex-direction: column;
}

.setting-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 22rpx 0;
	border-bottom: 1rpx solid rgba(201, 169, 98, 0.1);
	cursor: pointer;
	transition: all 0.3s ease;
}

.setting-item:last-child {
	border-bottom: none;
}

.setting-item:active {
	background: rgba(201, 169, 98, 0.05);
}

.item-text {
	font-size: 28rpx;
	color: #2c3e50;
}

.item-value {
	font-size: 26rpx;
	color: #95a5a6;
	margin-right: 12rpx;
}

.item-arrow {
	font-size: 28rpx;
	color: #c9a962;
	font-weight: 500;
}

.user-info-section {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 40rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	display: flex;
	align-items: center;
	gap: 24rpx;
	position: relative;
	z-index: 10;
}

.user-avatar {
	width: 130rpx;
	height: 130rpx;
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 8rpx 24rpx rgba(201, 169, 98, 0.3);
}

.avatar-text {
	font-size: 52rpx;
	color: #fff;
	font-weight: 700;
}

.user-details {
	flex: 1;
}

.user-name {
	font-size: 34rpx;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 8rpx;
	display: block;
}

.user-role {
	font-size: 26rpx;
	color: #c9a962;
	display: block;
	font-weight: 500;
}

.logout-section {
	margin-top: 30rpx;
	padding: 0 20rpx;
	position: relative;
	z-index: 10;
}

.logout-btn {
	width: 100%;
	padding: 24rpx;
	background: rgba(255, 77, 79, 0.9);
	color: #fff;
	border: none;
	border-radius: 16rpx;
	font-size: 30rpx;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 8rpx 20rpx rgba(255, 77, 79, 0.3);
}

.logout-btn:active {
	transform: scale(0.98);
	opacity: 0.9;
}

.popup-content {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 30rpx;
	width: 600rpx;
	max-width: 90vw;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #E5E6EB;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1D2129;
}

.popup-body {
	margin-bottom: 20rpx;
}

.popup-footer {
	display: flex;
	justify-content: flex-end;
}

.popup-btn {
	padding: 16rpx 40rpx;
	background-color: #007AFF;
	color: #FFFFFF;
	border: none;
	border-radius: 8rpx;
	font-size: 28rpx;
	font-weight: 500;
	margin-left: 16rpx;
	cursor: pointer;
	transition: all 0.3s ease;
}

.popup-btn:first-child {
	margin-left: 0;
}

.popup-btn.cancel {
	background-color: #F5F6F7;
	color: #4E5969;
}

.popup-btn.confirm {
	background-color: #007AFF;
	color: #FFFFFF;
}

.form-item {
	display: flex;
	flex-direction: column;
	margin-bottom: 24rpx;
}

.form-item:last-child {
	margin-bottom: 0;
}

.form-label {
	font-size: 26rpx;
	color: #86909C;
	margin-bottom: 12rpx;
}

.form-input {
	width: 100%;
	padding: 16rpx;
	border: 1rpx solid #E5E6EB;
	border-radius: 8rpx;
	font-size: 28rpx;
	color: #1D2129;
	box-sizing: border-box;
	background-color: #FFFFFF;
}

</style>