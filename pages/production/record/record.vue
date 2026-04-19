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
					<view class="record-header">
						<text class="record-id">记录#{{ record.id }}</text>
						<text class="record-product">{{ record.productName }}</text>
					</view>
					<view class="record-content">
						<view class="content-row">
							<text class="label">产品名称：</text>
							<text class="value">{{ record.productName }}</text>
						</view>
						<view class="content-row">
							<text class="label">产量：</text>
							<text class="value">{{ record.quantity }} 件</text>
						</view>
						<view class="content-row">
							<text class="label">合格数量：</text>
							<text class="value pass">{{ record.qualifiedQuantity }} 件</text>
						</view>
						<view class="content-row">
							<text class="label">不合格数量：</text>
							<text class="value fail">{{ record.rejectQuantity }} 件</text>
						</view>
						<view class="content-row">
							<text class="label">合格率：</text>
							<text class="value pass">{{ record.qualifiedRate }}%</text>
						</view>
						<view class="content-row">
							<text class="label">使用设备：</text>
							<text class="value">{{ record.equipmentName }}</text>
						</view>
						<view class="content-row">
							<text class="label">上报时间：</text>
							<text class="value">{{ record.reportTime }}</text>
						</view>
						<view class="content-row">
							<text class="label">操作人员：</text>
							<text class="value">{{ record.reportPerson }}</text>
						</view>
						<view class="content-row" v-if="record.remark">
							<text class="label">备注：</text>
							<text class="value">{{ record.remark }}</text>
						</view>
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
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  record: {
    getRecords: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/record${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
        console.log('Get records API response:', response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        console.error('Get records error:', error);
        throw error;
      }
    }
  },
  equipment: {
    getEquipments: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/equipment${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
        console.log('Get equipments API response:', response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        console.error('Get equipments error:', error);
        throw error;
      }
    }
  }
};
export default {
	name: 'RecordPage',
	data() {
		return {
			filterDevices: [
				{ id: 0, name: '全部设备' },
				{ id: 1, name: '生产线1' },
				{ id: 2, name: '生产线2' },
				{ id: 3, name: '生产线3' }
			],
			filters: {
				productName: '',
				equipmentName: '',
				reportDate: ''
			},
			equipmentFilterIndex: 0,
			productionRecords: []
		};
	},
	computed: {
		filteredRecords() {
			// 确保 productionRecords 是一个数组
			const records = Array.isArray(this.productionRecords) ? this.productionRecords : Object.values(this.productionRecords);
			return records.filter(record => {
				// 产品名称过滤
				if (this.filters.productName && !record.productName.includes(this.filters.productName)) {
					return false;
				}
				// 设备过滤 - 当设备名称为空字符串或"全部设备"时不过滤
				if (this.filters.equipmentName && this.filters.equipmentName.trim() && this.filters.equipmentName !== '全部设备' && record.equipmentName !== this.filters.equipmentName) {
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
		this.initData();
	},
	onShow() {
		this.loadRecords();
	},
	methods: {
		initData() {
			this.loadRecords();
			this.loadEquipments();
		},

		loadRecords() {
			uni.showLoading({ title: '加载中...' });
			api.record.getRecords().then(res => {
				uni.hideLoading();
				// 检查响应格式，确保 res.data 存在且有 list 属性
				if (res && res.success && res.data && res.data.list) {
					const records = res.data.list;
					if (records.length > 0) {
						this.productionRecords = records.map(record => {
							const output = record.output || 0;
							const qual = record.qual || 0;
							const unqual = record.unqual || 0;
							const qualifiedRate = output > 0 ? Math.round((qual / output) * 100 * 10) / 10 : 0;

							return {
								id: record.record_id,
								productName: record.product || '未知产品',
								quantity: output,
								qualifiedQuantity: qual,
								rejectQuantity: unqual,
								qualifiedRate: qualifiedRate,
								equipmentId: record.equio,
								equipmentName: record.equio || '未知设备',
								reportTime: record.date ? this.formatDate(record.date) : '未知时间',
								reportPerson: record.name || '未知人员',
								remark: record.md || ''
							};
						});
					} else {
						// 如果没有数据，设置为空数组
						this.productionRecords = [];
					}
				} else {
					uni.showToast({ title: '加载失败', icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		},

		formatDate(dateStr) {
			if (!dateStr) return '';
			const date = new Date(dateStr);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		},

		loadEquipments() {
			api.equipment.getEquipments().then(res => {
				if (res.success) {
					this.filterDevices = [
						{ id: 0, name: '全部设备' },
						...res.data.list.map(equip => ({
							id: equip.equioment_id,
							name: equip.equio
						}))
					];
				}
			});
		},

		onEquipmentFilterChange(e) {
			this.equipmentFilterIndex = e.detail.value;
			// 当选择"全部设备"时，设置设备名称为空字符串，以便在查询时不传递设备过滤参数
			this.filters.equipmentName = this.equipmentFilterIndex === 0 ? '' : this.filterDevices[this.equipmentFilterIndex].name;
			// 当选择"全部设备"时，重新加载所有记录
			if (this.equipmentFilterIndex === 0) {
				this.searchRecords();
			}
		},

		onDateChange(e) {
			this.filters.reportDate = e.detail.value;
		},

		resetFilters() {
			this.filters = {
				productName: '',
				equipmentName: '',
				reportDate: ''
			};
			this.equipmentFilterIndex = 0;
		},

		searchRecords() {
			uni.showLoading({ title: '查询中...' });
			const params = {};
			if (this.filters.productName) params.product = this.filters.productName;
			// 只有当 equipmentName 不为空字符串且不是"全部设备"时，才设置 params.equio
			if (this.filters.equipmentName && this.filters.equipmentName.trim() && this.filters.equipmentName !== '全部设备') params.equio = this.filters.equipmentName;
			if (this.filters.reportDate) params.date = this.filters.reportDate;

			api.record.getRecords(params).then(res => {
				uni.hideLoading();
				// 检查响应格式，确保 res.data 存在且有 list 属性
				if (res && res.success && res.data && res.data.list) {
					const records = res.data.list;
					if (records.length > 0) {
						this.productionRecords = records.map(record => {
							const output = record.output || 0;
							const qual = record.qual || 0;
							const unqual = record.unqual || 0;
							const qualifiedRate = output > 0 ? Math.round((qual / output) * 100 * 10) / 10 : 0;

							return {
								id: record.record_id,
								productName: record.product || '未知产品',
								quantity: output,
								qualifiedQuantity: qual,
								rejectQuantity: unqual,
								qualifiedRate: qualifiedRate,
								equipmentId: record.equio,
								equipmentName: record.equio || '未知设备',
								reportTime: record.date ? this.formatDate(record.date) : '未知时间',
								reportPerson: record.name || '未知人员',
								remark: record.md || ''
							};
						});
					} else {
						// 如果没有数据，设置为空数组
						this.productionRecords = [];
					}
				} else {
					uni.showToast({ title: '查询失败', icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
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

.record-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #F0F2F5;
}

.record-id {
	font-size: 24rpx;
	font-weight: bold;
	color: #1D2129;
}

.record-product {
	font-size: 28rpx;
	font-weight: bold;
	color: #1890FF;
}

.record-content {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.content-row {
	display: flex;
	align-items: center;
}

.label {
	font-size: 24rpx;
	color: #86909C;
	width: 140rpx;
}

.value {
	font-size: 24rpx;
	color: #1D2129;
	flex: 1;
}

.value.pass {
	color: #52C41A;
}

.value.fail {
	color: #FF4D4F;
}

.empty-state {
	padding: 60rpx 20rpx;
	text-align: center;
}

.empty-text {
	font-size: 28rpx;
	color: #86909C;
}

</style>