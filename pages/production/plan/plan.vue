<template>
	<view class="container">
		<view class="particles">
			<view class="particle" v-for="n in 12" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		<view class="header">
			<view class="header-content">
				<view class="page-title">
					<text class="title">生产计划管理</text>
					<text class="subtitle">Production Plan Management</text>
				</view>
				<button class="add-btn" @click="addPlan" v-if="isAdmin">
					<uni-icons type="plus" size="24"></uni-icons>
					<text>新增计划</text>
				</button>
			</view>
		</view>
		
		<!-- 新增生产计划弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">新增生产计划</text>
				</view>
				<view class="popup-body">
					<view class="form-item">
						<text class="form-label">产品名称</text>
						<input type="text" v-model="form.product" class="form-input" placeholder="请输入产品名称" />
					</view>
					<view class="form-item">
						<text class="form-label">计划数量</text>
						<input type="number" v-model="form.quantity" class="form-input" placeholder="请输入计划数量" />
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
						<uni-data-select label="状态" :localdata="statusOptions" placeholder="请选择状态" v-model="form.status" clearable></uni-data-select>
					</view>
					<view class="form-item">
						<text class="form-label">生产进度</text>
						<uni-data-select label="进度" :localdata="candidates" placeholder="请选择进度" v-model="form.progress" clearable></uni-data-select>
					</view>
				</view>
				<view class="popup-footer">
					<button class="popup-btn cancel" @click="close">取消</button>
					<button class="popup-btn confirm" @click="submitPlan">提交</button>
				</view>
			</view>
		</uni-popup>
		
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
		</view>
		
		<!-- 编辑生产进度弹窗 -->
		<uni-popup ref="editPopup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">编辑生产进度</text>
				</view>
				<view class="popup-body">
					<view class="form-item">
						<text class="form-label">计划#{{ currentPlan.id }}</text>
					</view>
					<view class="form-item">
						<text class="form-label">当前进度</text>
						<uni-data-select label="进度" :localdata="candidates" placeholder="请选择进度" v-model="form.progress" clearable></uni-data-select>
					</view>
				</view>
				<view class="popup-footer">
					<button class="popup-btn cancel" @click="close1">取消</button>
					<button class="popup-btn confirm" @click="saveProgress">完成</button>
				</view>
			</view>
		</uni-popup>
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
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #d4d8dc 100%);
	min-height: 100vh;
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
	margin-bottom: 40rpx;
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

.page-title {
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

.add-btn {
	display: inline-flex;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 28rpx;
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	color: #fff;
	border: none;
	border-radius: 20rpx;
	font-size: 26rpx;
	font-weight: 500;
	cursor: pointer;
	box-shadow: 0 4rpx 16rpx rgba(201, 169, 98, 0.3);
	transition: all 0.3s ease;
	 height: 80rpx; 
}

.add-btn:active {
	transform: scale(0.96);
}

.filter-section {
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

.filter-item {
	display: flex;
	align-items: center;
}

.filter-label {
	font-size: 28rpx;
	color: #5a6672;
	font-weight: 500;
	margin-right: 20rpx;
}

.filter-options {
	display: flex;
	gap: 16rpx;
}

.filter-option {
	padding: 12rpx 24rpx;
	font-size: 26rpx;
	color: #6c757d;
	background: rgba(248, 249, 250, 0.8);
	border-radius: 24rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	border: 1rpx solid transparent;
}

.filter-option.active {
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	color: #fff;
	border-color: rgba(201, 169, 98, 0.3);
	box-shadow: 0 4rpx 12rpx rgba(201, 169, 98, 0.3);
}

.plan-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	position: relative;
	z-index: 10;
}

.plan-item {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	border-left: 6rpx solid #c9a962;
}

.plan-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid rgba(201, 169, 98, 0.15);
}

.plan-id {
	font-size: 32rpx;
	font-weight: 700;
	color: #2c3e50;
}

.plan-status {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
}

.plan-status .status-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
}

.plan-status.processing {
	background: rgba(0, 122, 255, 0.1);
	color: #007aff;
}

