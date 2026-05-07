<template>
	<view class="login-container">
		<view class="particles">
			<view class="particle" v-for="n in 20" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		<view class="login-form">
			<view class="logo">
				<view class="logo-icon">
					<text class="logo-icon-text">E</text>
				</view>
				<text class="logo-text">生产管理系统</text>
				<text class="logo-subtitle">Enterprise Production Management</text>
			</view>
			<view class="form-item">
				<view class="input-wrapper">
					<uni-icons type="user" size="24" class="input-icon"></uni-icons>
					<input v-model="form.username" type="text" placeholder="请输入用户名" class="input" />
				</view>
			</view>
			<view class="form-item">
				<view class="input-wrapper">
					<uni-icons type="lock" size="24" class="input-icon"></uni-icons>
					<input v-model="form.password" type="password" placeholder="请输入密码" class="input" />
				</view>
			</view>
			<view class="error-message" v-if="errorMsg">{{ errorMsg }}</view>
			<button class="login-btn" @click="handleLogin" :loading="loading">{{ loading ? '登录中...' : '登录' }}</button>
			<button @click="open" class="register-btn">注册</button>
			<uni-popup ref="popup" :mask-click="false">
				<view class="popup-content">
					<view class="popup-header">
						<text class="popup-title">用户注册</text>
						<uni-icons type="clear" size="30" @click="close" class="close-icon"></uni-icons>
					</view>
					<view class="popup-body">
						<view class="form-item">
							<text class="label">用户名</text>
							<input v-model="newform.name" type="text" placeholder="请输入用户名" class="popup-input" />
						</view>
						<view class="form-item">
							<text class="label">密码</text>
							<input v-model="newform.pass" type="password" placeholder="请输入密码" class="popup-input" />
						</view>
						<view class="form-item">
							<text class="label">确认密码</text>
							<input v-model="newform.confirmPassword" type="password" placeholder="请确认密码" class="popup-input"/>
						</view>
						<view class="error-message" v-if="errorMsg">{{ errorMsg }}</view>
					</view>
					<view class="popup-footer">
						<button class="popup-btn cancel" @click="close">取消</button>
						<button class="popup-btn confirm" @click="opclose">提交</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  user: {
    login: async (data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/user/login`,
          method: 'POST',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Login API response:', response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    register: async (data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/user/register`,
          method: 'POST',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Register API response:', response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        console.error('Register error:', error);
        throw error;
      }
    }
  }
};
export default {
	data() {
		return {
			form: {
				level: 0,
				username: '',
				password: '',
			},
			newform: {
				level: 0,
				name: '',
				pass: '',
				confirmPassword: ''
			},
			user : {level: 0, name: '', pass: ''},
			errorMsg: '',
			loading: false,
		};
	},
	onLoad() {
		// 清除之前保存的登录信息，确保每次都需要重新登录
		uni.removeStorageSync('userInfo');
		uni.removeStorageSync('token');
	},
	methods: {
		getParticleStyle(n) {
			const colors = ['#c9a962', '#d4b896', '#c5a788', '#d4c4a8', '#bfbdba'];
			const left = Math.random() * 100;
			const delay = Math.random() * 5;
			const duration = 3 + Math.random() * 4;
			const size = 8 + Math.random() * 16;
			return {
				left: `${left}%`,
				width: `${size}rpx`,
				height: `${size}rpx`,
				background: colors[n % colors.length],
				animationDelay: `${delay}s`,
				animationDuration: `${duration}s`
			};
		},
		validateForm() {
			if (!this.form.username.trim()) {
				this.errorMsg = '请输入用户名';
				return false;
			}
			if (!this.form.password.trim()) {
				this.errorMsg = '请输入密码';
				return false;
			}
			this.errorMsg = '';
			return true;
		},
		handleLogin() {
			if (!this.validateForm()) {
				return;
			}
			this.loading = true;
			api.user.login({
				name: this.form.username,
				pass: this.form.password
			}).then(res => {
				console.log('Login response:', res);
				if (res && res.success) {
					const userLevel = res.data.user.remark;
					uni.setStorageSync('userInfo', {
						username: res.data.user.name,
						level: userLevel
					});
					uni.setStorageSync('token', res.data.token);
					// 所有用户都跳转到首页，使用reLaunch强制刷新
					uni.reLaunch({ url: '/pages/production/home/home' });
				} else {
					this.errorMsg = res ? res.message : '登录失败，请稍后重试';
					this.loading = false;
				}
			}).catch(error => {
				console.error('Login error:', error);
				this.errorMsg = '登录失败，请检查用户名和密码';
				this.loading = false;
			});
		},
		open(){
        	this.$refs.popup.open('center');
			this.errorMsg = '';
			this.newform.name = '';
			this.newform.pass = '';
			this.newform.confirmPassword = '';
      	},
		close() {
			this.$refs.popup.close();
			this.errorMsg = '';
			this.newform.name = '';
			this.newform.pass = '';
			this.newform.confirmPassword = '';
		},
		opclose(){
			if (this.newform.name === '' || this.newform.pass === '' || this.newform.confirmPassword === '') {
				this.errorMsg = '请填写完整的注册信息';
				return;
			} 
			if(this.newform.pass !== this.newform.confirmPassword){
				this.errorMsg = '两次密码输入不一致';
				return;
			}
			api.user.register({
				name: this.newform.name,
				pass: this.newform.pass,
				remark: 0
			}).then(res => {
				console.log('Register response:', res);
				if (res && res.success) {
					uni.setStorageSync('userInfo', { username: this.newform.name });
					this.user.name = this.newform.name;
					this.user.pass = this.newform.pass;
					this.close();
					uni.showToast({
						title: '注册成功',
						icon: 'success'
					});
				} else {
					this.errorMsg = res ? res.message : '注册失败，请稍后重试';
				}
			}).catch(error => {
				console.error('Register error:', error);
				if (error && error.statusCode === 409) {
					this.errorMsg = '用户名已存在';
				} else {
					this.errorMsg = '注册失败，请稍后重试';
				}
			});
		}
	}
};
</script>

