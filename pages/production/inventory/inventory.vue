<template>
	<view>
		<view class="particles">
			<view class="particle" v-for="n in 10" :key="n" :style="getParticleStyle(n)"></view>
		</view>
		<view class="container">
			<view class="header">
				<view class="header-content">
					<view class="title-section">
						<text class="title">库存管理</text>
						<text class="subtitle">Inventory Management</text>
					</view>
					<button class="add-btn" @click="addproduct" v-if="isAdmin">
						<uni-icons type="plus" size="24"></uni-icons>
						<text>添加产品</text>
					</button>
				</view>
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
							<button class="delete-btn" @click="deleteInventory(index)" v-if="isAdmin">&nbsp;&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 查看库存详情弹出层 -->
		<uni-popup ref="popup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">库存详情</text>
				</view>
				<view class="popup-body">
					<view class="form-item">
						<text class="form-label">产品名称</text>
						<text class="form-value">{{ currentInventory.product }}</text>
					</view>
					<view class="form-item">
						<text class="form-label">产品编号</text>
						<text class="form-value">{{ currentInventory.code }}</text>
					</view>
					<view class="form-item">
						<text class="form-label">当前库存</text>
						<text class="form-value highlight">{{ currentInventory.currentStock }} 件</text>
					</view>
					<view class="form-item">
						<text class="form-label">安全库存</text>
						<text class="form-value">{{ currentInventory.safeStock }} 件</text>
					</view>
					<view class="form-item">
						<text class="form-label">库存单位</text>
						<text class="form-value">{{ currentInventory.unit }}</text>
					</view>
					<view class="form-item">
						<text class="form-label">库存位置</text>
						<text class="form-value">{{ currentInventory.location }}</text>
					</view>
				</view>
				<view class="popup-footer">
					<button @click="editInventory" class="popup-btn cancel" v-if="isAdmin">编辑</button>
					<button @click="closepopup" class="popup-btn confirm">关闭</button>
				</view>
			</view>
		</uni-popup>
		
		<!-- 添加产品弹出层 -->
		<uni-popup ref="addPopup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">添加产品</text>
				</view>
				<view class="popup-body">
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
					<button @click="closeAddPopup" class="popup-btn cancel">取消</button>
					<button @click="submitProduct" class="popup-btn confirm">确定</button>
				</view>
			</view>
		</uni-popup>
		
		<!-- 编辑库存弹出层 -->
		<uni-popup ref="editPopup" type="center">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">编辑库存</text>
				</view>
				<view class="popup-body">
					<view class="form-item">
						<text class="form-label">产品名称</text>
						<input type="text" v-model="editProduct.product" class="form-input" placeholder="请输入产品名称" />
					</view>
					<view class="form-item">
						<text class="form-label">产品编号</text>
						<input type="text" v-model="editProduct.code" class="form-input" placeholder="请输入产品编号" disabled />
					</view>
					<view class="form-item">
						<text class="form-label">当前库存</text>
						<input type="number" v-model="editProduct.currentStock" class="form-input" placeholder="请输入当前库存" />
					</view>
					<view class="form-item">
						<text class="form-label">安全库存</text>
						<input type="number" v-model="editProduct.safeStock" class="form-input" placeholder="请输入安全库存" />
					</view>
					<view class="form-item">
						<text class="form-label">库存单位</text>
						<input type="text" v-model="editProduct.unit" class="form-input" placeholder="请输入库存单位" />
					</view>
					<view class="form-item">
						<text class="form-label">库存位置</text>
						<input type="text" v-model="editProduct.location" class="form-input" placeholder="请输入库存位置" />
					</view>
				</view>
				<view class="popup-footer">
					<button @click="closeEditPopup" class="popup-btn cancel">取消</button>
					<button @click="submitEditProduct" class="popup-btn confirm">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  inventory: {
    getInventories: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/inventory${queryString ? `?${queryString}` : ''}`,
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
    createInventory: async (data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/inventory`,
          method: 'POST',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
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
    },
    updateInventory: async (id, data) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/inventory/${id}`,
          method: 'PUT',
          data: JSON.stringify(data),
          header: {
            'Content-Type': 'application/json'
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
    },
    deleteInventory: async (id) => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/inventory/${id}`,
          method: 'DELETE'
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
			editProduct: {
				id: '',
				product: '',
				code: '',
				currentStock: 0,
				safeStock: 0,
				unit: '件',
				location: ''
			},
			inventoryItems: []
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
		},
		isAdmin() {
			const userInfo = uni.getStorageSync('userInfo');
			return userInfo && userInfo.level === 1;
		}
	},
	onLoad() {
		// 加载库存数据
		this.loadInventory();
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
		// 加载库存数据
		loadInventory() {
			uni.showLoading({ title: '加载中...' });
			api.inventory.getInventories().then(res => {
				uni.hideLoading();
				if (res.success) {
					this.inventoryItems = res.data.list.map(item => ({
						id: item.inventory_id,
						product: item.product,
						code: item.code,
						currentStock: item.currentStock,
						safeStock: item.safeStock,
						unit: item.unit || '件',
						location: item.location
					}));
				} else {
					uni.showToast({ title: '加载失败', icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		},
		
		// 搜索库存
		search() {
			if (!this.searchValue.trim()) {
				this.loadInventory();
				return;
			}
			uni.showLoading({ title: '搜索中...' });
			api.inventory.getInventories({ product: this.searchValue }).then(res => {
				uni.hideLoading();
				if (res.success) {
					this.inventoryItems = res.data.list.map(item => ({
						id: item.inventory_id,
						product: item.product,
						code: item.code,
						currentStock: item.currentStock,
						safeStock: item.safeStock,
						unit: item.unit || '件',
						location: item.location
					}));
				} else {
					uni.showToast({ title: '搜索失败', icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		},
		
		// 清除搜索
		clear() {
			this.searchValue = '';
			this.loadInventory();
		},
		
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
			
			// === API调用 ===
			uni.showLoading({ title: '提交中...' });
			api.inventory.createInventory({
				product: this.newProduct.product,
				code: this.newProduct.code,
				currentStock: this.newProduct.currentStock,
				safeStock: this.newProduct.safeStock,
				unit: this.newProduct.unit,
				location: this.newProduct.location
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({
						title: '产品添加成功',
						icon: 'success'
					});
					this.loadInventory(); // 重新加载库存
					this.closeAddPopup();
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '提交失败', icon: 'none' });
			});
		},

		deleteInventory(index) {
			const item = this.inventoryItems[index];
			uni.showModal({
				title: '确认删除',
				content: '确定要删除这条库存记录吗？',
				confirmText: '删除',
				confirmColor: '#ff2d55',
				success: (res) => {
					if (res.confirm) {
						// === API调用 ===
						uni.showLoading({ title: '删除中...' });
						// 这里需要添加删除API调用
						api.inventory.deleteInventory(item.id).then(res => {
							uni.hideLoading();
							if (res.success) {
								this.inventoryItems.splice(index, 1);
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
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
		
		// 打开编辑库存弹窗
		editInventory() {
			// 从当前详情中获取库存数据
			if (this.currentInventory.id) {
				this.editProduct = {
					id: this.currentInventory.id,
					product: this.currentInventory.product || '',
					code: this.currentInventory.code || '',
					currentStock: this.currentInventory.currentStock || 0,
					safeStock: this.currentInventory.safeStock || 0,
					unit: this.currentInventory.unit || '件',
					location: this.currentInventory.location || ''
				};
				// 关闭详情弹窗，打开编辑弹窗
				this.$refs.popup.close();
				this.$refs.editPopup.open('center');
			}
		},
		
		// 关闭编辑库存弹窗
		closeEditPopup() {
			this.$refs.editPopup.close();
			// 重置编辑表单
			this.editProduct = {
				id: '',
				product: '',
				code: '',
				currentStock: 0,
				safeStock: 0,
				unit: '件',
				location: ''
			};
		},
		
		// 提交编辑库存
		submitEditProduct() {
			if (!this.editProduct.product.trim()) {
				uni.showToast({
					title: '请输入产品名称',
					icon: 'none'
				});
				return;
			}
			if (this.editProduct.currentStock < 0) {
				uni.showToast({
					title: '当前库存不能为负数',
					icon: 'none'
				});
				return;
			}
			if (this.editProduct.safeStock < 0) {
				uni.showToast({
					title: '安全库存不能为负数',
					icon: 'none'
				});
				return;
			}
			
			// === API调用 ===
			uni.showLoading({ title: '提交中...' });
			api.inventory.updateInventory(this.editProduct.id, {
				product: this.editProduct.product,
				currentStock: this.editProduct.currentStock,
				safeStock: this.editProduct.safeStock,
				unit: this.editProduct.unit,
				location: this.editProduct.location
			}).then(res => {
				uni.hideLoading();
				if (res.success) {
					uni.showToast({
						title: '编辑成功',
						icon: 'success'
					});
					this.loadInventory(); // 重新加载库存
					this.closeEditPopup();
				} else {
					uni.showToast({ title: res.message, icon: 'none' });
				}
			}).catch(error => {
				uni.hideLoading();
				uni.showToast({ title: '提交失败', icon: 'none' });
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
	position: fixed;
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

.title-section {
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

.inventory-stats {
	display: grid;
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
	padding: 30rpx;
	text-align: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
}

.stat-title {
	font-size: 26rpx;
	color: #6c757d;
	margin-bottom: 12rpx;
	font-weight: 500;
}

.stat-value {
	font-size: 52rpx;
	font-weight: 700;
	color: #c9a962;
}

.stat-unit {
	font-size: 26rpx;
	color: #95a5a6;
	margin-left: 8rpx;
}

.inventory-section {
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.6);
	position: relative;
	z-index: 10;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2c3e50;
}

.more {
	font-size: 24rpx;
	color: #c9a962;
	cursor: pointer;
}

.inventory-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.inventory-item {
	background: rgba(248, 249, 250, 0.9);
	border-radius: 16rpx;
	padding: 20rpx;
	border: 1rpx solid rgba(201, 169, 98, 0.1);
	transition: all 0.3s ease;
}

.inventory-item:active {
	background: rgba(201, 169, 98, 0.08);
}

.item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.item-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #2c3e50;
}

.item-code {
	font-size: 24rpx;
	color: #6c757d;
}

.item-details {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.detail-row {
	display: flex;
	align-items: center;
}

.detail-label {
	font-size: 26rpx;
	color: #6c757d;
	width: 140rpx;
	font-weight: 500;
}

.detail-value {
	font-size: 26rpx;
	color: #2c3e50;
	flex: 1;
}

.item-actions {
	display: flex;
	justify-content: flex-end;
	gap: 12rpx;
}

.action-btn {
	background: linear-gradient(135deg, #c9a962 0%, #d4b896 100%);
	border-radius: 12rpx;
	padding: 12rpx 24rpx;
	font-size: 24rpx;
	color: #fff;
	cursor: pointer;
	border: none;
	box-shadow: 0 4rpx 12rpx rgba(201, 169, 98, 0.3);
	transition: all 0.3s ease;
}

.action-btn:active {
	transform: scale(0.96);
}

.delete-btn {
	background: rgba(255, 77, 79, 0.9);
	border-radius: 12rpx;
	padding: 12rpx 24rpx;
	font-size: 24rpx;
	color: #fff;
	cursor: pointer;
	border: none;
	box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.3);
	transition: all 0.3s ease;
}

.delete-btn:active {
	transform: scale(0.96);
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
	width: fit-content;
	height: 80rpx;
}

.add-btn:active {
	transform: scale(0.96);
}

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

</style>