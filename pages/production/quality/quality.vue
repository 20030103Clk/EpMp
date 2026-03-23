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
							<button class="delete-btn" @click="deleteInspection(index)">删除</button>
						</view>
					</view>
			</view>
		</view>
		
		<view class="quality-actions">
			<button class="action-btn" @click="openNewInspection">新建质检</button>
			<button class="action-btn secondary" @click="openQualityReport">质量报告</button>
		</view>
		<uni-popup ref="newInspectionPopup">
			<view class="simple-popup">
				<view class="popup-title">新建质检</view>
				<view class="popup-content">
					<view class="form-item">
						<text class="form-label">产品名称</text>
						<input type="text" v-model="inspectionForm.product" class="form-input" placeholder="请输入产品名称" />
					</view>
					<view class="form-item">
						<text class="form-label">检测数量</text>
						<input type="number" v-model="inspectionForm.quantity" class="form-input" placeholder="请输入数量" />
					</view>
					<view class="form-item">
						<text class="form-label">检测结果</text>
						<radio-group :value="inspectionForm.result" @change="onResultChange">
							<label><radio value="pass" /> 合格</label>
							<label><radio value="fail" /> 不合格</label>
						</radio-group>
					</view>
				</view>
				<view class="popup-buttons">
					<button type="default" @click="closeNewInspection">取消</button>
					<button type="primary"  class="confirm-btn" @click="submitNewInspection">确定</button>
				</view>
			</view>
		</uni-popup>
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
						<text class="report-label">合格率</text>
						<text class="report-value highlight">{{ computedTodayPassRate }}%</text>
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
export default {
	data() {
			return {
				passRate: '',
				todayInspections: 0,
				rejectCount: 0,
				inspectionForm: {
					product: '',
					quantity: '',
					result: 'pass'
				},
				inspectionRecords: [
				{
					id: 'Q001',
					product: '产品A',
					quantity: 100,
					result: 'pass',
					resultText: '合格',
					inspectionTime: '2026-01-11 14:30',
				},
				{
					id: 'Q002',
					product: '产品B',
					quantity: 80,
					result: 'pass',
					resultText: '合格',
					inspectionTime: '2026-01-11 13:15',
				},
				{
					id: 'Q003',
					product: '产品C',
					quantity: 120,
					result: 'fail',
					resultText: '不合格',
					inspectionTime: '2026-01-11 11:45',
				},
				{
					id: 'Q004',
					product: '产品A',
					quantity: 90,
					result: 'pass',
					resultText: '合格',
					inspectionTime: '2026-01-11 10:20',
				},
				{
					id: 'Q005',
					product: '产品D',
					quantity: 60,
					result: 'fail',
					resultText: '不合格',
					inspectionTime: '2026-01-11 09:30',
				}
			]
		};
	},
	computed: {
		// 计算合格率
		computedPassRate() {
			if (this.inspectionRecords.length === 0) return 0;
			const sum = this.inspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
			const passCount = this.inspectionRecords.filter(item => item.result === 'pass').reduce((acc, cur) => acc + cur.quantity, 0);
			return sum > 0 ? (passCount / sum * 100).toFixed(2) : '0.00';
		},
		// 计算今日合格率
		computedTodayPassRate() {
			const today = new Date().toLocaleDateString('zh-CN');
			const todayRecords = this.inspectionRecords.filter(item => item.inspectionTime.startsWith(today));
			if (todayRecords.length === 0) return 0;
			const sum = todayRecords.reduce((acc, cur) => acc + cur.quantity, 0);
			const passCount = todayRecords.filter(item => item.result === 'pass').reduce((acc, cur) => acc + cur.quantity, 0);
			return sum > 0 ? (passCount / sum * 100).toFixed(2) : '0.00';
		},
		// 计算今日检测数量
		todayInspections() {
			const today = new Date().toLocaleDateString('zh-CN');
			return this.inspectionRecords.filter(item => item.inspectionTime.startsWith(today)).reduce((acc, cur) => acc + cur.quantity, 0);
		},
		// 计算今日合格数量
		rejectCount() {
			const today = new Date().toLocaleDateString('zh-CN');
			return this.inspectionRecords.filter(item => item.inspectionTime.startsWith(today) && item.result === 'pass').reduce((acc, cur) => acc + cur.quantity, 0);
		},
		// 计算总检测数量
		totalInspections() {
			return this.inspectionRecords.reduce((acc, cur) => acc + cur.quantity, 0);
		},
		// 计算总合格数量
		computedPassCount() {
			return this.inspectionRecords.filter(item => item.result === 'pass').reduce((acc, cur) => acc + cur.quantity, 0);
		}
	},
	methods: {
		// 打开新建质检弹出层
		openNewInspection() {
			// 重置表单数据
			this.inspectionForm = {
				product: '',
				quantity: '',
				result: 'pass'
			};
			this.$refs.newInspectionPopup.open('center');
		},
		
		// 关闭新建质检弹出层
		closeNewInspection() {
			this.$refs.newInspectionPopup.close();
		},
		
		// 处理检测结果变化
		onResultChange(e) {
			this.inspectionForm.result = e.detail.value;
		},
		
		// 提交新建质检
		submitNewInspection() {
			// 简单的表单验证
			if (!this.inspectionForm.product.trim()) {
				uni.showToast({ title: '请输入产品名称', icon: 'none' });
				return;
			}
			if (!this.inspectionForm.quantity || isNaN(this.inspectionForm.quantity) || parseInt(this.inspectionForm.quantity) <= 0) {
				uni.showToast({ title: '请输入有效的检测数量', icon: 'none' });
				return;
			}
			
			// 生成新的质检ID
			const newId = 'Q' + (this.inspectionRecords.length + 1).toString().padStart(3, '0');
			
			// 构建新的质检记录
			const newRecord = {
				id: newId,
				product: this.inspectionForm.product,
				quantity: parseInt(this.inspectionForm.quantity),
				result: this.inspectionForm.result,
				resultText: this.inspectionForm.result === 'pass' ? '合格' : '不合格',
				inspectionTime: new Date().toLocaleString('zh-CN'),
				defects: []
			};
			
			// 添加到质检记录列表
			this.inspectionRecords.unshift(newRecord);
			
			// 关闭弹窗
			this.closeNewInspection();
			
			// 显示成功提示
			uni.showToast({ 
				title: '质检记录添加成功', 
				icon: 'success' 
			});
		},
		
		openQualityReport() {
			this.$refs.qualityReportPopup.open('center');
		},
		
		closeQualityReport() {
			this.$refs.qualityReportPopup.close();
		},
		
		deleteInspection(index) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条质检记录吗？',
				confirmText: '删除',
				confirmColor: '#ff2d55',
				success: (res) => {
					if (res.confirm) {
						this.inspectionRecords.splice(index, 1);
						uni.showToast({
							title: '删除成功',
							icon: 'success'
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
	/*display: flex;
	gap: 15rpx;*/
	position: fixed; /* 固定定位核心属性，必加 */
  	top: 86%;      /* 距离屏幕顶部的距离 */
    left: 20rpx;     /* 距离屏幕左侧的距离 */
  /* 可选补充，必加！防止被遮挡+样式错乱 */
  	background: #fff;/* 加白色背景，防止和下方内容重叠穿透 */
    bottom: 0; left: 0; width: 100%;
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