<template>
	<view class="record-page">
		<!-- 页面标题 -->
		<view class="page-header">
			<text class="page-title">生产记录</text>
		</view>

		<!-- 查询和过滤区域 -->
		<view class="filter-section">
			<view class="filter-row">
				<view class="filter-item">
					<text class="filter-label">产品名称</text>
					<input type="text" v-model="filters.productName" class="filter-input" placeholder="请输入产品名称" />
				</view>
				<view class="filter-item">
					<text class="filter-label">使用设备</text>
					<picker class="filter-picker" @change="onEquipmentFilterChange" :value="equipmentFilterIndex" :range="filterDevices" :range-key="'name'">
						<view class="picker-value">{{ equipmentFilterIndex === 0 ? '全部设备' : filterDevices[equipmentFilterIndex].name }}</view>
					</picker>
				</view>
			</view>
			<view class="filter-row">
				<view class="filter-item">
					<text class="filter-label">上报日期</text>
					<picker class="filter-picker" mode="date" :value="filters.reportDate" @change="onDateChange">
						<view class="picker-value">{{ filters.reportDate || '选择日期' }}</view>
					</picker>
				</view>
				<view class="filter-actions">
					<button class="filter-btn search" @click="searchRecords">查询</button>
					<button class="filter-btn reset" @click="resetFilters">重置</button>
				</view>
			</view>
		</view>

		<!-- 生产记录列表 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">产量上报记录</text>
				<text class="record-count">共 {{ filteredRecords.length }} 条记录</text>
			</view>
			<view class="record-list">
				<view class="record-item" v-for="record in filteredRecords" :key="record.id">
					<view class="record-row main-info">
						<text class="record-field product">{{ record.productName }}</text>
						<text class="record-field equipment">{{ record.equipmentName }}</text>
					</view>
					<view class="record-row secondary-info">
						<text class="record-field time">{{ record.reportTime }}</text>
						<text class="record-field operator">{{ record.reportPerson }}</text>
					</view>
				</view>
				<view class="empty-state" v-if="filteredRecords.length === 0">
					<text class="empty-text">暂无生产记录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'RecordPage',
	data() {
		return {
			// 设备列表（用于过滤）
			filterDevices: [
				{ id: 0, name: '全部设备' },
				{ id: 1, name: '生产线1' },
				{ id: 2, name: '生产线2' },
				{ id: 3, name: '生产线3' }
			],
			// 过滤条件
			filters: {
				productName: '',
				equipmentId: 0,
				reportDate: ''
			},
			// 设备过滤索引
			equipmentFilterIndex: 0,
			// 生产记录数据
			productionRecords: [
				{
					id: 'R001',
					productName: '产品A',
					quantity: 100,
					rejectQuantity: 5,
					qualifiedRate: 95,
					equipmentId: 1,
					equipmentName: '生产线1',
					reportTime: '2026-01-19 09:30:00',
					reportPerson: '张三',
					remark: '正常生产'
				},
				{
					id: 'R002',
					productName: '产品A',
					quantity: 120,
					rejectQuantity: 3,
					qualifiedRate: 97.5,
					equipmentId: 1,
					equipmentName: '生产线1',
					reportTime: '2026-01-19 11:30:00',
					reportPerson: '张三',
					remark: '生产效率提升'
				},
				{
					id: 'R003',
					productName: '产品D',
					quantity: 80,
					rejectQuantity: 2,
					qualifiedRate: 97.5,
					equipmentId: 2,
					equipmentName: '生产线2',
					reportTime: '2026-01-19 10:00:00',
					reportPerson: '李四',
					remark: '设备运行稳定'
				},
				{
					id: 'R004',
					productName: '产品D',
					quantity: 90,
					rejectQuantity: 1,
					qualifiedRate: 98.9,
					equipmentId: 2,
					equipmentName: '生产线2',
					reportTime: '2026-01-19 14:00:00',
					reportPerson: '李四',
					remark: '无异常'
				},
				{
					id: 'R005',
					productName: '产品A',
					quantity: 110,
					rejectQuantity: 4,
					qualifiedRate: 96.4,
					equipmentId: 1,
					equipmentName: '生产线1',
					reportTime: '2026-01-19 16:00:00',
					reportPerson: '张三',
					remark: '接近目标产量'
				}
			]
		};
	},
	computed: {
		// 过滤后的记录
		filteredRecords() {
			return this.productionRecords.filter(record => {
				// 产品名称过滤
				if (this.filters.productName && !record.productName.includes(this.filters.productName)) {
					return false;
				}
				// 设备过滤
				if (this.filters.equipmentId && record.equipmentId !== this.filters.equipmentId) {
					return false;
				}
				// 日期过滤
				if (this.filters.reportDate) {
					const recordDate = record.reportTime.split(' ')[0];
					if (recordDate !== this.filters.reportDate) {
						return false;
					}
				}
				return true;
			});
		}
	},
	onLoad() {
		// 初始化数据
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			// 从本地存储获取生产记录（如果有）
			const savedRecords = uni.getStorageSync('productionRecords');
			if (savedRecords && savedRecords.length > 0) {
				this.productionRecords = savedRecords;
			}
		},
		
		// 设备过滤变更
		onEquipmentFilterChange(e) {
			this.equipmentFilterIndex = e.detail.value;
			this.filters.equipmentId = this.filterDevices[this.equipmentFilterIndex].id;
		},
		
		// 日期选择变更
		onDateChange(e) {
			this.filters.reportDate = e.detail.value;
		},
		
		// 重置过滤条件
		resetFilters() {
			this.filters = {
				productName: '',
				equipmentId: 0,
				reportDate: ''
			};
			this.equipmentFilterIndex = 0;
		}
	}
};
</script>

