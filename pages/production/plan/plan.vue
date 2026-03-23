<template>
	<view class="container">
		<view class="header">
			<text class="title">生产计划管理</text>
			<button class="add-btn" @click="addPlan">+ 新增计划</button>
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
					<button class="action-btn edit" @click="editPlan(plan)" v-if="plan.status === 'processing'">编辑</button>
					<button class="action-btn delete" @click="deletePlan(plan.id)">删除</button>
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
						</view>
						<button class="submit-btn" @click="saveProgress">完成</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
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
			plans: [
				{ id: 'P001', product: '产品A', quantity: 500, startDate: '2026-01-11', endDate: '2026-01-15', status: 'processing', statusText: '生产中', progress: 60 },
				{ id: 'P002', product: '产品B', quantity: 300, startDate: '2026-01-12', endDate: '2026-01-16', status: 'pending', statusText: '待生产', progress: 0 },
				{ id: 'P003', product: '产品C', quantity: 800, startDate: '2026-01-10', endDate: '2026-01-14', status: 'completed', statusText: '已完成', progress: 100 },
				{ id: 'P004', product: '产品D', quantity: 200, startDate: '2026-01-11', endDate: '2026-01-13', status: 'processing', statusText: '生产中', progress: 85 },
				{ id: 'P005', product: '产品E', quantity: 600, startDate: '2026-01-13', endDate: '2026-01-17', status: 'pending', statusText: '待生产', progress: 0 }
			],
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
        		{ text: '100%', value: '100%' },
				{ text:'' , value: ''},
				{ text:'' , value: ''},
				{ text:'' , value: ''},

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
	},
	computed: {
		filteredPlans() {
			if (this.selectedStatus === 'all') {
				return this.plans;
			}
			return this.plans.filter(plan => plan.status === this.selectedStatus);
		}
	},
	methods: {
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
			
			// 这里可以添加提交到后端的逻辑
			uni.showToast({ 
				title: '计划提交成功', 
				icon: 'success' 
			});

			this.plans.push({
				id: 'P00' + (this.plans.length + 1),
				product: this.form.product,
				quantity: parseInt(this.form.quantity),
				startDate: this.form.startDate,
				endDate: this.form.endDate,
				status: this.form.status,
				statusText: this.statusOptions.find(opt => opt.value === this.form.status).text,
				progress: progress
			});
			
			this.close();
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
			
			// 更新计划进度
			const plan = this.plans.find(p => p.id === this.currentPlan.id);
			if (plan) {
				plan.progress = progress;
				// 如果进度达到100%，自动完成生产
				if (progress === 100) {
					plan.status = 'completed';
					plan.statusText = '已完成';
				}
			}
			
			uni.showToast({
				title: '进度更新成功',
				icon: 'success'
			});
			

			this.close1();
		},
		startProduction(id) {
			const plan = this.plans.find(p => p.id === id);
			if (plan) {
				plan.status = 'processing';
				plan.statusText = '生产中';
				uni.showToast({
					title: '已开始生产',
					icon: 'success'
				});
			}
		},
		completeProduction(id) {
			const plan = this.plans.find(p => p.id === id);
			if (plan) {
				plan.status = 'completed';
				plan.statusText = '已完成';
				plan.progress = 100;
				uni.showToast({
					title: '已完成生产',
					icon: 'success'
				});
			}
		},
		deletePlan(id) {
			uni.showModal({
				title: '删除计划',
				content: '确定要删除这条计划吗？',
				confirmText: '删除',
				confirmColor: '#ff2d55',
				success: (res) => {
					if (res.confirm) {
						const index = this.plans.findIndex(p => p.id === id);
						if (index !== -1) {
							this.plans.splice(index, 1);
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
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
.action-btn delete {
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
    width: 600rpx;
    max-width: 90vw;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
    overflow: hidden;
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
	width: 540rpx;
	background-color: #fff;
	border-radius: 10rpx;
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
		padding: 12px;
		background-color: #FFFFFF;
	}
</style>