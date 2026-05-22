<template>
  <view class="container">
    <view class="header">
      
      <text class="title">生产报表</text>
      <view class="placeholder"></view>
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

const formatDateLabel = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      const day = date.getDate();
      return `${day}日`;
    } else if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length >= 3) {
        return `${parts[2]}日`;
      }
    }
    return dateStr;
  } catch (error) {
    console.error('Date format error:', error);
    return dateStr;
  }
};

const api = {
  statistics: {
    getStatistics: async () => {
      try {
        const response = await uni.request({
          url: `${API_BASE_URL}/statistics`,
          method: 'GET'
        });
        console.log('Statistics API response:', response);
        
        const result = response.data || (response[1] && response[1].data);
        
        if (result && result.data) {
          return result.data;
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
        
        const result = response.data || (response[1] && response[1].data);
        
        if (result) {
          return result;
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
    this.loadData();
  },
  methods: {
    refreshTabBar() {
      if (typeof this.$mp.page.getTabBar === 'function') {
        const tabBar = this.$mp.page.getTabBar();
        if (tabBar && tabBar.updateTabList) {
          tabBar.updateTabList();
        }
      }
    },
    goBack() {
      uni.navigateBack();
    },
    loadData() {
      this.loadMockData();
    },
    loadMockData() {
      this.totalOutput = 890;
      this.avgPassRate = 86.19;
      this.totalDevices = 11;
      this.deviceRunning = 8;
      this.deviceIdle = 2;
      this.deviceFault = 1;
      
      const mockYieldData = [
        { date: '18日', output: 120 },
        { date: '19日', output: 200 },
        { date: '20日', output: 150 },
        { date: '21日', output: 180 },
        { date: '22日', output: 240 }
      ];
      
      const maxOutput = Math.max(...mockYieldData.map(item => item.output));
      console.log('maxOutput:', maxOutput);
      
      this.yieldData = mockYieldData.map(item => {
        const percent = (item.output / maxOutput) * 100;
        console.log(`日期: ${item.date}, 产量: ${item.output}, 百分比: ${percent}%`);
        return {
          date: item.date,
          output: item.output,
          percent: percent
        };
      });
      
      console.log('yieldData:', JSON.stringify(this.yieldData));
      
      this.qualityData = [
        { product: '不锈钢组件', rate: 90 },
        { product: '装配件', rate: 90 },
        { product: '茶', rate: 78.57 }
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
        const outputs = data.yieldData.map(item => item.output || 0);
        const maxOutput = Math.max(...outputs);
        
        if (maxOutput > 0) {
          this.yieldData = data.yieldData.map(item => ({
            date: formatDateLabel(item.date),
            output: item.output || 0,
            percent: (item.output / maxOutput) * 100
          }));
        } else {
          this.loadDefaultYieldData();
        }
      } else {
        this.loadDefaultYieldData();
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
          { product: '不锈钢组件', rate: 90 },
          { product: '装配件', rate: 90 },
          { product: '茶', rate: 78.57 }
        ];
        this.avgPassRate = 86.19;
      }
    },
    loadDefaultYieldData() {
      this.yieldData = [
        { date: '1日', output: 120, percent: 60 },
        { date: '2日', output: 150, percent: 75 },
        { date: '3日', output: 130, percent: 65 },
        { date: '4日', output: 180, percent: 90 },
        { date: '5日', output: 160, percent: 80 }
      ];
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
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

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c9a962;
}

.placeholder {
  width: 60rpx;
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
  min-height: 4rpx;
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