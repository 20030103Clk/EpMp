<template>
	<view class="equipment-container">
		<view class="search-bar">
			<view class="search-input-wrapper">
				<input v-model="searchText" class="search-input" placeholder="搜索设备名称" />
				<text v-if="searchText" class="clear-btn" @click="clearSearch">×</text>
			</view>
			<view class="search-btn" @click="handleSearch">
				<text>搜索</text>
			</view>
		</view>

		<view class="add-btn" @click="openAddModal">
			<text class="add-icon">+</text>
			<text>添加设备</text>
		</view>

		<view class="equipment-list">
			<view v-for="item in equipmentList" :key="item.equioment_id" class="equipment-item">
				<view class="equipment-info">
					<text class="equipment-name">{{ item.equio }}</text>
					<text class="equipment-status" :class="getStatusClass(item.status)">{{ item.statusText }}</text>
				</view>
				<view class="equipment-actions">
					<text class="action-btn edit-btn" @click="editEquipment(item)">编辑</text>
					<text class="action-btn delete-btn" @click="deleteEquipment(item.equioment_id)">删除</text>
				</view>
			</view>
		</view>

		<view v-if="equipmentList.length === 0" class="empty-tip">
			<text>暂无设备数据</text>
		</view>

		<uni-load-more v-if="equipmentList.length > 0" :status="loadStatus" @clickLoadMore="loadMore" />

		<view v-if="showModal" class="modal-overlay" @click="closeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text>{{ isEdit ? '编辑设备' : '添加设备' }}</text>
					<text class="close-icon" @click="closeModal">×</text>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="form-label">设备编号</text>
						<input class="form-input" v-model="formData.equio" placeholder="请输入设备编号" :disabled="isEdit" />
					</view>
					<view class="form-item">
						<text class="form-label">设备状态</text>
						<view class="status-options">
							<text v-for="status in statusOptions" :key="status.value" 
								class="status-option" :class="{ active: formData.status === status.value }"
								@click="formData.status = status.value; formData.statusText = status.label">
								{{ status.label }}
							</text>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<text class="btn btn-cancel" @click="closeModal">取消</text>
					<text class="btn btn-confirm" @click="submitForm">{{ isEdit ? '保存修改' : '确认添加' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  equipment: {
    getEquipments: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/equipment${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        throw error;
      }
    },
    createEquipment: async (data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/equipment`,
          method: 'POST',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
          }
        });
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        throw error;
      }
    },
    updateEquipment: async (id, data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/equipment/${id}`,
          method: 'PUT',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
          }
        });
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        throw error;
      }
    },
    deleteEquipment: async (id) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/equipment/${id}`,
          method: 'DELETE'
        });
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data;
          } else if (response.data) {
            return response.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        throw error;
      }
    }
  }
};

export default {
	data() {
		return {
			searchText: '',
			equipmentList: [],
			showModal: false,
			isEdit: false,
			loadStatus: 'more',
			pageNum: 1,
			pageSize: 10,
			statusOptions: [
				{ value: 'running', label: '运行中' },
				{ value: 'idle', label: '待机' },
				{ value: 'maintenance', label: '维修中' },
				{ value: 'stopped', label: '已停机' }
			],
			formData: {
				equio: '',
				status: 'running',
				statusText: '运行中'
			},
			editData: {
				id: 0
			}
		};
	},
	onLoad() {
		this.loadEquipmentList(1);
	},
	methods: {
		getStatusClass(status) {
			switch (status) {
				case 'running': return 'status-running';
				case 'idle': return 'status-idle';
				case 'maintenance': return 'status-maintenance';
				case 'stopped': return 'status-stopped';
				default: return '';
			}
		},
		loadEquipmentList(page, keyword = '') {
			uni.showLoading({ title: '加载中...' });
			const params = { page, pageSize: this.pageSize };
			if (keyword.trim()) {
				params.equio = keyword;
			}
			api.equipment.getEquipments(params).then(res => {
				uni.hideLoading();
				if (res.success) {
					if (page === 1) {
						this.equipmentList = res.data.list.map(item => ({
							id: item.equioment_id,
							equioment_id: item.equioment_id,
							equio: item.equio,
							status: item.status,
							statusText: item.statusText
						}));
					} else {
						this.equipmentList = [...this.equipmentList, ...res.data.list.map(item => ({
							id: item.equioment_id,
							equioment_id: item.equioment_id,
							equio: item.equio,
							status: item.status,
							statusText: item.statusText
						}))];
					}
					this.loadStatus = res.data.list.length < this.pageSize ? 'noMore' : 'more';
				} else {
					uni.showToast({ title: '加载失败', icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		},
		handleSearch() {
			this.pageNum = 1;
			this.loadEquipmentList(1, this.searchText);
		},

		clearSearch() {
			this.searchText = '';
			this.pageNum = 1;
			this.loadEquipmentList(1, '');
		},
		openAddModal() {
			this.isEdit = false;
			this.formData.equio = '';
			this.formData.status = 'running';
			this.formData.statusText = '运行中';
			this.showModal = true;
		},
		editEquipment(item) {
			this.isEdit = true;
			this.editData.id = item.equioment_id;
			this.formData.equio = item.equio;
			this.formData.status = item.status;
			this.formData.statusText = item.statusText;
			this.showModal = true;
		},
		addEquipment() {
			if (!this.formData.equio.trim()) {
				uni.showToast({ title: '请输入设备编号', icon: 'none' });
				return;
			}
			uni.showLoading({ title: '提交中...' });
			api.equipment.createEquipment({
				equio: this.formData.equio,
				status: this.formData.status,
				statusText: this.formData.statusText
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({ title: '添加成功', icon: 'success' });
					this.closeModal();
					this.loadEquipmentList(1);
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '添加失败', icon: 'none' });
			});
		},
		updateEquipment() {
			uni.showLoading({ title: '提交中...' });
			api.equipment.updateEquipment(this.editData.id, {
				status: this.formData.status,
				statusText: this.formData.statusText
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({ title: '修改成功', icon: 'success' });
					this.closeModal();
					this.loadEquipmentList(1);
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '修改失败', icon: 'none' });
			});
		},
		deleteEquipment(id) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除该设备吗？',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '删除中...' });
						api.equipment.deleteEquipment(id).then(res => {
							uni.hideLoading();
							if (res.success) {
								uni.showToast({ title: '删除成功', icon: 'success' });
								this.loadEquipmentList(1);
							} else {
								uni.showToast({ title: res.message, icon: 'none' });
							}
						}).catch(error => {
							uni.hideLoading();
							uni.showToast({ title: '删除失败', icon: 'none' });
						});
					}
				}
			});
		},
		submitForm() {
			if (this.isEdit) {
				this.updateEquipment();
			} else {
				this.addEquipment();
			}
		},
		closeModal() {
			this.showModal = false;
			this.isEdit = false;
			this.formData.equio = '';
			this.formData.status = 'running';
			this.formData.statusText = '运行中';
			this.editData.id = 0;
		},
		loadMore() {
			if (this.loadStatus === 'more') {
				this.pageNum++;
				this.loadEquipmentList(this.pageNum);
			}
		}
	}
};
</script>

<style>
.equipment-container {
	padding: 20rpx;
	min-height: 100vh;
	background: #f5f7fa;
}

.search-bar {
	padding: 20rpx;
	display: flex;
	gap: 20rpx;
}

.search-input-wrapper {
	flex: 1;
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 12rpx;
	padding: 0 20rpx;
	height: 80rpx;
}

.search-input {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
	background: transparent;
}

.clear-btn {
	font-size: 40rpx;
	color: #999;
	padding: 0 10rpx;
}

.search-btn {
	background: #c9a962;
	color: #fff;
	padding: 0 40rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 12rpx;
	font-size: 28rpx;
	font-weight: 500;
}

.add-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #c9a962;
	color: #fff;
	padding: 28rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	font-size: 32rpx;
	font-weight: 500;
}

.add-btn .add-icon {
	font-size: 36rpx;
	margin-right: 10rpx;
}

.equipment-list {
	background: #fff;
	border-radius: 12rpx;
	overflow: hidden;
}

.equipment-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.equipment-item:last-child {
	border-bottom: none;
}

.equipment-info {
	flex: 1;
}

.equipment-info .equipment-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.equipment-info .equipment-status {
	font-size: 26rpx;
	color: #666;
}

.equipment-info .equipment-status.status-running {
	color: #4caf50;
}

.equipment-info .equipment-status.status-idle {
	color: #ff9800;
}

.equipment-info .equipment-status.status-maintenance {
	color: #f44336;
}

.equipment-info .equipment-status.status-stopped {
	color: #9e9e9e;
}

.equipment-actions {
	display: flex;
	gap: 16rpx;
}

.equipment-actions .action-btn {
	font-size: 26rpx;
	padding: 10rpx 20rpx;
	border-radius: 8rpx;
}

.equipment-actions .action-btn.edit-btn {
	background: #e3f2fd;
	color: #1976d2;
}

.equipment-actions .action-btn.delete-btn {
	background: #ffebee;
	color: #f44336;
}

.empty-tip {
	text-align: center;
	padding: 60rpx;
	color: #999;
	font-size: 28rpx;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.modal-content {
	width: 85%;
	max-width: 600rpx;
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.modal-header .close-icon {
	font-size: 44rpx;
	color: #999;
}

.modal-body {
	padding: 30rpx;
}

.form-item {
	margin-bottom: 30rpx;
}

.form-item .form-label {
	font-size: 28rpx;
	color: #666;
	display: block;
	margin-bottom: 16rpx;
}

.form-item .form-input {
	width: 100%;
	height: 80rpx;
	border: 1rpx solid #e0e0e0;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 30rpx;
	box-sizing: border-box;
}

.form-item .form-input[disabled] {
	background: #f5f5f5;
	color: #999;
}

.status-options {
	display: flex;
	gap: 20rpx;
}

.status-options .status-option {
	font-size: 26rpx;
	padding: 12rpx 28rpx;
	border-radius: 30rpx;
	background: #f5f5f5;
	color: #666;
	border: 1rpx solid #e0e0e0;
}

.status-options .status-option.active {
	background: #c9a962;
	color: #fff;
	border-color: #c9a962;
}

.modal-footer {
	display: flex;
	border-top: 1rpx solid #f0f0f0;
}

.modal-footer .btn {
	flex: 1;
	text-align: center;
	padding: 28rpx;
	font-size: 30rpx;
}

.modal-footer .btn.btn-cancel {
	color: #666;
	border-right: 1rpx solid #f0f0f0;
}

.modal-footer .btn.btn-confirm {
	color: #c9a962;
	font-weight: 500;
}
</style>
