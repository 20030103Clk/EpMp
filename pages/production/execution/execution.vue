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
						<picker class="form-picker" @change="onEquipmentChange" :value="equipmentIndex" :range="runningDevices" :range-key="'name'">
							<view class="picker-value">{{ runningDevices[equipmentIndex]?.name || '请选择设备' }}</view>
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
export default {
	name: 'ExecutionPage',
	computed: {
		// 运行中的设备列表
		runningDevices() {
			return this.devices.filter(device => device.status === 'running');
		}
	},
	data() {
		// 从生产计划页面获取对应的数据结构
		const productionPlans = [
			{ id: 'P001', product: '产品A', quantity: 500, startDate: '2026-01-11', endDate: '2026-01-15', status: 'processing', statusText: '生产中', progress: 60 },
			{ id: 'P002', product: '产品B', quantity: 300, startDate: '2026-01-12', endDate: '2026-01-16', status: 'pending', statusText: '待生产', progress: 0 },
			{ id: 'P003', product: '产品C', quantity: 800, startDate: '2026-01-10', endDate: '2026-01-14', status: 'completed', statusText: '已完成', progress: 100 },
			{ id: 'P004', product: '产品D', quantity: 200, startDate: '2026-01-11', endDate: '2026-01-13', status: 'processing', statusText: '生产中', progress: 85 },
			{ id: 'P005', product: '产品E', quantity: 600, startDate: '2026-01-13', endDate: '2026-01-17', status: 'pending', statusText: '待生产', progress: 0 }
		];
		
		// 计算实时数据
		const processingPlans = productionPlans.filter(plan => plan.status === 'processing');
		const totalPlanQuantity = processingPlans.reduce((sum, plan) => sum + plan.quantity, 0);
		const totalCompleted = processingPlans.reduce((sum, plan) => sum + (plan.quantity * plan.progress / 100), 0);
		
		return {
			// 实时生产数据（基于生产计划计算）
			realtimeData: {
				currentProduction: Math.round(totalCompleted),
				productionEfficiency: totalCompleted/8,
				dailyTarget: totalPlanQuantity,
				completionRate: Math.round((totalCompleted / totalPlanQuantity) * 100) || 0
			},
			// 生产任务列表（与生产计划对应）
			productionTasks: productionPlans.map(plan => ({
				id: plan.id,
				name: plan.product,
				planQuantity: plan.quantity,
				completedQuantity: Math.round(plan.quantity * plan.progress / 100),
				status: plan.status,
				statusText: plan.statusText
			})),
			// 设备状态信息
			devices: [
				{
					id: 1,
					name: '生产线1',
					status: 'running',
					statusText: '运行中',
					params: '产品A'
				},
				{
					id: 2,
					name: '生产线2',
					status: 'running',
					statusText: '运行中',
					params: '产品D'
				},
				{
					id: 3,
					name: '生产线3',
					status: 'idle',
					statusText: '待机中',
					params: '准备生产产品B'
				}
			],
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
			// 从本地存储或API获取生产计划数据
			const savedPlans = uni.getStorageSync('productionPlan');
			if (savedPlans && savedPlans.length > 0) {
				// 这里可以根据保存的计划更新当前数据
				console.log('已加载保存的生产计划:', savedPlans);
			}
		},
		// 设备选择变更
		onEquipmentChange(e) {
			this.equipmentIndex = e.detail.value;
			// 更新设备ID到表单
			if (this.runningDevices[this.equipmentIndex]) {
				this.outputForm.equipmentId = this.runningDevices[this.equipmentIndex].id;
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
				equipmentId: this.runningDevices.length > 0 ? this.runningDevices[0].id : '',
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
			
			// 更新任务完成数量
			const taskIndex = this.productionTasks.findIndex(t => t.id === this.selectedTask.id);
			if (taskIndex !== -1) {
				this.productionTasks[taskIndex].completedQuantity += this.outputForm.quantity;
				// 如果完成数量超过计划数量，设置为计划数量
				if (this.productionTasks[taskIndex].completedQuantity > this.productionTasks[taskIndex].planQuantity) {
					this.productionTasks[taskIndex].completedQuantity = this.productionTasks[taskIndex].planQuantity;
				}
				// 如果完成数量达到计划数量，更新状态为已完成
				if (this.productionTasks[taskIndex].completedQuantity >= this.productionTasks[taskIndex].planQuantity) {
					this.productionTasks[taskIndex].status = 'completed';
					this.productionTasks[taskIndex].statusText = '已完成';
				}
			}
			
			// 保存生产记录
			this.saveProductionRecord();
			
			// 保存数据到本地存储
			uni.setStorageSync('productionTasks', this.productionTasks);
			
			// 显示成功提示
			uni.showToast({ title: '产量上报成功', icon: 'success' });
			
			// 关闭表单
			this.closeOutputPopup();
			
			// 更新实时数据
			this.calculateRealtimeData();
		},
		
		// 保存生产记录
		saveProductionRecord() {
			// 获取当前时间
			const now = new Date();
			const reportTime = now.toISOString().slice(0, 19).replace('T', ' ');
			
			// 计算合格率
			const totalQuantity = this.outputForm.quantity;
			const qualifiedQuantity = totalQuantity - this.outputForm.rejectQuantity;
			const qualifiedRate = totalQuantity > 0 ? Math.round((qualifiedQuantity / totalQuantity) * 100) : 0;
			
			// 获取设备名称
			const equipment = this.devices.find(device => device.id === this.outputForm.equipmentId);
			const equipmentName = equipment ? equipment.name : '未知设备';
			
			// 生成记录ID
			const recordId = 'R' + now.getTime().toString().slice(-6);
			
			// 创建生产记录
			const newRecord = {
				id: recordId,
				productName: this.selectedTask.name,
				quantity: this.outputForm.quantity,
				rejectQuantity: this.outputForm.rejectQuantity,
				qualifiedRate: qualifiedRate,
				equipmentId: this.outputForm.equipmentId,
				equipmentName: equipmentName,
				reportTime: reportTime,
				reportPerson: '当前用户', // 实际应用中应从登录信息获取
				remark: this.outputForm.remark
			};
			
			// 从本地存储获取现有记录
			const existingRecords = uni.getStorageSync('productionRecords') || [];
			// 添加新记录
			existingRecords.unshift(newRecord); // 新记录添加到最前面
			// 保存回本地存储
			uni.setStorageSync('productionRecords', existingRecords);
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
