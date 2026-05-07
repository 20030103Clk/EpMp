<template>
	<view class="splash-container">
		<view class="particles">
			<view class="particle" v-for="n in 15" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		
		<view class="logo-section">
			<view class="logo-wrapper">
				<view class="logo-inner">
					<text class="logo-text">E</text>
				</view>
			</view>
			<text class="app-name">企业生产管理系统</text>
			<text class="app-subtitle">Enterprise Production Management</text>
		</view>
		
		<view class="progress-section">
			<view class="progress-bar">
				<view class="progress-fill" :style="{ width: progress + '%' }"></view>
			</view>
			<text class="progress-text">{{ progress }}%</text>
			<text class="loading-text">{{ loadingText }}</text>
		</view>
		
		<view class="footer">
			<text class="copyright">© 2024 Production Management System</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SplashPage',
	data() {
		return {
			progress: 0,
			loadingText: '正在初始化...',
			loadingTexts: [
				'正在初始化...',
				'加载资源中...',
				'连接服务器...',
				'加载数据中...',
				'即将完成...'
			],
			timer: null
		};
	},
	onLoad() {
		this.startLoading();
	},
	onUnload() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},
	methods: {
		getParticleStyle(n) {
			const colors = ['#c9a962', '#d4b896', '#c5a788', '#d4c4a8', '#bfbdba'];
			const left = 10 + Math.random() * 80;
			const top = 10 + Math.random() * 80;
			const delay = Math.random() * 3;
			const duration = 3 + Math.random() * 4;
			const size = 8 + Math.random() * 16;
			return {
				left: `${left}%`,
				top: `${top}%`,
				width: `${size}rpx`,
				height: `${size}rpx`,
				background: colors[n % colors.length],
				animationDelay: `${delay}s`,
				animationDuration: `${duration}s`
			};
		},
		
		startLoading() {
			let step = 0;
			const totalSteps = 100;
			const intervalTime = 30;
			
			this.timer = setInterval(() => {
				step += Math.random() * 8 + 2;
				if (step >= totalSteps) {
					step = totalSteps;
					clearInterval(this.timer);
					
					setTimeout(() => {
						// 始终跳转到登录页，由登录页判断用户身份
						uni.reLaunch({
							url: '/pages/production/login/login'
						});
					}, 500);
				}
				
				this.progress = Math.round(step);
				this.updateLoadingText();
			}, intervalTime);
		},
		
		updateLoadingText() {
			const index = Math.min(Math.floor(this.progress / 25), this.loadingTexts.length - 1);
			this.loadingText = this.loadingTexts[index];
		}
	}
};
</script>

<style scoped>
.splash-container {
	width: 100%;
	height: 100vh;
	background: linear-gradient(135deg, #fdfbfb 0%, #f5f7fa 50%, #e8eef3 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
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
	animation: float ease-in-out infinite;
}

@keyframes float {
	0%, 100% {
		transform: translateY(0) scale(1);
		opacity: 0.3;
	}
	50% {
		transform: translateY(-20rpx) scale(1.2);
		opacity: 0.7;
	}
}

.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 10;
	margin-bottom: 60rpx;
}

.logo-wrapper {
	width: 180rpx;
	height: 180rpx;
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 12rpx 40rpx rgba(201, 169, 98, 0.2);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	margin-bottom: 30rpx;
}

.logo-inner {
	width: 140rpx;
	height: 140rpx;
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(201, 169, 98, 0.4);
}

.logo-text {
	font-size: 72rpx;
	font-weight: 700;
	color: #fff;
}

.app-name {
	font-size: 36rpx;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 12rpx;
}

.app-subtitle {
	font-size: 22rpx;
	color: #95a5a6;
	letter-spacing: 2rpx;
}

.progress-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 10;
	width: 60%;
}

.progress-bar {
	width: 100%;
	height: 8rpx;
	background: rgba(201, 169, 98, 0.2);
	border-radius: 4rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #c9a962 0%, #d4b896 100%);
	border-radius: 4rpx;
	transition: width 0.1s ease-out;
}

.progress-text {
	font-size: 32rpx;
	font-weight: 600;
	color: #c9a962;
	margin-bottom: 12rpx;
}

.loading-text {
	font-size: 24rpx;
	color: #95a5a6;
}

.footer {
	position: absolute;
	bottom: 60rpx;
	z-index: 10;
}

.copyright {
	font-size: 20rpx;
	color: #bdc3c7;
}
</style>