<style scoped>
.record-page {
	padding: 20rpx;
	background-color: #F7F8FA;
	min-height: 100vh;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.page-header {
	margin-bottom: 20rpx;
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1D2129;
}

/* 过滤区域样式 */
.filter-section {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	margin-bottom: 20rpx;
}

.filter-row {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
	flex-wrap: wrap;
}

.filter-row:last-child {
	margin-bottom: 0;
	align-items: center;
}

.filter-item {
	flex: 1;
	min-width: 200rpx;
	margin-bottom: 0;
}

.filter-label {
	display: block;
	font-size: 24rpx;
	color: #86909C;
	font-weight: 500;
	margin-bottom: 10rpx;
}

.filter-input, .filter-picker {
	padding: 18rpx;
	border: 1rpx solid #E5E6EB;
	border-radius: 8rpx;
	font-size: 28rpx;
	background-color: #FAFAFA;
	transition: all 0.3s ease;
	width: 100%;
	box-sizing: border-box;
	height: 76rpx;
	line-height: 40rpx;
}

.filter-input:focus, .filter-picker:focus {
	border-color: #1890FF;
	background-color: #FFFFFF;
	box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
}

.filter-actions {
	display: flex;
	gap: 10rpx;
	align-items: center;
	justify-content: flex-end;
    margin-top: 40rpx;
}

.filter-btn {
	padding: 0 32rpx;
	border: none;
	border-radius: 8rpx;
	font-size: 28rpx;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	box-sizing: border-box;
	height: 76rpx;
	line-height: 76rpx;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.filter-btn.search {
	background-color: #1890FF;
	color: #FFFFFF;
}

.filter-btn.search:hover {
	background-color: #096DD9;
}

.filter-btn.reset {
	background-color: #F5F5F5;
	color: #1D2129;
}

.filter-btn.reset:hover {
	background-color: #E5E6EB;
}

/* 记录列表样式 */
.section {
	margin-bottom: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1D2129;
}

.record-count {
	font-size: 24rpx;
	color: #86909C;
}

.record-list {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	overflow: hidden;
}

.record-item {
	padding: 20rpx;
	border-bottom: 1rpx solid #F0F2F5;
	transition: all 0.3s ease;
}

.record-item:hover {
	background-color: #F7F8FA;
}

.record-item:last-child {
	border-bottom: none;
}

.record-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.record-row:last-child {
	margin-bottom: 0;
}

.record-row.main-info {
	font-weight: 600;
}

.record-field {
	font-size: 24rpx;
	color: #1D2129;
}

.record-field.product {
	font-size: 28rpx;
	font-weight: bold;
	color: #1D2129;
}

.record-field.equipment {
	font-size: 26rpx;
	color: #1890FF;
}

.record-field.time, .record-field.operator {
	font-size: 22rpx;
	color: #86909C;
}

/* 空状态样式 */
.empty-state {
	padding: 60rpx 20rpx;
	text-align: center;
}

.empty-text {
	font-size: 28rpx;
	color: #86909C;
}

</style>