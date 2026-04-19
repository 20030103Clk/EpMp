<template>
	<view class="execution-page">
		<!-- 页面标题 -->
		<view class="page-header">
			<text class="page-title">工序进度</text>
		</view>

		<!-- 实时数据卡片 -->
		<view class="stats-cards">
			<view class="stat-card">
				<view class="stat-header">
					<text class="stat-label">当前产量</text>
					<text class="stat-value">{{ realtimeData.currentProduction }}</text>
				</view>
				<view class="stat-footer">
					<text class="stat-unit">件</text>
				</view>
			</view>

			<view class="stat-card">
				<view class="stat-header">
					<text class="stat-label">生产效率</text>
					<text class="stat-value">{{ realtimeData.productionEfficiency }}</text>
				</view>
				<view>
					<text class="stat-label">(每天8小时标准)</text>
				</view>
				<view class="stat-footer">
					<text class="stat-unit">件/小时</text>
				</view>
			</view>

			<view class="stat-card">
				<view class="stat-header">
					<text class="stat-label">目标</text>
					<text class="stat-value">{{ realtimeData.dailyTarget }}</text>
				</view>
				<view class="stat-footer">
					<text class="stat-unit">件</text>
				</view>
			</view>

			<view class="stat-card">
				<view class="stat-header">
					<text class="stat-label">完成率</text>
					<text class="stat-value">{{ realtimeData.completionRate }}%</text>
				</view>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: realtimeData.completionRate + '%' }"></view>
				</view>
			</view>
		</view>

		<!-- 生产任务列表 -->
		<view class="section">
			<text class="section-title">当前生产任务</text>
			<view class="task-list">
				<view class="task-item" v-for="task in productionTasks" :key="task.id">
					<view class="task-info">
						<text class="task-name">{{ task.name }}</text>
						<text class="task-status" :class="'status-' + task.status">{{ task.statusText }}</text>
					</view>
					<view class="task-details">
						<text class="task-detail-item">计划数量: {{ task.planQuantity }}件</text>
						<text class="task-detail-item">已完成: {{ task.completedQuantity }}件</text>
					</view>
					<view class="task-actions" v-if="task.status === 'processing'">
						<button class="action-btn report" @click="reportOutput(task)">上报产量</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 设备状态信息 -->
		<view class="section">
			<text class="section-title">设备状态</text>
			<view class="device-list">
				<view class="device-item" v-for="device in devices" :key="device.id">
					<view class="device-info">
						<text class="device-name">{{ device.name }}</text>
						<view class="device-status" :class="'status-' + device.status">
							<view class="status-dot"></view>
							<text class="status-text">{{ device.statusText }}</text>
						</view>
					</view>
					<text class="device-params">{{ device.params }}</text>
				</view>
			</view>
		</view>
		<!-- 快捷操作 -->
		<view class="quick-actions">
			<view class="action-item" @click="reportIssue">
				<view class="action-icon">⚠️</view>
				<text class="action-text">报告异常</text>
			</view>
		</view>
		
		<!-- 报告异常弹出层 -->
		<uni-popup ref="issuePopup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">报告异常</text>
				</view>
				<view class="popup-body">
					<text class="popup-message">维护部门电话：185 **** ****</text>
				</view>
				<view class="popup-footer">
					<button class="popup-btn" @click="closePopup">确认</button>
				</view>
			</view>
		</uni-popup>
		
		<!-- 产量上报表单 -->
		<uni-popup ref="outputPopup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">产量上报</text>
				</view>
				<view class="popup-body">
					<view class="form-item">
						<text class="form-label">产品名称</text>
						<text class="form-value">{{ selectedTask?.name }}</text>
					</view>
					<view class="form-item">
						<text class="form-label">产出数量</text>
						<input type="number" v-model.number="outputForm.quantity" class="form-input" placeholder="请输入产出数量" />
					</view>
					<view class="form-item">
						<text class="form-label">不合格数量</text>
						<input type="number" v-model.number="outputForm.rejectQuantity" class="form-input" placeholder="请输入不合格数量" />
					</view>
					<view class="form-item">
					<text class="form-label">使用设备</text>
					<picker class="form-picker" @change="onEquipmentChange" :value="equipmentIndex" :range="allDevices" :range-key="'name'">
						<view class="picker-value">{{ allDevices[equipmentIndex]?.name || '请选择设备' }}</view>
					</picker>
				</view>
					<view class="form-item">
						<text class="form-label">备注</text>
						<textarea v-model="outputForm.remark" class="form-textarea" placeholder="请输入备注信息" />
					</view>
				</view>
				<view class="popup-footer">
					<button class="popup-btn cancel" @click="closeOutputPopup">取消</button>
					<button class="popup-btn confirm" @click="submitOutput">提交</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

