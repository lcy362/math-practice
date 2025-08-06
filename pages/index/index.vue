<template>
  <view class="container">
    <view class="range-selector">
      <text>数字范围：</text>
      <input type="number" v-model.number="minValue" placeholder="最小值" />
      <text>至</text>
      <input type="number" v-model.number="maxValue" placeholder="最大值" />
    </view>
    
    <view class="operator-selector">
      <text>选择运算符：</text>
      <checkbox-group @change="handleOperatorChange">
        <label v-for="op in operatorOptions" :key="op.value">
          <checkbox :value="op.value" :checked="selectedOperators.includes(op.value)" />
          {{ op.label }}
        </label>
      </checkbox-group>
    </view>
    
    <button class="confirm-btn" @click="startPractice">开始练习</button>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 响应式数据
const minValue = ref(1);
const maxValue = ref(10);
const selectedOperators = ref(['+', '-']);
const operatorOptions = ref([
  { value: '+', label: '加法' },
  { value: '-', label: '减法' },
  { value: '*', label: '乘法' },
  { value: '÷', label: '除法' }
]);

// 运算符选择变更
const handleOperatorChange = (e) => {
  selectedOperators.value = e.detail.value;
};

// 开始练习
function startPractice() {
  if (minValue.value >= maxValue.value) {
    uni.showToast({ title: '最大值必须大于最小值', icon: 'none' });
    return;
  }
  
  if (selectedOperators.value.length === 0) {
    uni.showToast({ title: '请至少选择一个运算符', icon: 'none' });
    return;
  }
  const operators = encodeURIComponent(selectedOperators.value.join(','));
  uni.navigateTo({
    url: `/pages/problem/problem?min=${minValue.value}&max=${maxValue.value}&operators=${operators}`
  });
};
</script>

<style>
.container {
  padding: 20px;
}

.range-selector {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.range-selector input {
  border: 1px solid #ddd;
  padding: 8px;
  margin: 0 10px;
  width: 100px;
  text-align: center;
}

.operator-selector {
  margin-bottom: 30px;
}

.operator-selector label {
  display: block;
  margin: 10px 0;
}

.confirm-btn {
  background-color: #4a90e2;
  color: white;
  padding: 12px;
  border-radius: 8px;
}
</style>