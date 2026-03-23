<template>
	<view class="container">
		<view class="header">
			<text class="title">个人中心</text>
		</view>
		
		<view class="user-info-section">
			<view class="user-avatar">
				<text class="avatar-text">{{ username.charAt(0).toUpperCase() }}</text>
			</view>
			<view class="user-details">
				<text class="user-name">{{ username }}</text>
				<text class="user-role">管理员</text>
			</view>
		</view>
		
		<view class="setting-section">
			<text class="section-title">个人设置</text>
			<view class="setting-list">
				<view class="setting-item" @click="editProfile">
					<text class="item-text">编辑资料</text>
					<uni-popup ref="editProfilePopup" :mask-click="false" background="rgba(0, 0, 0, 0.6)">
						<view class="popup-content">
						<uni-icons type="clear" size="30" @click="close" class="icon-left" ></uni-icons>
						<view class="uni-form-item uni-column">
							<view class="title">用户名</view>
								<input class="uni-input" maxlength="20" placeholder="最大输入长度为20" v-model="user" />
						</view>
						<button class="change-password-btn" @click="confirmEditProfile">确认修改</button>
						</view>
					</uni-popup>
				</view>
				<view class="setting-item" @click="changePassword">
					<text class="item-text">修改密码</text>
					<uni-popup ref="changePasswordPopup" :mask-click="false" background="rgba(0, 0, 0, 0.6)">
						<view class="popup-content">
							<uni-icons type="clear" size="30" @click="close" class="icon-left" ></uni-icons>
							<view class="uni-form-item uni-column">
								<view class="title">旧密码</view>
								<input class="uni-input" password type="text" placeholder="旧密码" />
							</view>
							<view class="uni-form-item uni-column">
								<view class="title">新密码</view>
								<input class="uni-input" password type="text" placeholder="新密码" />
							</view>
							<view class="uni-form-item uni-column">
								<view class="title">确认新密码</view>
								<input class="uni-input" password type="text" placeholder="确认新密码" />
							</view>
							<button class="change-password-btn" @click="confirmChangePassword">确认修改</button>
						</view>
					</uni-popup>
				</view>
				<view class="setting-item" @click="notificationSettings">
					<text class="item-text">通知设置</text>
					<text class="item-arrow">></text>
				</view>
			</view>
		</view>
		
		<view class="setting-section">
			<text class="section-title">系统信息</text>
			<view class="setting-list">
				<view class="setting-item" @click="systemVersion">
					<text class="item-text">版本信息</text>
					<text class="item-value">v1.0.0</text>
					<text class="item-arrow">></text>
				</view>
				<view class="setting-item" @click="checkUpdate">
					<text class="item-text">检查更新</text>
					<text class="item-arrow">></text>
				</view>
				<view class="setting-item" @click="aboutSystem">
					<text class="item-text">关于我们</text>
					<text class="item-arrow">></text>
				</view>
			</view>
		</view>
		
		<view class="logout-section">
			<button class="logout-btn" @click="logout">退出登录</button>
		</view>
	</view>
</template>

<script>
import uniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue';
export default {
  components: { uniIcons },
	data() {
		return {
			username: '',
			user: ''
		};
	},
	onLoad() {
		// 获取用户信息
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo) {
			this.username = userInfo.username;
		} else {
			// 未登录，跳转到登录页面
			uni.redirectTo({ url: '/pages/production/login/login' });
		}
	},
	methods: {
		close() {
			this.$refs.changePasswordPopup.close();
			this.$refs.editProfilePopup.close();
		},
		confirmChangePassword() {
			uni.showToast({ title: '修改密码功能开发中', icon: 'none' });
			this.$refs.changePasswordPopup.close();
		},
		confirmEditProfile() {
			this.username = this.user;
			uni.setStorageSync('userInfo', { username: this.username });
			uni.showToast({ title: '编辑资料成功', icon: 'success' });
			this.$refs.editProfilePopup.close();
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

.setting-section {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx;
}

.setting-list {
	display: flex;
	flex-direction: column;
}

.setting-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
	cursor: pointer;
	transition: background-color 0.3s;
}

.setting-item:last-child {
	border-bottom: none;
}

.setting-item:hover {
	background-color: #f9f9f9;
}

.item-text {
	font-size: 28rpx;
	color: #333;
}

.item-value {
	font-size: 26rpx;
	color: #8e8e93;
	margin-right: 10rpx;
}

.item-arrow {
	font-size: 28rpx;
	color: #8e8e93;
	font-weight: bold;
}

.user-info-section {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 40rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.user-avatar {
		width: 120rpx;
		height: 120rpx;
		background-color: #007aff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.avatar-text {
		font-size: 48rpx;
		color: #fff;
		font-weight: bold;
	}

	.user-details {
		flex: 1;
	}

	.user-name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
		display: block;
	}

	.user-role {
		font-size: 24rpx;
		color: #8e8e93;
		display: block;
	}

	.logout-section {
		margin-top: 30rpx;
		padding: 0 20rpx;
	}

	.logout-btn {
		width: 100%;
		padding: 20rpx;
		background-color: #ff2d55;
		color: #fff;
		border: none;
		border-radius: 10rpx;
		font-size: 28rpx;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s;
	}

	.logout-btn:hover {
		opacity: 0.8;
	}
	.popup-content {
		width: 600rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
	}
	.icon-left{
			/*icon放右边*/
			position: absolute;
			top: 30rpx;
			left: 91%;
			transform: translateY(-50%);
	}
</style>