// API 调用对象
const api = {
  equipment: {
    getEquipments: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/equipment${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
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
        // 重新抛出错误，让调用者处理
        throw error;
      }
    }
  },
  plan: {
    getPlans: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/plan${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        });
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
        // 重新抛出错误，让调用者处理
        throw error;
      }
    },
    updatePlan: async (id, data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/plan/${id}`,
          method: 'PUT',
          data: data,
          header: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
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
        // 重新抛出错误，让调用者处理
        throw error;
      }
    }
  },
  record: {
    createRecord: async (data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/record`,
          method: 'POST',
          data: data,
          header: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        });
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
        // 重新抛出错误，让调用者处理
        throw error;
      }
    }
  },
  quality: {
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
	name: 'ExecutionPage',
	computed: {
		// 所有设备列表（用于选择）
		allDevices() {
			return this.devices;
		}
	},
	data() {
		return {
			// 实时生产数据（基于生产计划计算）
			realtimeData: {
				currentProduction: 0,
				productionEfficiency: 0,
				dailyTarget: 0,
				completionRate: 0
			},
			// 生产任务列表（与生产计划对应）
			productionTasks: [],
			// 设备状态信息
			devices: [],
			// 上报产量表单数据
			selectedTask: null,
			outputForm: {
				quantity: 0,
				rejectQuantity: 0,
				equipmentId: '',
				remark: ''
			},
			// 设备选择索引
			equipmentIndex: 0
		};
	},
	onLoad() {
		// 初始化数据
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			// 加载设备列表
			this.loadDevices();
			// 加载生产计划
			this.loadProductionPlans();
		},
		
		// 加载设备列表
		loadDevices() {
			api.equipment.getEquipments().then(res => {
				console.log('设备列表响应:', res);
				if (res && res.success && res.data && res.data.list) {
					this.devices = res.data.list.map(equip => ({
						id: equip.equioment_id,
						name: equip.equio,
						status: equip.status === '运行中' || equip.status === '运行' ? 'running' : 'idle',
						statusText: equip.status,
						params: equip.statusText || '正常运行'
					}));
					console.log('设备列表已加载:', this.devices);
				}
			}).catch(error => {
				console.error('加载设备列表失败:', error);
			});
		},
		
		// 加载生产计划
		loadProductionPlans() {
			api.plan.getPlans().then(res => {
				console.log('生产计划响应:', res);
				if (res && res.success && res.data && res.data.list) {
					this.productionTasks = res.data.list.map(plan => ({
						id: plan.plan_id,
						name: plan.product,
						planQuantity: plan.quantity,
						completedQuantity: Math.round(plan.quantity * plan.progress / 100),
						status: plan.status,
						statusText: plan.statusText
					}));
					console.log('生产计划已加载:', this.productionTasks);
					// 计算实时数据
					this.calculateRealtimeData();
				}
			}).catch(error => {
				console.error('加载生产计划失败:', error);
			});
		},
		
		// 设备选择变更
		onEquipmentChange(e) {
			this.equipmentIndex = e.detail.value;
			// 更新设备名称到表单（外键约束要求使用设备名称）
			if (this.allDevices[this.equipmentIndex]) {
				this.outputForm.equipmentId = this.allDevices[this.equipmentIndex].name;
			}
		},
		// 报告异常
		reportIssue() {
			// 显示报告异常弹出层
			this.$refs.issuePopup.open();
		},
		
		// 关闭弹出层
		closePopup() {
			this.$refs.issuePopup.close();
		},
		
		// 打开产量上报表单
		reportOutput(task) {
			this.selectedTask = task;
			// 初始化表单数据
			this.outputForm = {
				quantity: 0,
				rejectQuantity: 0,
				equipmentId: this.allDevices.length > 0 ? this.allDevices[0].name : '',
				remark: ''
			};
			// 初始化设备选择索引
			this.equipmentIndex = 0;
			// 显示产量上报表单
			this.$refs.outputPopup.open();
		},
		
		// 关闭产量上报表单
		closeOutputPopup() {
			this.$refs.outputPopup.close();
			this.selectedTask = null;
		},
		
		// 提交产量上报
		submitOutput() {
			if (this.outputForm.quantity <= 0) {
				uni.showToast({ title: '请输入有效产量', icon: 'none' });
				return;
			}
			
			if (!this.outputForm.equipmentId) {
				uni.showToast({ title: '请选择生产设备', icon: 'none' });
				return;
			}
			
			// === API调用 ===
			uni.showLoading({ title: '提交中...' });
			const qualified = this.outputForm.quantity - this.outputForm.rejectQuantity;

			// 从本地存储获取用户信息
			const userInfo = uni.getStorageSync('userInfo');
			const username = userInfo && userInfo.username ? userInfo.username : '默认用户';

			api.record.createRecord({
				plan_id: this.selectedTask.id,
				product: this.selectedTask.name,
				output: this.outputForm.quantity,
				unqual: this.outputForm.rejectQuantity,
				qual: qualified,
				equio: this.outputForm.equipmentId,
				date: formatDate(new Date()),
				name: username,
				md: this.outputForm.remark
			}).then(res => {
				uni.hideLoading();
				console.log('创建记录响应:', JSON.stringify(res));
				if (res && res.success && res.data && res.data.insertId) {
					// 创建质检记录
					const recordId = res.data.insertId;
					console.log('创建质检记录，record_id:', recordId);
					api.quality.createQuality({
						record_id: recordId,
						product: this.selectedTask.name,
						quantity: this.outputForm.quantity,
						qual: qualified,
						unqual: this.outputForm.rejectQuantity,
						inspection_time: formatDate(new Date())
					}).then(qualityRes => {
						console.log('创建质检记录响应:', JSON.stringify(qualityRes));
					}).catch(qualityError => {
						console.error('创建质检记录失败:', qualityError);
					});
					
					// 更新任务完成数量
					const taskIndex = this.productionTasks.findIndex(t => t.id === this.selectedTask.id);
					if (taskIndex !== -1) {
						// 计算新的完成数量
						const newCompletedQuantity = this.productionTasks[taskIndex].completedQuantity + this.outputForm.quantity;
						// 计算新的进度
						const newProgress = Math.round((newCompletedQuantity / this.productionTasks[taskIndex].planQuantity) * 100);
						// 确保进度不超过100%
						const finalProgress = Math.min(newProgress, 100);
						// 确保完成数量不超过计划数量
						const finalCompletedQuantity = Math.min(newCompletedQuantity, this.productionTasks[taskIndex].planQuantity);
						// 更新本地任务数据
						this.productionTasks[taskIndex].completedQuantity = finalCompletedQuantity;
						
						// 检查是否完成
						let newStatus = this.productionTasks[taskIndex].status;
						let newStatusText = this.productionTasks[taskIndex].statusText;
						if (finalProgress === 100) {
							newStatus = 'completed';
							newStatusText = '已完成';
						}
						
						// 更新后端计划数据
						api.plan.updatePlan(this.selectedTask.id, {
							progress: finalProgress,
							status: newStatus,
							statusText: newStatusText
						}).catch(error => {
							console.error('更新计划失败:', error);
						});
						
						// 更新本地任务状态
						this.productionTasks[taskIndex].status = newStatus;
						this.productionTasks[taskIndex].statusText = newStatusText;
					}
					
					// 显示成功提示
					uni.showToast({ title: '产量上报成功', icon: 'success' });
					
					// 关闭表单
					this.closeOutputPopup();
					
					// 更新实时数据
					this.calculateRealtimeData();
				} else {
					const errorMsg = res ? res.message : '提交失败';
					uni.showToast({ title: errorMsg, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				console.error('提交产量上报失败:', error);
				uni.showToast({ title: '提交失败', icon: 'none' });
			});
		},
		
		// 计算实时数据
		calculateRealtimeData() {
			// 计算当前产量
			const currentProduction = this.productionTasks.reduce((sum, task) => sum + task.completedQuantity, 0);
			// 计算生产效率（假设已工作4小时）
			const productionEfficiency = currentProduction / 4;
			// 计算今日目标（生产中任务的计划数量）
			const dailyTarget = this.productionTasks.filter(task => task.status === 'processing').reduce((sum, task) => sum + task.planQuantity, 0);
			// 计算完成率
			const completionRate = dailyTarget > 0 ? Math.round((currentProduction / dailyTarget) * 100) : 0;
			
			// 更新实时数据
			this.realtimeData = {
				currentProduction,
				productionEfficiency,
				dailyTarget,
				completionRate
			};
		}
	}
};
</script>

<style scoped>
.execution-page {
	padding: 20rpx;
	background-color: #F7F8FA;
	min-height: 100vh;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.page-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1D2129;
}

.header-actions {
	display: flex;
	align-items: center;
}

.refresh-btn {
	background: none;
	border: none;
	padding: 10rpx;
	border-radius: 50%;
	background-color: #FFFFFF;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	cursor: pointer;
	transition: all 0.3s ease;
}

.refresh-btn:hover {
	transform: rotate(180deg);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.refresh-icon {
	font-size: 28rpx;
}

.stats-cards {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.stat-card {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
}

.stat-card:hover {
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
	transform: translateY(-2rpx);
}

.stat-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 10rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #86909C;
	font-weight: 500;
}

.stat-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #1D2129;
}

.stat-footer {
	display: flex;
	justify-content: flex-end;
}

.stat-unit {
	font-size: 22rpx;
	color: #86909C;
}


.progress-bar {
	width: 100%;
	height: 6rpx;
	background-color: #F0F0F0;
	border-radius: 3rpx;
	overflow: hidden;
	margin-top: 10rpx;
}

.progress-fill {
	height: 100%;
	background-color: #36CFC9;
	border-radius: 3rpx;
	transition: width 0.5s ease;
}


.quick-actions {
	display: flex;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.action-item {
	flex: 1;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 25rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	cursor: pointer;
	transition: all 0.3s ease;
}

.action-item:hover {
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
	transform: translateY(-2rpx);
}

.action-icon {
	font-size: 48rpx;
	margin-bottom: 15rpx;
}

.action-text {
	font-size: 24rpx;
	color: #1D2129;
	font-weight: 500;
}


.task-list {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	overflow: hidden;
	margin-bottom: 20rpx;
}

.task-item {
	padding: 20rpx;
	border-bottom: 1rpx solid #F0F2F5;
}

.task-item:last-child {
	border-bottom: none;
}

.task-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.task-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1D2129;
}

.task-status {
	font-size: 20rpx;
	padding: 6rpx 16rpx;
	border-radius: 12rpx;
	font-weight: 500;
}

.status-processing {
	background-color: #E6F7FF;
	color: #1890FF;
}

.status-pending {
	background-color: #F0F0F0;
	color: #8E8E93;
}

.status-completed {
	background-color: #F6FFED;
	color: #52C41A;
}

.task-details {
	display: flex;
	gap: 20rpx;
}

.task-detail-item {
	font-size: 22rpx;
	color: #86909C;
}


.device-list {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	overflow: hidden;
	margin-bottom: 20rpx;
}

.device-item {
	padding: 20rpx;
	border-bottom: 1rpx solid #F0F2F5;
}

.device-item:last-child {
	border-bottom: none;
}

.device-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.device-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1D2129;
}

.device-status {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.status-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
}

.status-running .status-dot {
	background-color: #52C41A;
}

.status-idle .status-dot {
	background-color: #FAAD14;
}

.status-text {
	font-size: 22rpx;
	color: #86909C;
}

.device-params {
	font-size: 22rpx;
	color: #86909C;
	word-break: break-all;
}


.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1D2129;
	margin-bottom: 15rpx;
	display: block;
}