<style scoped>
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #d4d8dc 100%);
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
	opacity: 0.6;
	animation: float linear infinite;
}

@keyframes float {
	0% {
		transform: translateY(100vh) rotate(0deg);
		opacity: 0;
	}
	10% {
		opacity: 0.6;
	}
	90% {
		opacity: 0.6;
	}
	100% {
		transform: translateY(-10vh) rotate(360deg);
		opacity: 0;
	}
}

.login-form {
	width: 90%;
	max-width: 420px;
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 24rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15), 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	position: relative;
	z-index: 10;
}

.logo {
	text-align: center;
	margin-bottom: 50rpx;
}

.logo-icon {
	width: 100rpx;
	height: 100rpx;
	margin: 0 auto 20rpx;
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 8rpx 24rpx rgba(201, 169, 98, 0.4);
}

.logo-icon-text {
	font-size: 48rpx;
	color: #fff;
	font-weight: bold;
}

.logo-text {
	display: block;
	font-size: 40rpx;
	font-weight: 700;
	color: #2c3e50;
	margin-bottom: 8rpx;
}

.logo-subtitle {
	display: block;
	font-size: 22rpx;
	color: #95a5a6;
	letter-spacing: 2rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.label {
	display: block;
	font-size: 26rpx;
	color: #5a6672;
	margin-bottom: 12rpx;
	font-weight: 500;
}

.input-wrapper {
	position: relative;
	background: rgba(255, 255, 255, 0.7);
	border-radius: 16rpx;
	border: 1rpx solid rgba(201, 169, 98, 0.2);
	transition: all 0.3s ease;
}

.input-wrapper:focus-within {
	border-color: #c9a962;
	box-shadow: 0 0 0 4rpx rgba(201, 169, 98, 0.1);
}

.input-icon {
	position: absolute;
	left: 24rpx;
	top: 50%;
	transform: translateY(-50%);
	color: #95a5a6;
}

.input {
	width: 100%;
	height: 88rpx;
	padding: 0 24rpx 0 72rpx;
	font-size: 28rpx;
	background: transparent;
	border: none;
	box-sizing: border-box;
}

.error-message {
	color: #e74c3c;
	font-size: 24rpx;
	margin-bottom: 20rpx;
	text-align: center;
	min-height: 32rpx;
}

.login-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	color: #fff;
	border-radius: 16rpx;
	font-size: 32rpx;
	font-weight: 600;
	margin-top: 20rpx;
	border: none;
	box-shadow: 0 8rpx 24rpx rgba(201, 169, 98, 0.4);
	transition: all 0.3s ease;
}

.login-btn:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 12rpx rgba(201, 169, 98, 0.4);
}

.register-btn {
	width: 100%;
	height: 88rpx;
	background: rgba(255, 255, 255, 0.8);
	color: #c9a962;
	border: 1rpx solid #c9a962;
	border-radius: 16rpx;
	font-size: 32rpx;
	margin-top: 20rpx;
	transition: all 0.3s ease;
}

.register-btn:active {
	background: rgba(201, 169, 98, 0.1);
}

.popup-content {
	width: 680rpx;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 32rpx;
	background: linear-gradient(135deg, #f8f9fa 0%, #f1f2f3 100%);
	border-bottom: 1rpx solid #e9ecef;
}

.popup-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2c3e50;
}

.close-icon {
	color: #95a5a6;
	padding: 8rpx;
}

.popup-body {
	padding: 32rpx;
}

.popup-input {
	width: 100%;
	height: 80rpx;
	border: 1rpx solid #e9ecef;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	box-sizing: border-box;
	margin-bottom: 24rpx;
	background: rgba(255, 255, 255, 0.8);
}

.popup-footer {
	display: flex;
	gap: 16rpx;
	padding: 24rpx 32rpx;
	background: #f8f9fa;
	border-top: 1rpx solid #e9ecef;
}

.popup-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	font-weight: 500;
	border: none;
	transition: all 0.3s ease;
}

.popup-btn.cancel {
	background: #f1f2f3;
	color: #6c757d;
}

.popup-btn.confirm {
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	color: #fff;
}
</style>