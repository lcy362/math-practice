<template>
  <view class="container">
    <view class="problem">
      {{ num1 }} {{ currentOperator === 'compare' ? '?' : currentOperator }} {{ num2 }} = ?
    </view>
    
    <!-- 比较大小类型使用单选按钮 -->
    <view v-if="currentOperator === 'compare'" class="radio-group">
      <radio-group @change="handleRadioChange">
        <label class="radio-item">
          <radio value=">" :checked="userAnswer === '>'" />
          <text>{{ num1 }} {{ getOperatorSymbol('>') }} {{ num2 }}</text>
        </label>
        <label class="radio-item">
          <radio value="<" :checked="userAnswer === '<'" />
          <text>{{ num1 }} {{ getOperatorSymbol('<') }} {{ num2 }}</text>
        </label>
        <label class="radio-item">
          <radio value="=" :checked="userAnswer === '='" />
          <text>{{ num1 }} {{ getOperatorSymbol('=') }} {{ num2 }}</text>
        </label>
      </radio-group>
    </view>
    <!-- 其他类型使用输入框 -->
    <input 
      v-else
      type="number" 
      v-model.number="userAnswer" 
      placeholder="输入答案" 
      @confirm="checkAnswer"
      focus
    />
    
    <button class="submit-btn" @click="checkAnswer">提交</button>
    <button class="back-btn" @click="goBack">返回主页</button>
    
    <view v-if="showFeedback" :class="['feedback', isCorrect ? 'correct' : 'wrong']">
      {{ feedbackMessage }}
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 从URL参数获取设置
const queryParams = ref({});
const num1 = ref(0);
const num2 = ref(0);
const currentOperator = ref('+');
const userAnswer = ref('');
const isCorrect = ref(false);
const showFeedback = ref(false);
const feedbackMessage = ref('');

onMounted(() => {
  const params = uni.getStorageSync('PRACTICE_PARAMS');
  if (!params) {
    uni.showToast({ title: '参数加载失败', icon: 'error' });
    setTimeout(() => uni.navigateBack(), 1500);
    return;
  }
  generateProblem(params); // 初始化题目
});


// 生成题目
const generateProblem = (params) => {
  // 重置答案
  userAnswer.value = '';
  showFeedback.value = false;
  
  const { min, max, operators } = params;
  
  // 随机选择运算符
  currentOperator.value = operators[Math.floor(Math.random() * operators.length)];
  
  // 生成操作数
  num1.value = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // 根据运算符调整生成逻辑
  if (currentOperator.value === '-') {
    // 减法确保结果非负
    num2.value = Math.floor(Math.random() * (num1.value - min + 1)) + min;
  } else if (currentOperator.value === '÷') {
    // 除法确保整数结果
    do {
      num2.value = Math.floor(Math.random() * (max - min + 1)) + 1;
    } while (num1.value % num2.value !== 0);
  } else if (currentOperator.value === 'compare') {
    // 比较运算生成两个随机数
    num2.value = Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    num2.value = Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// 验证答案
const checkAnswer = () => {
  console.log('userAnswer.value:', userAnswer.value);
  console.log('userAnswer.value type:', typeof userAnswer.value);
  
  if (!userAnswer.value) {
    uni.showToast({ title: '请选择一个答案', icon: 'none' });
    return;
  }
  
  let correctAnswer;
  if (currentOperator.value === 'compare') {
    if (num1.value > num2.value) {
      correctAnswer = '>';
    } else if (num1.value < num2.value) {
      correctAnswer = '<';
    } else {
      correctAnswer = '=';
    }
    isCorrect.value = userAnswer.value === correctAnswer;
  } else {
    switch (currentOperator.value) {
      case '+': correctAnswer = num1.value + num2.value; break;
      case '-': correctAnswer = num1.value - num2.value; break;
      case '×': correctAnswer = num1.value * num2.value; break;
      case '÷': correctAnswer = num1.value / num2.value; break;
    }
    isCorrect.value = parseFloat(userAnswer.value) === correctAnswer;
  }
  
  showFeedback.value = true;
  
  if (isCorrect.value) {
    feedbackMessage.value = '回答正确！';
    setTimeout(() => {
      showFeedback.value = false;
      userAnswer.value = '';
      generateProblem(uni.getStorageSync('PRACTICE_PARAMS'));
    }, 1000);
  } else {
    feedbackMessage.value = `回答错误，正确答案是：${correctAnswer}`;
  }
};

// 获取运算符显示符号
const getOperatorSymbol = (operator) => {
  switch (operator) {
    case '>': return '>';
    case '<': return '<';
    case '=': return '=';
    default: return operator;
  }
};

// 处理单选按钮选择
const handleRadioChange = (e) => {
  console.log('Radio change event:', e);
  userAnswer.value = e.detail.value;
  console.log('Selected value:', userAnswer.value);
};

// 返回主页
const goBack = () => {
  uni.navigateBack();
};
</script>

<style>
.container {
  padding: 20px;
  text-align: center;
}

.problem {
  font-size: 2em;
  margin: 40px 0;
}

input {
  border: 1px solid #ddd;
  padding: 12px;
  margin: 20px 0;
  width: 80%;
  font-size: 1.2em;
}

.radio-group {
  margin: 20px 0;
  width: 80%;
  margin-left: 10%;
}

.radio-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.radio-item radio {
  margin-right: 10px;
  transform: scale(1.2);
}

.radio-item text {
  font-size: 1.1em;
}

.submit-btn {
  background-color: #4a90e2;
  color: white;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
}

.back-btn {
  background-color: #f0f0f0;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
}

.feedback {
  margin-top: 30px;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.2em;
}

.correct {
  background-color: #dff0d8;
  color: #3c763d;
}

.wrong {
  background-color: #f2dede;
  color: #a94442;
}
</style>