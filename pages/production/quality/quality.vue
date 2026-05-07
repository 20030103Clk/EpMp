<template>
	<view class="container">
		<view class="particles">
			<view class="particle" v-for="n in 10" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		<view class="header">
			<view class="header-content">
				<view class="title-section">
					<text class="title">质量管理</text>
					<text class="subtitle">Quality Management</text>
				</view>
			</view>
		</view>
		
		<view class="quality-stats">
			<view class="stat-card">
				<text class="stat-title">合格率</text>
				<text class="stat-value">{{ computedPassRate }}%</text>
			</view>
			
			<view class="stat-card">
				<text class="stat-title">检测数</text>
				<text class="stat-value">{{ totalInspections }}</text>
				<text class="stat-unit">件</text>
			</view>
			
			<view class="stat-card">
				<text class="stat-title">合格数</text>
				<text class="stat-value">{{ computedPassCount }}</text>
				<text class="stat-unit">件</text>
			</view>
			
			<view class="stat-card">
				<text class="stat-title">不合格数</text>
				<text class="stat-value">{{ totalUnqualCount }}</text>
				<text class="stat-unit">件</text>
			</view>
		</view>
		
		<view class="inspection-section">
			<view class="section-header">
				<text class="section-title">质检记录</text>
			</view>
			
			<view class="inspection-list">
				<view class="inspection-item" v-for="(item, index) in inspectionRecords" :key="index">
						<view class="inspection-header">
							<text class="inspection-id">质检#{{ item.id }}</text>
							<text class="inspection-result" :class="item.result">{{ item.resultText }}</text>
						</view>
						
						<view class="inspection-content">
							<view class="content-row">
								<text class="label">产品名称：</text>
								<text class="value">{{ item.product }}</text>
							</view>
							
							<view class="content-row">
								<text class="label">检测数量：</text>
								<text class="value">{{ item.quantity }} 件</text>
							</view>
							
							<view class="content-row">
								<text class="label">检测时间：</text>
								<text class="value">{{ item.inspectionTime }}</text>
							</view>
						</view>
						<view class="inspection-actions">
							<button class="delete-btn" @click="deleteInspection(index)" v-if="isAdmin">删除</button>
						</view>
					</view>
			</view>
		</view>
		
		<view class="quality-actions">
			<button class="action-btn secondary" @click="openQualityReport">质量报告</button>
		</view>
		<uni-popup ref="qualityReportPopup">
			<view class="simple-popup">
				<view class="popup-title">质量报告</view>
				<view class="popup-content">
					<view class="report-item">
						<text class="report-label">报告名称</text>
						<text class="report-value">{{ new Date().toLocaleDateString('zh-CN') }}质检报告</text>
					</view>
					<view class="report-item">
						<text class="report-label">检测数量</text>
						<text class="report-value">{{ todayInspections }} 件</text>
					</view>
					<view class="report-item">
						<text class="report-label">合格数量</text>
						<text class="report-value">{{ rejectCount }} 件</text>
					</view>
					<view class="report-item">
						<text class="report-label">不合格数量</text>
						<text class="report-value">{{ todayUnqualCount }} 件</text>
					</view>
					<view class="report-item">
						<text class="report-label">合格率</text>
						<text class="report-value highlight">{{ computedTodayPassRate }}%</text>
					</view>
					<view class="report-item">
						<text class="report-label">按产品分类不合格数量</text>
						<view class="unqual-by-product">
							<view class="unqual-item" v-for="item in unqualByProduct" :key="item.product">
								<text class="unqual-product">{{ item.product }}</text>
								<text class="unqual-quantity">{{ item.unqual }} 件</text>
							</view>
							<view v-if="unqualByProduct.length === 0" class="no-data">
								<text>暂无不合格数据</text>
							</view>
						</view>
					</view>
				</view>
				<view class="popup-buttons">
					<button type="primary" class="report-close-btn" @click="closeQualityReport">关闭</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

