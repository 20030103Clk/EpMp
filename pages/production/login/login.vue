<template>
	<view class="login-container">
		<view class="login-form">
			<view class="logo">
				<text class="logo-text">生产管理系统</text>
			</view>
			<view class="form-item">
				<text class="label">用户名</text>
				<input v-model="form.username" type="text" placeholder="请输入用户名" class="input" />
			</view>
			<view class="form-item">
				<text class="label">密码</text>
				<input v-model="form.password" type="password" placeholder="请输入密码" class="input" />
			</view>
			<view class="error-message" v-if="errorMsg">{{ errorMsg }}</view>
			<!-- 登录和注册按钮 -->
			<button class="login-btn" @click="handleLogin" :loading="loading">{{ loading ? '登录中...' : '登录' }}</button>
			<!-- 普通弹窗 -->
			<button @click="open" class="register-btn">注册</button>
			<uni-popup ref="popup" :mask-click="false">
				<view class="popup-content">
					<view class="form-item">
						<text class="label">用户名</text>
						<uni-icons type="clear" size="30" @click="close" class="icon-left" ></uni-icons>
						<input v-model="newform.name" type="text" placeholder="请输入用户名" class="input" />
					</view>
					<view class="form-item">
						<text class="label">密码</text>
						<input v-model="newform.pass" type="password" placeholder="请输入密码" class="input" />
					</view>
					<view class="form-item">
						<text class="label">确认密码</text>
						<input v-model="newform.confirmPassword" type="password" placeholder="请确认密码" class="input"/>
					</view>
					<view class="error-message" v-if="errorMsg">{{ errorMsg }}</view>
					<button @click="opclose">提交</button>
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
        console.error('Login error:', error);
        // 重新抛出错误，让调用者处理
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
        console.error('Register error:', error);
        // 重新抛出错误，让调用者处理
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
	methods: {
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
		// === API调用 ===
		api.user.login({
			name: this.form.username,
			pass: this.form.password
		}).then(res => {
			console.log('Login response:', res);
			if (res && res.success) {
				uni.setStorageSync('userInfo', {
					username: res.data.user.name,
					level: res.data.user.remark
				});
				uni.setStorageSync('token', res.data.token);
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
		// 模拟登录请求
		/*setTimeout(() => {
			// 从本地存储获取用户列表
			const users = uni.getStorageSync('users') || [];
			
			// 查找匹配的用户
			const matchedUser = users.find(user => 
				user.name === this.form.username && user.pass === this.form.password
			);
			
			//if (matchedUser) {
			if (ture) {
				uni.setStorageSync('userInfo', {
					username: matchedUser.name,
					level: matchedUser.level
				});

				uni.reLaunch({ url: '/pages/production/home/home' });
			} else {
				this.errorMsg = '用户名或密码错误';
				this.loading = false;
			}
		}, 1500);*/
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
		// === API调用 ===
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
			// 处理 409 错误（用户名已存在）
			if (error && error.statusCode === 409) {
				this.errorMsg = '用户名已存在';
			} else {
				this.errorMsg = '注册失败，请稍后重试';
			}
		});
		// 从本地存储获取现有用户列表
		/*const existingUsers = uni.getStorageSync('users') || [];
		
		// 检查用户名是否已存在
		const isUsernameExists = existingUsers.some(user => user.name === this.newform.name);
		if (isUsernameExists) {
			this.errorMsg = '用户名已存在';
			return;
		}
		
		// 创建新用户
		const newUser = {
			name: this.newform.name,
			pass: this.newform.pass,
			level: 0 // 默认普通用户
		};
		
		// 添加到用户列表
		existingUsers.push(newUser);
		uni.setStorageSync('users', existingUsers);
		uni.setStorageSync('userInfo', { username: this.newform.name });
		this.user.name = this.newform.name;
		this.user.pass = this.newform.pass;
		this.close();
		uni.showToast({
			title: '注册成功',
			icon: 'success'
		});*/
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
	background-color: #f5f5f5;
}


.login-form {
	width: 90%;
	max-width: 400px;
	background-color: #fff;
	border-radius: 8px;
	padding: 40rpx;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo {
	text-align: center;
	margin-bottom: 40rpx;
}

.logo-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #007AFF;
}

.form-item {
	margin-bottom: 30rpx;
}

.label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 10rpx;
}

.input {
	width: 93%;
	height: 80rpx;
	border: 1rpx solid #ddd;
	border-radius: 8rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
}

.error-message {
	color: #ff4444;
	font-size: 24rpx;
	margin-bottom: 20rpx;
	text-align: center;
}

.login-btn {
			width: 100%;
			height: 80rpx;
			background-color: #007AFF;
			color: #fff;
			border-radius: 8rpx;
			font-size: 32rpx;
			font-weight: bold;
			margin-top: 20rpx;
		}
		
.register-btn {
			width: 100%;
			height: 80rpx;
			background-color: #f5f5f5;
			color: #333;
			border: 1rpx solid #ddd;
			border-radius: 8rpx;
			font-size: 32rpx;
			margin-top: 20rpx;
		}
.popup-content{
			background-color: #fff;
			width: 600rpx;
			padding: 20rpx;
			border-radius: 8px;
}
.popup-content input{
			width: 92%;
			height: 80rpx;
			border: 1rpx solid #ddd;
			border-radius: 8rpx;
			padding: 0 20rpx;
			font-size: 28rpx;
			margin-bottom: 20rpx;
 		}
.popup-content button{
			width: 100%;
			height: 80rpx;
			background-color: #007AFF;
			color: #fff;
			border-radius: 8rpx;
			font-size: 32rpx;
			font-weight: bold;
			margin-top: 20rpx;
		}
.icon-left{
			/*icon放右边*/
			position: absolute;
			top: 30rpx;
			left: 91%;
			transform: translateY(-50%);
}
</style>