.plan-status.processing .status-dot { background: #007aff; }

.plan-status.pending {
	background: rgba(142, 142, 147, 0.1);
	color: #8e8e93;
}

.plan-status.pending .status-dot { background: #8e8e93; }

.plan-status.completed {
	background: rgba(76, 217, 100, 0.1);
	color: #4cd964;
}

.plan-status.completed .status-dot { background: #4cd964; }

.plan-content {
	margin-bottom: 20rpx;
}

.content-row {
	display: flex;
	margin-bottom: 16rpx;
	align-items: center;
}

.content-row:last-child {
	margin-bottom: 0;
}

.label {
	font-size: 26rpx;
	color: #6c757d;
	width: 160rpx;
	font-weight: 500;
}

.value {
	font-size: 26rpx;
	color: #2c3e50;
	flex: 1;
	font-weight: 400;
}

.progress-container {
	flex: 1;
	height: 16rpx;
	background: rgba(201, 169, 98, 0.15);
	border-radius: 8rpx;
	margin: 0 16rpx;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #c9a962 0%, #d4b896 100%);
	transition: width 0.3s ease;
	border-radius: 8rpx;
}

.progress-text {
	font-size: 26rpx;
	color: #c9a962;
	font-weight: 600;
	min-width: 80rpx;
	text-align: right;
}

.plan-actions {
	display: flex;
	justify-content: flex-end;
	gap: 16rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(201, 169, 98, 0.15);
}

.action-btn {
	display: flex;
	align-items: center;
	padding: 14rpx 28rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
	border: none;
}

.action-btn.view {
	background: rgba(0, 122, 255, 0.1);
	color: #007aff;
}

.action-btn.edit {
	background: rgba(255, 149, 0, 0.1);
	color: #ff9500;
}

.action-btn.start {
	background: linear-gradient(135deg, rgba(76, 217, 100, 0.9) 0%, rgba(142, 230, 173, 0.9) 100%);
	color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(76, 217, 100, 0.3);
}

.action-btn.complete {
	background: linear-gradient(135deg, rgba(255, 45, 85, 0.9) 0%, rgba(255, 114, 144, 0.9) 100%);
	color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(255, 45, 85, 0.3);
}

.action-btn.delete {
	background: rgba(255, 92, 92, 0.1);
	color: #ff5c5c;
}

.action-btn:active {
	transform: scale(0.96);
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
    padding-bottom: env(safe-area-inset-bottom);
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

/* 新的弹窗样式 */
.popup-content {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 30rpx;
	width: 600rpx;
	max-width: 90vw;
	padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #E5E6EB;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1D2129;
}

.popup-body {
	margin-bottom: 20rpx;
}

.popup-footer {
	display: flex;
	justify-content: flex-end;
}

.popup-btn {
	padding: 16rpx 40rpx;
	background-color: #007AFF;
	color: #FFFFFF;
	border: none;
	border-radius: 8rpx;
	font-size: 28rpx;
	font-weight: 500;
	margin-left: 16rpx;
	cursor: pointer;
	transition: all 0.3s ease;
}

.popup-btn:first-child {
	margin-left: 0;
}

.popup-btn.cancel {
	background-color: #F5F6F7;
	color: #4E5969;
}

.popup-btn.confirm {
	background-color: #007AFF;
	color: #FFFFFF;
}

.form-item {
	display: flex;
	flex-direction: column;
	margin-bottom: 24rpx;
}

.form-item:last-child {
	margin-bottom: 0;
}

.form-label {
	font-size: 26rpx;
	color: #86909C;
	margin-bottom: 12rpx;
}

.form-value {
	font-size: 28rpx;
	color: #1D2129;
	font-weight: 500;
}

.form-value.highlight {
	color: #c9a962;
}

.form-input {
	width: 100%;
	padding: 16rpx;
	border: 1rpx solid #E5E6EB;
	border-radius: 8rpx;
	font-size: 28rpx;
	color: #1D2129;
	box-sizing: border-box;
	background-color: #FFFFFF;
}

.form-picker {
	width: 100%;
	height: 76rpx;
	padding: 16rpx;
	border: 1rpx solid #E5E6EB;
	border-radius: 8rpx;
	font-size: 28rpx;
	background-color: #FFFFFF;
	box-sizing: border-box;
	display: flex;
	align-items: center;
}
</style>