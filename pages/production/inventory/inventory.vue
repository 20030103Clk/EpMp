<template>
	<view class="container">
		<view class="header">
			<text class="title">库存管理</text>
			<button type="text" class="add-btn" @click="addproduct">添加产品</button>
			<uni-search-bar @confirm="search" :focus="true" v-model="searchValue" @blur="blur" @focus="focus" @input="input"
				@cancel="cancel" @clear="clear">
			</uni-search-bar>
		</view>
		
		<view class="inventory-stats">
			<view class="stat-card">
				<text class="stat-title">总库存</text>
				<text class="stat-value"> {{ totalInventory }} </text>
				<text class="stat-unit">件</text>
			</view>
		</view>
		
		<view class="inventory-section">
			<view class="section-header">
				<text class="section-title">库存列表</text>
			</view>
			
			<view class="inventory-list">
				<view class="inventory-item" v-for="(item, index) in filterItems" :key="index">
					<view class="item-header">
						<text class="item-name">{{ item.product }}</text>
						<text class="item-code">{{ item.code }}</text>
					</view>
					
					<view class="item-details">
						<view class="detail-row">
							<text class="detail-label">当前库存：</text>
							<text class="detail-value">{{ item.currentStock }} 件</text>
						</view>
						<view class="detail-row">
							<text class="detail-label">安全库存：</text>
							<text class="detail-value">{{ item.safeStock }} 件</text>
						</view>
						<view class="detail-row">
							<text class="detail-label">单位：</text>
							<text class="detail-value">{{ item.unit }}</text>
						</view>
						<view class="detail-row">
							<text class="detail-label">库存位置：</text>
							<text class="detail-value">{{ item.location }}</text>
						</view>
					</view>
					
					<view class="item-actions">
						<button class="action-btn" @click="viewInventory(item)">查看详情</button>
						<button class="delete-btn" @click="deleteInventory(index)">&nbsp;&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;</button>
					</view>
		</view>
		</view>
		
		<!-- 查看库存详情弹出层 -->
		<uni-popup ref="popup" :mask-click="false" background="rgba(0, 0, 0, 0.6)">
			<view class="simple-popup">
				<view class="popup-header">
					<text class="popup-title">库存详情</text>
					<uni-icons type="close" size="28" @click="closepopup" class="close-icon"></uni-icons>
				</view>
				<view class="popup-content">
					<view class="detail-item">
						<text class="detail-label">产品名称</text>
						<text class="detail-value">{{ currentInventory.product }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">产品编号</text>
						<text class="detail-value">{{ currentInventory.code }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">当前库存</text>
						<text class="detail-value highlight">{{ currentInventory.currentStock }} 件</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">安全库存</text>
						<text class="detail-value">{{ currentInventory.safeStock }} 件</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">库存单位</text>
						<text class="detail-value">{{ currentInventory.unit }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">库存位置</text>
						<text class="detail-value">{{ currentInventory.location }}</text>
					</view>
				</view>
				<view class="popup-footer">
					<button type="primary" @click="closepopup" class="action-btn">关闭</button>
				</view>
			</view>
		</uni-popup>
		
		<!-- 添加产品弹出层 -->
		<uni-popup ref="addPopup" :mask-click="false" background="rgba(0, 0, 0, 0.6)">
			<view class="simple-popup">
				<view class="popup-header">
					<text class="popup-title">添加产品</text>
					<uni-icons type="close" size="28" @click="closeAddPopup" class="close-icon"></uni-icons>
				</view>
				<view class="popup-content">
					<view class="form-item">
						<text class="form-label">产品名称</text>
						<input type="text" v-model="newProduct.product" class="form-input" placeholder="请输入产品名称" />
					</view>
					<view class="form-item">
						<text class="form-label">产品编号</text>
						<input type="text" v-model="newProduct.code" class="form-input" placeholder="请输入产品编号" />
					</view>
					<view class="form-item">
						<text class="form-label">初始库存</text>
						<input type="number" v-model="newProduct.currentStock" class="form-input" placeholder="请输入初始库存" />
					</view>
					<view class="form-item">
						<text class="form-label">安全库存</text>
						<input type="number" v-model="newProduct.safeStock" class="form-input" placeholder="请输入安全库存" />
					</view>
					<view class="form-item">
						<text class="form-label">库存位置</text>
						<input type="text" v-model="newProduct.location" class="form-input" placeholder="请输入库存位置" />
					</view>
				</view>
				<view class="popup-footer">
					<button type="default" @click="closeAddPopup" class="action-btn">取消</button>
					<button type="primary" @click="submitProduct" class="action-btn">确定</button>
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
			searchValue: '',
			currentInventory: {},
			newProduct: {
				product: '',
				code: '',
				currentStock: 0,
				safeStock: 0,
				unit: '件',
				location: ''
			},
			inventoryItems: [
				{
					product: '产品A',
					code: 'PROD-A001',
					currentStock: 2500,
					safeStock: 500,
					unit: '件',
					location: '仓库A-1区'
				},
				{
					product: '产品B',
					code: 'PROD-B001',
					currentStock: 1200,
					safeStock: 300,
					unit: '件',
					location: '仓库A-2区'
				},
				{
					product: '产品C',
					code: 'PROD-C001',
					currentStock: 350,
					safeStock: 500,
					unit: '件',
					location: '仓库B-1区'
				},
				{
					product: '产品D',
					code: 'PROD-D001',
					currentStock: 4200,
					safeStock: 1000,
					unit: '件',
					location: '仓库B-2区'
				}
			]
		};
	},
	computed : {
		totalInventory(){
			if(this.inventoryItems.length === 0) return 0;
			return this.inventoryItems.reduce((sum, item) => sum + (Number(item.currentStock) || 0), 0);
		},
		filterItems(){
			if(this.searchValue === '') return this.inventoryItems;
			const keyword = this.searchValue.trim().toLowerCase();
			return this.inventoryItems.filter(item => item.product.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword))
		}
	},
	methods: {
		viewInventory(itemid) {
			const code = itemid.code;
			this.currentInventory = this.filterItems.find(item => item.code === code) || {}; 
			this.$refs.popup.open();
			uni.showToast({
				title: `查看库存#${code}`,
				icon: 'none'
			});
		},
		closepopup() {
			this.$refs.popup.close();
		},
		addproduct() {
			this.$refs.addPopup.open('center');
		},
		closeAddPopup() {
			this.$refs.addPopup.close();
			this.newProduct = {
				product: '',
				code: '',
				currentStock: 0,
				safeStock: 0,
				unit: '件',
				location: ''
			};
		},
		submitProduct() {
			if (!this.newProduct.product.trim()) {
				uni.showToast({
					title: '请输入产品名称',
					icon: 'none'
				});
				return;
			}
			if (!this.newProduct.code.trim()) {
				uni.showToast({
					title: '请输入产品编号',
					icon: 'none'
				});
				return;
			}
			if (this.newProduct.currentStock < 0) {
				uni.showToast({
					title: '初始库存不能为负数',
					icon: 'none'
				});
				return;
			}
			if (this.newProduct.safeStock < 0) {
				uni.showToast({
					title: '安全库存不能为负数',
					icon: 'none'
				});
				return;
			}
			
			this.inventoryItems.push({
				...this.newProduct
			});
			
			this.closeAddPopup();
			
			uni.showToast({
				title: '产品添加成功',
				icon: 'success'
			});
		},

		deleteInventory(index) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条库存记录吗？',
				confirmText: '删除',
				confirmColor: '#ff2d55',
				success: (res) => {
					if (res.confirm) {
						this.inventoryItems.splice(index, 1);
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

.inventory-stats {
	display: grid;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.stat-card {
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
}

.stat-unit {
	font-size: 24rpx;
	color: #8e8e93;
	margin-left: 8rpx;
}

.inventory-section {
	background-color: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
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

.inventory-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.inventory-item {
	background-color: #f9f9f9;
	border-radius: 8rpx;
	padding: 15rpx;
}

.item-header {
	display: flex;
	flex-direction: column;
	gap: 5rpx;
	margin-bottom: 12rpx;
}

.item-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.item-code {
	font-size: 24rpx;
	color: #666;
}

.item-details {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
	margin-bottom: 15rpx;
}

.detail-row {
	display: flex;
	align-items: center;
}

.detail-label {
	font-size: 24rpx;
	color: #666;
	width: 120rpx;
}

.detail-value {
	font-size: 24rpx;
	color: #333;
	flex: 1;
}

.item-actions {
	display: flex;
	justify-content: flex-end;
	gap: 10rpx;
}
.action-btn {
		background-color: #007aff;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		font-size: 24rpx;
		color: #fff;
		cursor: pointer;
	}
	
	.delete-btn {
		background-color: #ff2d55;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		font-size: 24rpx;
		color: #fff;
		cursor: pointer;
	}

/* 弹出层样式 */
.simple-popup {
	background-color: #fff;
	border-radius: 10rpx;
	width: 500rpx;
	max-width: 90vw;
}

.simple-popup .popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.simple-popup .popup-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.simple-popup .close-icon {
	color: #999;
	cursor: pointer;
}

.simple-popup .popup-content {
	padding: 20rpx;
}

.simple-popup .detail-item {
	margin-bottom: 20rpx;
}

.simple-popup .detail-label {
	display: block;
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.simple-popup .detail-value {
	display: block;
	font-size: 26rpx;
	color: #333;
}

.simple-popup .detail-value.highlight {
	color: #007aff;
	font-weight: bold;
}

.simple-popup .detail-value.normal {
	color: #4cd964;
	font-weight: bold;
}

.simple-popup .detail-value.low-stock {
	color: #ff9500;
	font-weight: bold;
}

.simple-popup .detail-value.out-of-stock {
	color: #ff2d55;
	font-weight: bold;
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
	padding: 12rpx;
	border: 1rpx solid #eee;
	border-radius: 6rpx;
	font-size: 26rpx;
	color: #333;
}

.simple-popup .popup-footer {
	display: flex;
	justify-content: flex-end;
	gap: 15rpx;
	padding: 20rpx;
	border-top: 1rpx solid #eee;
}

.simple-popup .action-btn {
	padding: 12rpx 25rpx;
	border-radius: 6rpx;
	font-size: 26rpx;
	border: none;
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
	color: #007aff;
}
.add-btn{
	background-color: #007aff;
	border-radius: 8rpx;
	padding: 10rpx 20rpx;
	font-size: 24rpx;
	color: #fff;
	cursor: pointer;
	width: 30%;
	margin-right: 20rpx;
	margin-top: -50rpx;
}
</style>