<template>
	<view class="execution-page">
		<view class="particles">
			<view class="particle" v-for="n in 10" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		<!-- 页面标题 -->
		<view class="page-header">
			<view class="header-content">
				<view class="page-title-section">
					<text class="page-title">工序进度</text>
					<text class="page-subtitle">Production Process</text>
				</view>
			</view>
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

// 格式化日期时间为 YYYY-MM-DD HH:MM:SS 格式
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
					
					const productName = this.selectedTask.name || '未知产品';
					const qty = this.outputForm.quantity || 0;
					const rejectQty = this.outputForm.rejectQuantity || 0;
					
					console.log('质检记录数据:', {
						record_id: recordId,
						product: productName,
						quantity: qty,
						qual: qualified,
						unqual: rejectQty,
						inspection_time: formatDateTime(new Date())
					});
					
					api.quality.createQuality({
						record_id: recordId,
						product: productName,
						quantity: qty,
						qual: qualified,
						unqual: rejectQty,
						inspection_time: formatDateTime(new Date())
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
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 50%, #d4d8dc 100%);
	min-height: 100vh;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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

.page-header {
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

.page-title-section {
	display: flex;
	flex-direction: column;
}

.page-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #2c3e50;
}

.page-subtitle {
	font-size: 20rpx;
	color: #95a5a6;
	letter-spacing: 1rpx;
	margin-top: 4rpx;
}

.header-actions {
	display: flex;
	align-items: center;
}

.refresh-btn {
	background: rgba(201, 169, 98, 0.1);
	border: none;
	padding: 16rpx;
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.3s ease;
}

.refresh-btn:active {
	background: rgba(201, 169, 98, 0.2);
	transform: rotate(180deg);
}

.refresh-icon {
	font-size: 28rpx;
	color: #c9a962;
}

.stats-cards {
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
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	transition: all 0.3s ease;
}

.stat-card:active {
	transform: scale(0.98);
}

.stat-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #6c757d;
	font-weight: 500;
}

.stat-value {
	font-size: 48rpx;
	font-weight: 700;
	color: #2c3e50;
}

.stat-footer {
	display: flex;
	justify-content: flex-end;
}

.stat-unit {
	font-size: 22rpx;
	color: #95a5a6;
}


.progress-bar {
	width: 100%;
	height: 12rpx;
	background: rgba(201, 169, 98, 0.15);
	border-radius: 6rpx;
	overflow: hidden;
	margin-top: 16rpx;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #c9a962 0%, #d4b896 100%);
	border-radius: 6rpx;
	transition: width 0.5s ease;
}


.quick-actions {
	display: flex;
	gap: 20rpx;
	margin-bottom: 24rpx;
	position: relative;
	z-index: 10;
}

.action-item {
	flex: 1;
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	cursor: pointer;
	transition: all 0.3s ease;
	border: 1rpx solid rgba(255, 255, 255, 0.6);
}

.action-item:active {
	transform: scale(0.98);
	background: rgba(201, 169, 98, 0.1);
}

.action-icon {
	font-size: 48rpx;
	margin-bottom: 16rpx;
}

.action-text {
	font-size: 26rpx;
	color: #495057;
	font-weight: 500;
}


.section {
	margin-bottom: 30rpx;
	position: relative;
	z-index: 10;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 20rpx;
	display: block;
}

.task-list {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	overflow: hidden;
	border: 1rpx solid rgba(255, 255, 255, 0.6);
}

.task-item {
	padding: 24rpx;
	border-bottom: 1rpx solid rgba(201, 169, 98, 0.1);
}

.task-item:last-child {
	border-bottom: none;
}

.task-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.task-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #2c3e50;
}

.task-status {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: 500;
}

.task-status .status-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
}

.status-processing {
	background: rgba(0, 122, 255, 0.1);
	color: #007aff;
}

.status-processing .status-dot { background: #007aff; }

.status-pending {
	background: rgba(142, 142, 147, 0.1);
	color: #8e8e93;
}

.status-pending .status-dot { background: #8e8e93; }

.status-completed {
	background: rgba(76, 217, 100, 0.1);
	color: #4cd964;
}

.status-completed .status-dot { background: #4cd964; }

.task-details {
	display: flex;
	flex-wrap: wrap;
	gap: 24rpx;
}

.task-detail-item {
	font-size: 26rpx;
	color: #6c757d;
	display: flex;
	align-items: center;
	gap: 8rpx;
}


.device-list {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	overflow: hidden;
	border: 1rpx solid rgba(255, 255, 255, 0.6);
}

.device-item {
	padding: 24rpx;
	border-bottom: 1rpx solid rgba(201, 169, 98, 0.1);
}

.device-item:last-child {
	border-bottom: none;
}

.device-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.device-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #2c3e50;
}

.device-status {
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 8rpx 16rpx;
	border-radius: 16rpx;
}

.status-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
}

.status-running {
	background: rgba(76, 217, 100, 0.1);
}

.status-running .status-dot {
	background-color: #4cd964;
}

.status-running .status-text {
	color: #4cd964;
}

.status-idle {
	background: rgba(250, 173, 20, 0.1);
}

.status-idle .status-dot {
	background-color: #faad14;
}

.status-idle .status-text {
	color: #faad14;
}

.status-text {
	font-size: 24rpx;
	font-weight: 500;
}

.device-params {
	font-size: 24rpx;
	color: #95a5a6;
	word-break: break-all;
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