.section {
	margin-bottom: 30rpx;
}

/* 响应式调整 */
@media (max-width: 768rpx) {
	.stats-cards {
		grid-template-columns: 1fr;
	}
	
	.task-details {
		flex-direction: column;
		gap: 5rpx;
	}
	
	.quick-actions {
		flex-direction: column;
	}
	
	.action-item {
		flex-direction: row;
		justify-content: center;
		gap: 10rpx;
		padding: 20rpx;
	}
	
	.action-icon {
		font-size: 36rpx;
		margin-bottom: 0;
	}
}


.popup-content {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 30rpx;
	width: 600rpx;
	max-width: 90vw;
	box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #F0F2F5;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1D2129;
}

.popup-close {
	font-size: 36rpx;
	color: #86909C;
	cursor: pointer;
	transition: color 0.3s ease;
}

.popup-close:hover {
	color: #1D2129;
}

.popup-body {
	margin-bottom: 20rpx;
}

.popup-message {
	font-size: 28rpx;
	color: #1D2129;
	line-height: 1.5;
	text-align: center;
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
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.popup-btn:hover {
	background-color: #0056b3;
}

/* 产量上报表单样式 */
.form-item {
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.form-label {
	font-size: 28rpx;
	color: #1D2129;
	font-weight: 500;
}

.form-value {
	font-size: 28rpx;
	color: #1890FF;
	font-weight: 600;
}

.form-input {
	padding: 16rpx;
	border: 1rpx solid #E5E6EB;
	border-radius: 8rpx;
	font-size: 28rpx;
	background-color: #FAFAFA;
	transition: all 0.3s ease;
}

.form-input:focus {
	border-color: #1890FF;
	background-color: #FFFFFF;
	box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
}

.form-picker {
	padding: 16rpx;
	border: 1rpx solid #E5E6EB;
	border-radius: 8rpx;
	background-color: #FAFAFA;
	transition: all 0.3s ease;
}

.form-picker:focus {
	border-color: #1890FF;
	background-color: #FFFFFF;
	box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
}

.picker-value {
	font-size: 28rpx;
	color: #1D2129;
}

.form-textarea {
	padding: 16rpx;
	border: 1rpx solid #E5E6EB;
	border-radius: 8rpx;
	font-size: 28rpx;
	background-color: #FAFAFA;
	min-height: 120rpx;
	transition: all 0.3s ease;
	resize: vertical;
}

.form-textarea:focus {
	border-color: #1890FF;
	background-color: #FFFFFF;
	box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
}

.popup-footer {
	display: flex;
	justify-content: space-between;
	margin-top: 30rpx;
}

.popup-btn.cancel {
	background-color: #F5F5F5;
	color: #1D2129;
}

.popup-btn.cancel:hover {
	background-color: #E5E6EB;
}

.popup-btn.confirm {
	background-color: #1890FF;
	color: #FFFFFF;
}

.popup-btn.confirm:hover {
	background-color: #096DD9;
}

/* 上报按钮样式 */
.task-actions {
	margin-top: 15rpx;
	text-align: right;
}

.action-btn {
	padding: 10rpx 20rpx;
	border: none;
	border-radius: 8rpx;
	font-size: 24rpx;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s ease;
}

.action-btn.report {
	background-color: #1890FF;
	color: #FFFFFF;
}

.action-btn.report:hover {
	background-color: #096DD9;
	transform: translateY(-1rpx);
}

</style>
