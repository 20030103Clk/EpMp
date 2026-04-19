<template>
	<view class="container">
		<view class="header">
			<text class="title">质量管理</text>
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
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 140rpx; /* 为底部固定按钮留出空间 */
	position: relative;
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

.quality-stats {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.stat-card {
	flex: 1;
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	text-align: center;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.stat-title {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.stat-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #007aff;
	margin-bottom: 8rpx;
}

.stat-unit {
	font-size: 24rpx;
	color: #8e8e93;
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
	font-weight: bold;
	color: #333;
}

.more {
	font-size: 24rpx;
	color: #007aff;
	cursor: pointer;
}

.inspection-section {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.inspection-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.inspection-item {
	background-color: #f9f9f9;
	border-radius: 8rpx;
	padding: 15rpx;
}

.inspection-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.inspection-id {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.inspection-result {
	font-size: 24rpx;
	padding: 4rpx 12rpx;
	border-radius: 15rpx;
	font-weight: bold;
}

.inspection-result.pass {
	background-color: #e8f8f5;
	color: #4cd964;
}

.inspection-result.fail {
	background-color: #ffebee;
	color: #ff2d55;
}

.inspection-content {
				display: flex;
				flex-direction: column;
				gap: 10rpx;
				margin-bottom: 15rpx;
			}
			
			.inspection-actions {
				display: flex;
				justify-content: flex-end;
				margin-top: 10rpx;
			}
			
			.delete-btn {
				padding: 8rpx 16rpx;
				background-color: #ff2d55;
				color: #fff;
				border: none;
				border-radius: 10rpx;
				font-size: 22rpx;
				cursor: pointer;
				transition: all 0.3s;
				width: 100%;
			}
			
			.delete-btn:hover {
				opacity: 0.8;
			}

.content-row {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.label {
	font-size: 24rpx;
	color: #666;
	width: 120rpx;
}

.value {
	font-size: 24rpx;
	color: #333;
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
	padding: 4rpx 10rpx;
	background-color: #ffebee;
	color: #ff2d55;
	border-radius: 12rpx;
}

.quality-actions {
		display: flex;
		gap: 15rpx;
		padding: 20rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #f5f5f5;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
		z-index: 100;
		box-sizing: border-box;
	}

	.action-btn {
		flex: 1;
		padding: 20rpx;
		background-color: #007aff;
		color: #fff;
		border: none;
		border-radius: 10rpx;
		font-size: 28rpx;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s;
	}

.action-btn.secondary {
	background-color: #fff;
	color: #007aff;
	border: 1rpx solid #007aff;
}

.action-btn:hover {
	opacity: 0.8;
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