<template>
	<view class="container">
		<view class="header">
			<text class="title">生产计划管理</text>
			<button class="add-btn" @click="addPlan" v-if="isAdmin">+ 新增计划</button>
			<uni-popup ref="popup" :mask-click="false" background="rgba(0, 0, 0, 0.6)">
				<view class="popup-wrapper">
					<view class="popup-header">
						<text class="popup-title">新增生产计划</text>
						<uni-icons type="close" size="28" @click="close" class="close-icon"></uni-icons>
					</view>
					<view class="popup-content">
						<view class="form-item">
							<text class="form-label">产品名称</text>
							<input type="text" v-model="form.product" class="form-input" />
						</view>
						<view class="form-item">
							<text class="form-label">计划数量</text>
							<input type="number" v-model="form.quantity" class="form-input" />
						</view>
						<view class="form-item">
							<text class="form-label">开始时间</text>
							<uni-datetime-picker type="date" v-model="form.startDate" class="form-picker" />
						</view>
						<view class="form-item">
							<text class="form-label">结束时间</text>
							<uni-datetime-picker type="date" v-model="form.endDate" class="form-picker" />
						</view>
						<view class="form-item">
							<text class="form-label">生产状态</text>
							<view class="example-body">
								<uni-data-select label="状态" :localdata="statusOptions" placeholder="请选择状态" v-model="form.status" clearable></uni-data-select>
							</view>
						</view>
						<view class="form-item">
							<text class="form-label">生产进度</text>
							<view class="example-body">
								<uni-data-select label="进度" :localdata="candidates" placeholder="请选择进度" v-model="form.progress" clearable></uni-data-select>
							</view>
						</view>
					</view>
					<view class="popup-footer">
						<button class="cancel-btn" @click="close">取消</button>
						<button class="submit-btn" @click="submitPlan">提交</button>
					</view>
				</view>
			</uni-popup>
		</view>
		
		<view class="filter-section">
			<view class="filter-item">
				<text class="filter-label">状态：</text>
				<view class="filter-options">
					<text class="filter-option" :class="{ active: selectedStatus === 'all' }" @click="selectedStatus = 'all'">全部</text>
					<text class="filter-option" :class="{ active: selectedStatus === 'pending' }" @click="selectedStatus = 'pending'">待生产</text>
					<text class="filter-option" :class="{ active: selectedStatus === 'processing' }" @click="selectedStatus = 'processing'">生产中</text>
					<text class="filter-option" :class="{ active: selectedStatus === 'completed' }" @click="selectedStatus = 'completed'">已完成</text>
				</view>
			</view>
		</view>
		
		<view class="plan-list">
			<view class="plan-item" v-for="(plan, index) in filteredPlans" :key="index">
				<view class="plan-header">
					<text class="plan-id">计划#{{ plan.id }}</text>
					<text class="plan-status" :class="plan.status">{{ plan.statusText }}</text>
				</view>
				
				<view class="plan-content">
					<view class="content-row">
						<text class="label">产品名称：</text>
						<text class="value">{{ plan.product }}</text>
					</view>
					<view class="content-row">
						<text class="label">计划数量：</text>
						<text class="value">{{ plan.quantity }} 件</text>
					</view>
					<view class="content-row">
						<text class="label">开始时间：</text>
						<text class="value">{{ plan.startDate }}</text>
					</view>
					<view class="content-row">
						<text class="label">结束时间：</text>
						<text class="value">{{ plan.endDate }}</text>
					</view>
					<view class="content-row">
						<text class="label">生产进度：</text>
						<view class="progress-container">
							<view class="progress-bar" :style="{ width: plan.progress + '%' }"></view>
						</view>
						<text class="progress-text">{{ plan.progress }}%</text>
					</view>
				</view>
				
				<view class="plan-actions">
					<button class="action-btn edit" @click="editPlan(plan)" v-if="plan.status === 'processing' && isAdmin">编辑</button>
					<button class="action-btn delete" @click="deletePlan(plan.id)" v-if="isAdmin">删除</button>
					<button class="action-btn start" v-if="plan.status === 'pending'" @click="startProduction(plan.id)">开始生产</button>
					<button class="action-btn complete" v-if="plan.status === 'processing'" @click="completeProduction(plan.id)">完成生产</button>
				</view>
			</view>
			

			<uni-popup ref="editPopup" :mask-click="false" background="rgba(0, 0, 0, 0.6)">
				<view class="popup-wrapper">
					<view class="popup-header">
						<text class="popup-title">编辑生产进度</text>
						<uni-icons type="close" size="28" @click="close1" class="close-icon"></uni-icons>
					</view>
					<view class="popup-content">
						<text class="form-label">计划#{{ currentPlan.id }}</text>
						<view class="form-item">
						<text class="form-label">当前进度</text>
						<view class="example-body">
							<uni-data-select label="进度" :localdata="candidates" placeholder="请选择进度" v-model="form.progress" clearable></uni-data-select>
						</view>
						<view class="animation-container">
							<view class="wave-animation">
								<view class="wave"></view>
								<view class="wave" style="animation-delay: 0.3s"></view>
								<view class="wave" style="animation-delay: 0.6s"></view>
							</view>
						</view>
					</view>
						<button class="submit-btn" @click="saveProgress">完成</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  plan: {
    getPlans: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/plan${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
        console.log('Get plans API response:', response);
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
        console.error('Get plans error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    },
    createPlan: async (data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/plan`,
          method: 'POST',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Create plan API response:', response);
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
        console.error('Create plan error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    },
    updatePlan: async (id, data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/plan/${id}`,
          method: 'PUT',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Update plan API response:', response);
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
        console.error('Update plan error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    },
    deletePlan: async (id) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/plan/${id}`,
          method: 'DELETE'
        });
        console.log('Delete plan API response:', response);
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
        console.error('Delete plan error:', error);
        // 重新抛出错误，让调用者处理
        throw error;
      }
    }
  }
};
export default {
	data() {
		return {
			selectedStatus: 'all',
			form: {
				product: '',
				quantity: '',
				startDate: '',
				endDate: '',
				status: '',
				statusText: '',
				progress: '0%'
			},
			currentPlan: {},
			plans: [],
			statusOptions: [
				{ value: 'pending', text: '待生产' },
				{ value: 'processing', text: '生产中' },
				{ value: 'completed', text: '已完成' }
			],
			candidates: [
				{ text: '0%', value: '0%' },
				{ text: '10%', value: '10%' },
				{ text: '20%', value: '20%' },
				{ text: '30%', value: '30%' },
				{ text: '40%', value: '40%' },
				{ text: '50%', value: '50%' },
				{ text: '60%', value: '60%' },
				{ text: '70%', value: '70%' },
				{ text: '80%', value: '80%' },
				{ text: '90%', value: '90%' },
				{ text: '100%', value: '100%' }
			]
		};
	},
	onLoad() {
		// 检查登录状态
		const userInfo = uni.getStorageSync('userInfo');
		if (!userInfo) {
			// 未登录，跳转到登录页面
			//uni.redirectTo({ url: '/pages/production/login/login' });
		}
		// === API调用 ===
		this.loadPlans();
	},
	onShow() {
		// 每次页面显示时重新加载数据，确保删除计划后能更新显示
		this.loadPlans();
	},
	computed: {
		filteredPlans() {
			if (this.selectedStatus === 'all') {
				return this.plans;
			}
			return this.plans.filter(plan => plan.status === this.selectedStatus);
		},
		isAdmin() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo && userInfo.level === 1;
		}
	},
	methods: {
		loadPlans() {
			uni.showLoading({ title: '加载中...' });
			api.plan.getPlans().then(res => {
				uni.hideLoading();
				if (res.success) {
					this.plans = res.data.list.map(plan => {
						// 根据状态生成状态文本
						let statusText = plan.statusText;
						if (!statusText) {
							const statusMap = {
								'pending': '待生产',
								'processing': '生产中',
								'completed': '已完成'
							};
							statusText = statusMap[plan.status] || '未知状态';
						}
						
						// 规范化状态值
						let status = plan.status;
						if (!['pending', 'processing', 'completed'].includes(status)) {
							// 根据进度判断状态
							if (plan.progress === 0) {
								status = 'pending';
							} else if (plan.progress === 100) {
								status = 'completed';
							} else {
								status = 'processing';
							}
						}
						
						return {
							id: plan.plan_id,
							product: plan.product,
							quantity: plan.quantity,
							startDate: plan.startDate,
							endDate: plan.endDate,
							status: status,
							statusText: statusText,
							progress: plan.progress
						};
					});
				} else {
					uni.showToast({ title: '加载失败', icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		},
		addPlan() {
			this.form = {
				product: '',
				quantity: '',
				startDate: '',
				endDate: '',
				status: '',
				progress: '0%'
			};
			this.$refs.popup.open('center');
		},
		close() {
			this.$refs.popup.close();
		},
		close1() {
			this.$refs.editPopup.close();
		},
		onStatusChange(e) {
			this.form.status = e.detail.value;
		},
		submitPlan() {
			if (!this.form.product.trim()) {
				uni.showToast({ title: '请输入产品名称', icon: 'none' });
				return;
			}
			if (!this.form.quantity || isNaN(this.form.quantity) || parseInt(this.form.quantity) <= 0) {
				uni.showToast({ title: '请输入有效的计划数量', icon: 'none' });
				return;
			}
			if (!this.form.startDate) {
				uni.showToast({ title: '请选择开始时间', icon: 'none' });
				return;
			}
			if (!this.form.endDate) {
				uni.showToast({ title: '请选择结束时间', icon: 'none' });
				return;
			}
			if (!this.form.status) {
				uni.showToast({ title: '请选择计划状态', icon: 'none' });
				return;
			}
			
			// 获取进度数值
			const progress = parseInt(this.form.progress);
			
			// === API调用 ===
			uni.showLoading({ title: '提交中...' });
			api.plan.createPlan({
				product: this.form.product,
				quantity: parseInt(this.form.quantity),
				startDate: this.form.startDate,
				endDate: this.form.endDate,
				status: this.form.status,
				statusText: this.statusOptions.find(opt => opt.value === this.form.status).text,
				progress: progress
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({ 
						title: '计划提交成功', 
						icon: 'success' 
					});
					this.loadPlans(); // 重新加载计划列表
					this.close();
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '提交失败', icon: 'none' });
			});
		},
		editPlan(plan) {
			this.currentPlan = plan;
			this.form.progress = plan.progress + '%';
			this.$refs.editPopup.open('center');
		},
		
		// 保存进度修改
		saveProgress() {
			// 获取进度数值
			const progress = parseInt(this.form.progress);
			
			// === API调用 ===
			uni.showLoading({ title: '更新中...' });
			api.plan.updatePlan(this.currentPlan.id, {
				progress: progress,
				status: progress === 100 ? 'completed' : 'processing',
				statusText: progress === 100 ? '已完成' : '生产中'
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({
						title: '进度更新成功',
						icon: 'success'
					});
					this.loadPlans(); // 重新加载计划列表
					this.close1();
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '更新失败', icon: 'none' });
			});
		},
		startProduction(id) {
			// === API调用 ===
			uni.showLoading({ title: '更新中...' });
			api.plan.updatePlan(id, {
				status: 'processing',
				statusText: '生产中'
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({
						title: '已开始生产',
						icon: 'success'
					});
					this.loadPlans(); // 重新加载计划列表
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '更新失败', icon: 'none' });
			});
		},
		completeProduction(id) {
			// === API调用 ===
			uni.showLoading({ title: '更新中...' });
			api.plan.updatePlan(id, {
				status: 'completed',
				statusText: '已完成',
				progress: 100
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({
						title: '已完成生产',
						icon: 'success'
					});
					this.loadPlans(); // 重新加载计划列表
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '更新失败', icon: 'none' });
			});
		},
		deletePlan(id) {
			uni.showModal({
				title: '删除计划',
				content: '确定要删除这条计划吗？',
				confirmText: '删除',
				confirmColor: '#ff2d55',
				success: (res) => {
					if (res.confirm) {
						// === API调用 ===
						uni.showLoading({ title: '删除中...' });
						api.plan.deletePlan(id).then(res => {
							uni.hideLoading();
							if (res.success) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								this.loadPlans(); // 重新加载计划列表
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
	display: flex;
	justify-content: space-between;
	align-items: center;
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

.add-btn {
	padding: 12rpx 24rpx;
	background-color: #007aff;
	color: #fff;
	border: none;
	border-radius: 20rpx;
	font-size: 24rpx;
	margin-left: 40%;
	cursor: pointer;
}

.filter-section {
	padding: 20rpx;
	background-color: #fff;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.filter-item {
	display: flex;
	align-items: center;
}

.filter-label {
	font-size: 28rpx;
	color: #666;
	margin-right: 20rpx;
}

.filter-options {
	display: flex;
	gap: 15rpx;
}

.filter-option {
	padding: 8rpx 16rpx;
	font-size: 24rpx;
	color: #8e8e93;
	background-color: #f0f0f0;
	border-radius: 20rpx;
	cursor: pointer;
	transition: all 0.3s;
}

.filter-option.active {
	background-color: #007aff;
	color: #fff;
}

.plan-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	position: relative;
	z-index: 1;
}

.plan-item {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.plan-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.plan-id {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.plan-status {
	font-size: 24rpx;
	padding: 4rpx 12rpx;
	border-radius: 15rpx;
	font-weight: bold;
}

.plan-status.processing {
	background-color: #e8f0fe;
	color: #007aff;
}

.plan-status.pending {
	background-color: #f0f0f0;
	color: #8e8e93;
}

.plan-status.completed {
	background-color: #e8f8f5;
	color: #4cd964;
}

.plan-content {
	margin-bottom: 15rpx;
}

.content-row {
	display: flex;
	margin-bottom: 12rpx;
	align-items: center;
}

.label {
	font-size: 26rpx;
	color: #666;
	width: 150rpx;
}

.value {
	font-size: 26rpx;
	color: #333;
	flex: 1;
}

.progress-container {
	flex: 1;
	height: 10rpx;
	background-color: #f0f0f0;
	border-radius: 5rpx;
	margin: 0 15rpx;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background-color: #007aff;
	transition: width 0.3s ease;
}

.progress-text {
	font-size: 24rpx;
	color: #007aff;
	font-weight: bold;
}

.plan-actions {
	display: flex;
	justify-content: flex-end;
	gap: 10rpx;
	padding-top: 15rpx;
	border-top: 1rpx solid #f0f0f0;
}

.action-btn {
	padding: 10rpx 20rpx;
	border: 1rpx solid #007aff;
	border-radius: 20rpx;
	font-size: 22rpx;
	cursor: pointer;
	transition: all 0.3s;
}

.action-btn.view {
	background-color: #fff;
	color: #007aff;
}

.action-btn.edit {
	background-color: #fff;
	color: #ff9500;
	border-color: #ff9500;
}

.action-btn.start {
	background-color: #4cd964;
	color: #fff;
	border-color: #4cd964;
}

.action-btn.complete {
	background-color: #ff2d55;
	color: #fff;
	border-color: #ff2d55;
}
.action-btn.delete {
	background-color: #ff5c5c;
	color: #fff;
	border-color: #ff5c5c;
}
.action-btn:hover {
	opacity: 0.8;
}

.popup {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.popup-container {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 10rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}
.popup-header{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}
.select-wrapper {
    flex: 1;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    padding: 0 20rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
}

/* 美化的弹出层样式 */
.popup-wrapper {
    background-color: #fff;
    border-radius: 16rpx;
    width: 700rpx;
    max-width: 95vw;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 9999;
    position: relative;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    background-color: #f8f9fa;
    border-bottom: 1rpx solid #e9ecef;
}

.popup-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
}

.close-icon {
    color: #999;
    cursor: pointer;
    transition: color 0.3s;
}

.close-icon:hover {
    color: #333;
}

.popup-content {
    padding: 32rpx;
	width: 100%;
	background-color: #fff;
	border-radius: 10rpx;
	box-sizing: border-box;
}

.form-item {
    margin-bottom: 28rpx;
}

.form-row {
    display: flex;
    gap: 20rpx;
}

.form-item.half {
    flex: 1;
    margin-bottom: 28rpx;
}

.form-label {
    display: block;
    font-size: 26rpx;
    color: #333;
    margin-bottom: 12rpx;
    font-weight: 500;
}

.form-input {
    width: 100%;
    padding: 20rpx;
    border: 1rpx solid #e9ecef;
    border-radius: 10rpx;
    font-size: 26rpx;
    background-color: #fff;
    transition: all 0.3s;
    box-sizing: border-box;
}

.form-input:focus {
    border-color: #007aff;
    box-shadow: 0 0 0 2rpx rgba(0, 122, 255, 0.2);
}

/* 调整uni-data-picker和uni-datetime-picker的样式 */
.form-input.select-wrapper {
    width: 100%;
    padding: 0 20rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
}

/* 日期选择器样式 */
.form-picker {
    width: 100%;
    height: 80rpx;
    padding: 0 20rpx;
    border: 1rpx solid #e9ecef;
    border-radius: 10rpx;
    font-size: 26rpx;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    transition: all 0.3s;
}

.form-picker:focus {
    border-color: #007aff;
    box-shadow: 0 0 0 2rpx rgba(0, 122, 255, 0.2);
}

.popup-footer {
    display: flex;
    gap: 16rpx;
    padding: 24rpx 32rpx;
    background-color: #f8f9fa;
    border-top: 1rpx solid #e9ecef;
    justify-content: flex-end;
}

.cancel-btn, .submit-btn {
    padding: 16rpx 32rpx;
    border-radius: 10rpx;
    font-size: 26rpx;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
    min-width: 120rpx;
}

.cancel-btn {
    background-color: #fff;
    color: #6c757d;
    border: 1rpx solid #dee2e6;
}

.submit-btn {
    background-color: #007aff;
    color: #fff;
}

.cancel-btn:hover {
    background-color: #f8f9fa;
}

.submit-btn:hover {
    background-color: #0056b3;
}

/* 移除旧的弹出层样式 */
.popup-container {
    display: none;
}

.popup {
    display: none;
}
.example-body {
    padding: 12rpx;
    background-color: #FFFFFF;
    margin: 0;
    border: none;
}

/* 动画容器 */
.animation-container {
    margin: 20rpx 0;
    height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-radius: 20rpx;
    background-color: #f0f0f0;
}

/* 波浪动画 */
.wave-animation {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0,122,255,0.3) 0%, rgba(0,122,255,0.8) 50%, rgba(0,122,255,0.3) 100%);
    animation: wave 2s linear infinite;
    transform: translateX(-50%);
}

@keyframes wave {
    0% {
        transform: translateX(-50%) translateY(100%);
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
    }
}
</style>