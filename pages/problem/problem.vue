<template>
  <view class="container">
    <view class="problem">
      {{ num1 }} {{ currentOperator }} {{ num2 }} = ?
    </view>
    
    <input 
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
  const pages = getCurrentPages();
  if (pages.length) {
    queryParams.value = pages[pages.length - 1].options || {};
    generateProblem();
  }
});

// 生成题目
const generateProblem = () => {
  const min = parseInt(queryParams.value.min) || 0;
  const max = parseInt(queryParams.value.max) || 20;
  const operators = (queryParams.value.operators || '+,-').split(',').filter((item) => item.trim() != "");
  console.log("opt:" + operators)
  
  // 随机选择运算符
  currentOperator.value = operators[Math.floor(Math.random() * operators.length)];
  
  // 生成操作数
  num1.value = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // 根据运算符调整生成逻辑
  if (currentOperator.value === '-') {
    // 减法确保结果非负
    num2.value = Math.floor(Math.random() * (num1.value - min + 1)) + min;
  } else if (currentOperator.value === '/') {
    // 除法确保整数结果
    do {
      num2.value = Math.floor(Math.random() * (max - min + 1)) + 1;
    } while (num1.value % num2.value !== 0);
  } else {
    num2.value = Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

// 验证答案
const checkAnswer = () => {
  if (userAnswer.value === null || userAnswer.value === '') return;
  
  let correctAnswer;
  switch (currentOperator.value) {
    case '+': correctAnswer = num1.value + num2.value; break;
    case '-': correctAnswer = num1.value - num2.value; break;
    case '*': correctAnswer = num1.value * num2.value; break;
    case '÷': correctAnswer = num1.value / num2.value; break;
  }
  console.log("correctAnswer:" + correctAnswer)
  
  isCorrect.value = parseFloat(userAnswer.value) === correctAnswer;
  showFeedback.value = true;
  
  if (isCorrect.value) {
    feedbackMessage.value = '回答正确！';
    setTimeout(() => {
      showFeedback.value = false;
      userAnswer.value = '';
      generateProblem();
    }, 1000);
  } else {
    feedbackMessage.value = `回答错误，正确答案是：${correctAnswer}`;
  }
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