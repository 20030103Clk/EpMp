<template>
  <view class="container">
    <view class="header">
      <text class="title">生产报表</text>
    </view>
    
    <view class="stats-cards">
      <view class="stat-card">
        <text class="stat-value">{{ totalOutput }}</text>
        <text class="stat-label">总产量(件)</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ avgPassRate }}%</text>
        <text class="stat-label">平均合格率</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ totalDevices }}</text>
        <text class="stat-label">设备总数</text>
      </view>
    </view>
    
    <view class="chart-section">
      <text class="section-title">日产量趋势</text>
      <view class="bar-chart">
        <view class="bar-item" v-for="(item, index) in yieldData" :key="index">
          <view class="bar" :style="{ height: item.percent + '%' }"></view>
          <text class="bar-label">{{ item.date }}</text>
          <text class="bar-value">{{ item.output }}</text>
        </view>
      </view>
    </view>
    
    <view class="chart-section">
      <text class="section-title">产品合格率对比</text>
      <view class="quality-list">
        <view class="quality-item" v-for="(item, index) in qualityData" :key="index">
          <text class="quality-product">{{ item.product }}</text>
          <view class="quality-bar-bg">
            <view class="quality-bar" :style="{ width: item.rate + '%' }"></view>
          </view>
          <text class="quality-rate">{{ item.rate }}%</text>
        </view>
      </view>
    </view>
    
    <view class="chart-section">
      <text class="section-title">设备运行状态</text>
      <view class="device-status">
        <view class="status-item running">
          <text class="status-count">{{ deviceRunning }}</text>
          <text class="status-label">运行中</text>
        </view>
        <view class="status-item idle">
          <text class="status-count">{{ deviceIdle }}</text>
          <text class="status-label">待机</text>
        </view>
        <view class="status-item fault">
          <text class="status-count">{{ deviceFault }}</text>
          <text class="status-label">故障</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  statistics: {
    getStatistics: async () => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/statistics`,
          method: 'GET'
        });
        console.log('Get statistics API response:', response);
        if (response && (response[1] || response.data)) {
          if (response[1]) {
            return response[1].data.data;
          } else if (response.data) {
            return response.data.data;
          }
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        console.error('Get statistics error:', error);
        throw error;
      }
    }
  },
  record: {
    getRecords: async (params = {}) => {
      try {
        const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        const response = await uni.request({
          url: `${API_BASE_URL}/record${queryString ? `?${queryString}` : ''}`,
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
        console.error('Get records error:', error);
        throw error;
      }
    }
  }
};

export default {
  data() {
    return {
      totalOutput: 0,
      avgPassRate: 0,
      totalDevices: 0,
      deviceRunning: 8,
      deviceIdle: 2,
      deviceFault: 1,
      yieldData: [],
      qualityData: []
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    // 页面显示时重新加载数据，确保删除操作后数据更新
    this.loadData();
  },
  methods: {
    loadData() {
      uni.showLoading({ title: '加载数据...' });
      api.statistics.getStatistics().then(data => {
        uni.hideLoading();
        this.updateCharts(data);
      }).catch(error => {
        uni.hideLoading();
        uni.showToast({ title: '加载失败，使用模拟数据', icon: 'none' });
        this.loadMockData();
      });
      
      api.record.getRecords().then(res => {
        if (res.success) {
          const total = res.data.list.reduce((sum, record) => sum + (record.output || 0), 0);
          this.totalOutput = total;
        }
      }).catch(() => {});
    },
    loadMockData() {
      this.totalOutput = 1250;
      this.avgPassRate = 95.5;
      this.totalDevices = 11;
      this.deviceRunning = 8;
      this.deviceIdle = 2;
      this.deviceFault = 1;
      
      this.yieldData = [
        { date: '1日', output: 120, percent: 60 },
        { date: '2日', output: 150, percent: 75 },
        { date: '3日', output: 130, percent: 65 },
        { date: '4日', output: 180, percent: 90 },
        { date: '5日', output: 160, percent: 80 }
      ];
      
      this.qualityData = [
        { product: '产品A', rate: 98 },
        { product: '产品B', rate: 95 },
        { product: '产品C', rate: 92 },
        { product: '产品D', rate: 96 }
      ];
    },
    updateCharts(data) {
      this.totalDevices = 11;
      
      if (data.deviceData && data.deviceData.length > 0) {
        const running = data.deviceData.find(d => d.status === '运行中');
        const idle = data.deviceData.find(d => d.status === '待机');
        const fault = data.deviceData.find(d => d.status === '故障');
        this.deviceRunning = running ? running.count : 8;
        this.deviceIdle = idle ? idle.count : 2;
        this.deviceFault = fault ? fault.count : 1;
      }
      
      if (data.yieldData && data.yieldData.length > 0) {
        const maxOutput = Math.max(...data.yieldData.map(item => item.output));
        this.yieldData = data.yieldData.map(item => ({
          date: item.date ? item.date.substring(5) : '',
          output: item.output,
          percent: maxOutput > 0 ? (item.output / maxOutput) * 100 : 0
        }));
      } else {
        this.yieldData = [
          { date: '1日', output: 120, percent: 60 },
          { date: '2日', output: 150, percent: 75 },
          { date: '3日', output: 130, percent: 65 },
          { date: '4日', output: 180, percent: 90 },
          { date: '5日', output: 160, percent: 80 }
        ];
      }
      
      if (data.qualityData && data.qualityData.length > 0) {
        this.qualityData = data.qualityData.map(item => ({
          product: item.product || '产品',
          rate: item.rate ? Math.round(item.rate * 100) / 100 : 0
        }));
        
        const totalRate = this.qualityData.reduce((sum, item) => sum + item.rate, 0);
        this.avgPassRate = Math.round((totalRate / this.qualityData.length) * 100) / 100;
      } else {
        this.qualityData = [
          { product: '产品A', rate: 98 },
          { product: '产品B', rate: 95 },
          { product: '产品C', rate: 92 },
          { product: '产品D', rate: 96 }
        ];
        this.avgPassRate = 95.25;
      }
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

.stats-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.stat-card {
  flex: 1;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 30rpx 20rpx;
  margin: 0 10rpx;
  text-align: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.stat-value {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #007AFF;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.chart-section {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 300rpx;
  padding-top: 20rpx;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  width: 60rpx;
  background: linear-gradient(to top, #007AFF, #5ac8fa);
  border-radius: 8rpx 8rpx 0 0;
  min-height: 20rpx;
  transition: height 0.3s;
}

.bar-label {
  font-size: 22rpx;
  color: #666;
  margin-top: 10rpx;
}

.bar-value {
  font-size: 20rpx;
  color: #333;
  margin-top: 5rpx;
}

.quality-list {
  padding: 0 10rpx;
}

.quality-item {
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
}

.quality-product {
  width: 120rpx;
  font-size: 26rpx;
  color: #333;
}

.quality-bar-bg {
  flex: 1;
  height: 30rpx;
  background-color: #e8e8e8;
  border-radius: 15rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

.quality-bar {
  height: 100%;
  background: linear-gradient(to right, #4cd964, #5ac8fa);
  border-radius: 15rpx;
  transition: width 0.3s;
}

.quality-rate {
  width: 100rpx;
  font-size: 26rpx;
  color: #007AFF;
  text-align: right;
}

.device-status {
  display: flex;
  justify-content: space-around;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 40rpx;
  border-radius: 10rpx;
}

.status-item.running {
  background-color: #e8f8f5;
}

.status-item.idle {
  background-color: #fff3e0;
}

.status-item.fault {
  background-color: #ffebee;
}

.status-count {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.status-item.running .status-count {
  color: #4cd964;
}

.status-item.idle .status-count {
  color: #ffa726;
}

.status-item.fault .status-count {
  color: #ef5350;
}

.status-label {
  font-size: 24rpx;
  color: #666;
}
</style>