// API 调用对象
const api = {
  quality: {
    getQualities: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/quality${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
        console.log('GET qualities API response:', response);
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
        console.error('Get qualities error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    },
    createQuality: async (data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/quality`,
          method: 'POST',
          data: data,
          header: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
        console.log('Create quality API response:', response);
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
        console.error('Create quality error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    },
    deleteQuality: async (id) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/quality/${id}`,
          method: 'DELETE'
        });
        console.log('Delete quality API response:', response);
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
        console.error('Delete quality error:', error);
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

// 格式化日期为 YYYY-MM-DD 格式
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default {
	data() {
		return {
			passRate: '',
			inspectionRecords: [],
			productionRecords: []
		};
	},
	computed: {
		// 计算合格率
		computedPassRate() {
			if (this.inspectionRecords.length === 0 && this.productionRecords.length === 0) return 0;
			// 从质检记录和生产记录中计算总数量和合格数量
			let totalQuantity = 0;
			let passQuantity = 0;
			
			// 从质检记录中计算
			totalQuantity += this.inspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
			passQuantity += this.inspectionRecords.filter(item => item.result === 'pass').reduce((acc, cur) => acc + cur.quantity, 0);
			
			// 从生产记录中计算
			totalQuantity += this.productionRecords.reduce((acc, cur) => acc + cur.output, 0);
			passQuantity += this.productionRecords.reduce((acc, cur) => acc + cur.qual, 0);
			
			return totalQuantity > 0 ? (passQuantity / totalQuantity * 100).toFixed(2) : '0.00';
		},
		// 计算今日合格率
		computedTodayPassRate() {
			const today = new Date().toLocaleDateString('zh-CN');
			let totalQuantity = 0;
			let passQuantity = 0;
			
			// 从质检记录中计算今日数据
			const todayInspectionRecords = this.inspectionRecords.filter(item => item.inspectionTime.startsWith(today));
			totalQuantity += todayInspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
			passQuantity += todayInspectionRecords.filter(item => item.result === 'pass').reduce((acc, cur) => acc + cur.quantity, 0);
			
			// 从生产记录中计算今日数据
			const todayProductionRecords = this.productionRecords.filter(item => item.date && item.date.toString().startsWith(today));
			totalQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.output, 0);
			passQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.qual, 0);
			
			return totalQuantity > 0 ? (passQuantity / totalQuantity * 100).toFixed(2) : '0.00';
		},
		// 计算今日检测数量
		todayInspections() {
			const today = new Date().toLocaleDateString('zh-CN');
			let totalQuantity = 0;
			
			// 从质检记录中计算今日数据
			const todayInspectionRecords = this.inspectionRecords.filter(item => item.inspectionTime.startsWith(today));
			totalQuantity += todayInspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
			
			// 从生产记录中计算今日数据
			const todayProductionRecords = this.productionRecords.filter(item => item.date && item.date.toString().startsWith(today));
			totalQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.output, 0);
			
			return totalQuantity;
		},
		// 计算今日合格数量
		rejectCount() {
			const today = new Date().toLocaleDateString('zh-CN');
			let passQuantity = 0;
			
			// 从质检记录中计算今日数据
			const todayInspectionRecords = this.inspectionRecords.filter(item => item.inspectionTime.startsWith(today));
			passQuantity += todayInspectionRecords.filter(item => item.result === 'pass').reduce((acc, cur) => acc + cur.quantity, 0);
			
			// 从生产记录中计算今日数据
			const todayProductionRecords = this.productionRecords.filter(item => item.date && item.date.toString().startsWith(today));
			passQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.qual, 0);
			
			return passQuantity;
		},
		// 计算今日不合格数量
		todayUnqualCount() {
			const today = new Date().toLocaleDateString('zh-CN');
			let unqualQuantity = 0;
			
			// 从质检记录中计算今日数据
			const todayInspectionRecords = this.inspectionRecords.filter(item => item.inspectionTime.startsWith(today));
			unqualQuantity += todayInspectionRecords.filter(item => item.result === 'fail').reduce((acc, cur) => acc + cur.quantity, 0);
			
			// 从生产记录中计算今日数据
			const todayProductionRecords = this.productionRecords.filter(item => item.date && item.date.toString().startsWith(today));
			unqualQuantity += todayProductionRecords.reduce((acc, cur) => acc + cur.unqual, 0);
			
			return unqualQuantity;
		},
		// 计算总检测数量
		totalInspections() {
			let totalQuantity = 0;
			
			// 从质检记录中计算
			totalQuantity += this.inspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
			
			// 从生产记录中计算
			totalQuantity += this.productionRecords.reduce((acc, cur) => acc + cur.output, 0);
			
			return totalQuantity;
		},
		// 计算总合格数量
		computedPassCount() {
			let passQuantity = 0;
			
			// 从质检记录中计算
			passQuantity += this.inspectionRecords.filter(item => item.result === 'pass').reduce((acc, cur) => acc + cur.quantity, 0);
			
			// 从生产记录中计算
			passQuantity += this.productionRecords.reduce((acc, cur) => acc + cur.qual, 0);
			
			return passQuantity;
		},
		// 计算总不合格数量
		totalUnqualCount() {
			let unqualQuantity = 0;
			
			// 从质检记录中计算
			const inspectionUnqual = this.inspectionRecords.reduce((acc, cur) => acc + (cur.unqual || 0), 0);
			unqualQuantity += inspectionUnqual;
			
			// 从生产记录中计算
			const productionUnqual = this.productionRecords.reduce((acc, cur) => acc + (cur.unqual || 0), 0);
			unqualQuantity += productionUnqual;
			
			console.log('总不合格数量计算:', {
				inspectionUnqual,
				productionUnqual,
				unqualQuantity,
				productionRecordsLength: this.productionRecords.length
			});
			
			return unqualQuantity;
		},
		// 按产品分类统计不合格数量
		unqualByProduct() {
			const unqualByProductMap = new Map();
			
			// 从质检记录中统计
			this.inspectionRecords.forEach(record => {
				const product = record.product || '未知产品';
				const currentUnqual = unqualByProductMap.get(product) || 0;
				unqualByProductMap.set(product, currentUnqual + (record.unqual || 0));
			});
			
			// 从生产记录中统计
			this.productionRecords.forEach(record => {
				const product = record.product || '未知产品';
				const currentUnqual = unqualByProductMap.get(product) || 0;
				unqualByProductMap.set(product, currentUnqual + (record.unqual || 0));
			});
			
			// 转换为数组
			return Array.from(unqualByProductMap.entries()).map(([product, unqual]) => ({
				product,
				unqual
			}));
		},
		// 判断是否为管理员
		isAdmin() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo && userInfo.level === 1;
		}
	},
	onLoad() {
		// 加载质检记录
		this.loadQualityRecords();
		// 加载生产记录，用于统计不合格数据
		this.loadProductionRecords();
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
		// 加载质检记录
		loadQualityRecords() {
			console.log('开始加载质检记录...');
			uni.showLoading({ title: '加载中...' });
			api.quality.getQualities().then(res => {
				console.log('Get qualities API response:', res);
				uni.hideLoading();
				if (res.success) {
					console.log('质检记录数据:', res.data.list);
					this.inspectionRecords = res.data.list.map(record => ({
						id: record.quality_id,
						product: record.product,
						quantity: record.quantity,
						qual: record.qual,
						unqual: record.unqual,
						result: record.qual > record.unqual ? 'pass' : 'fail',
						resultText: record.qual > record.unqual ? '合格' : '不合格',
						inspectionTime: record.inspection_time
					}));
					console.log('inspectionRecords 数组长度:', this.inspectionRecords.length);
				} else {
					console.error('加载质检记录失败:', res.message);
					uni.showToast({ title: '加载失败', icon: 'none' });
				}
			}).catch(error => {
				console.error('加载质检记录失败:', error);
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		},
		
		// 加载生产记录，用于统计不合格数据
		loadProductionRecords() {
			// 传递一个大的 pageSize，确保获取所有生产记录
			console.log('开始加载生产记录...');
			api.record.getRecords({ pageSize: 1000 }).then(res => {
				console.log('Get records API response:', res);
				if (res.success) {
					console.log('生产记录数据:', res.data.list);
					this.productionRecords = res.data.list;
					console.log('productionRecords 数组长度:', this.productionRecords.length);
				} else {
					console.error('加载生产记录失败:', res.message);
					// 加载失败时，清空生产记录列表
					this.productionRecords = [];
				}
			}).catch(error => {
				console.error('加载生产记录失败:', error);
				// 加载失败时，清空生产记录列表
				this.productionRecords = [];
			});
		},
		
		openQualityReport() {
			this.$refs.qualityReportPopup.open('center');
		},
		
		closeQualityReport() {
			this.$refs.qualityReportPopup.close();
		}
	}
};
</script>

<style scoped>
.container {
	padding: 20rpx;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #d4d8dc 100%);
	min-height: 100vh;
	padding-bottom: 140rpx;
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

.quality-stats {
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
	padding: 24rpx;
	text-align: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
}

.stat-title {
	font-size: 24rpx;
	color: #6c757d;
	margin-bottom: 12rpx;
	font-weight: 500;
}

.stat-value {
	font-size: 48rpx;
	font-weight: 700;
	color: #2c3e50;
	margin-bottom: 8rpx;
}

.stat-card:first-child .stat-value {
	color: #c9a962;
}

.stat-unit {
	font-size: 22rpx;
	color: #95a5a6;
	margin-left: 8rpx;
}

.stat-trend {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 5rpx;
	margin-top: 8rpx;
}

.trend-text {
	font-size: 20rpx;
	color: #4cd964;
}

.trend-icon {
	font-size: 20rpx;
	color: #4cd964;
	font-weight: bold;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
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

.inspection-section {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	position: relative;
	z-index: 10;
}

.inspection-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.inspection-item {
	background: rgba(248, 249, 250, 0.8);
	border-radius: 16rpx;
	padding: 20rpx;
	border-left: 6rpx solid #c9a962;
}

.inspection-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.inspection-id {
	font-size: 30rpx;
	font-weight: 600;
	color: #2c3e50;
}

.inspection-result {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
}

.inspection-result .status-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
}

.inspection-result.pass {
	background: rgba(76, 217, 100, 0.1);
	color: #4cd964;
}

.inspection-result.pass .status-dot { background: #4cd964; }

.inspection-result.fail {
	background: rgba(255, 45, 85, 0.1);
	color: #ff2d55;
}

.inspection-result.fail .status-dot { background: #ff2d55; }

.inspection-content {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.inspection-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 12rpx;
}

.delete-btn {
	padding: 12rpx 24rpx;
	background: rgba(255, 45, 85, 0.1);
	color: #ff2d55;
	border: none;
	border-radius: 16rpx;
	font-size: 24rpx;
	cursor: pointer;
	transition: all 0.3s ease;
}

.delete-btn:active {
	background: rgba(255, 45, 85, 0.2);
	transform: scale(0.96);
}

.content-row {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.label {
	font-size: 26rpx;
	color: #6c757d;
	width: 140rpx;
	font-weight: 500;
}

.value {
	font-size: 26rpx;
	color: #2c3e50;
	flex: 1;
}

.defect-tags {
	display: flex;
	gap: 8rpx;
	flex-wrap: wrap;
	flex: 1;
}

.defect-tag {
	font-size: 22rpx;
	padding: 6rpx 12rpx;
	background: rgba(255, 45, 85, 0.1);
	color: #ff2d55;
	border-radius: 12rpx;
}

.quality-actions {
	display: flex;
	gap: 16rpx;
	padding: 24rpx;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.1);
	z-index: 100;
	box-sizing: border-box;
	border-top: 1rpx solid rgba(255, 255, 255, 0.6);
}

.action-btn {
	flex: 1;
	padding: 20rpx;
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	color: #fff;
	border: none;
	border-radius: 16rpx;
	font-size: 28rpx;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4rpx 16rpx rgba(201, 169, 98, 0.3);
}

.action-btn.secondary {
	background: rgba(255, 255, 255, 0.8);
	color: #c9a962;
	border: 1rpx solid #c9a962;
	box-shadow: none;
}

.action-btn:active {
	transform: scale(0.96);
}

/* 弹出层样式 */
.simple-popup {
	background-color: #fff;
	border-radius: 10rpx;
	width: 500rpx;
	max-width: 90vw;
}

.simple-popup .popup-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	padding: 20rpx;
	text-align: center;
	border-bottom: 1rpx solid #eee;
}

.simple-popup .popup-content {
	padding: 20rpx;
}

.simple-popup .form-item {
	margin-bottom: 20rpx;
}

.simple-popup .form-label {
	display: block;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.simple-popup .form-input {
			width: 100%;
			padding: 16rpx;
			border: 1rpx solid #ddd;
			border-radius: 6rpx;
			font-size: 26rpx;
			box-sizing: border-box;
		}

		.simple-popup .form-select {
			width: 100%;
			padding: 16rpx;
			border: 1rpx solid #ddd;
			border-radius: 6rpx;
			font-size: 26rpx;
			box-sizing: border-box;
			background-color: #fff;
		}

.simple-popup radio-group {
	display: flex;
	gap: 30rpx;
	padding: 10rpx 0;
}

.simple-popup radio-group label {
	display: flex;
	align-items: center;
	font-size: 26rpx;
}

.simple-popup .popup-buttons {
	display: flex;
	border-top: 1rpx solid #eee;
}

.simple-popup .popup-buttons button {
	flex: 1;
	padding: 20rpx;
	border: none;
	font-size: 26rpx;
}

.simple-popup .popup-buttons button:first-child {
	border-right: 1rpx solid #eee;
	color: #666;
}

.simple-popup .popup-buttons button:last-child {
	color: #666;
	background-color: #f8f9fa;
}

.simple-popup .popup-buttons .report-close-btn {
	color: #6c757d;
	background-color: #f8f9fa;
	border: 1rpx solid #dee2e6;
}

/* 报告样式 */
.report-label {
	display: block;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.report-value {
	display: block;
	font-size: 26rpx;
	color: #333;
}

.report-value.highlight {
	color: #007aff;
	font-weight: bold;
}

.defect-list {
	margin-top: 8rpx;
}

.defect-item {
	display: block;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 6rpx;
	padding-left: 20rpx;
	position: relative;
}

.defect-item::before {
	content: "•";
	position: absolute;
	left: 8rpx;
	color: #007aff;
}
</style>