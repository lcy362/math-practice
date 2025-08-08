"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "problem",
  setup(__props) {
    const queryParams = common_vendor.ref({});
    const num1 = common_vendor.ref(0);
    const num2 = common_vendor.ref(0);
    const currentOperator = common_vendor.ref("+");
    const userAnswer = common_vendor.ref("");
    const isCorrect = common_vendor.ref(false);
    const showFeedback = common_vendor.ref(false);
    const feedbackMessage = common_vendor.ref("");
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      if (pages.length) {
        queryParams.value = pages[pages.length - 1].options || {};
        generateProblem();
      }
    });
    const generateProblem = () => {
      const min = parseInt(queryParams.value.min) || 0;
      const max = parseInt(queryParams.value.max) || 20;
      const opt = decodeURIComponent(queryParams.value.operators);
      const operators = (opt || "+,-").split(",").filter((item) => item.trim() != "");
      currentOperator.value = operators[Math.floor(Math.random() * operators.length)];
      num1.value = Math.floor(Math.random() * (max - min + 1)) + min;
      if (currentOperator.value === "-") {
        num2.value = Math.floor(Math.random() * (num1.value - min + 1)) + min;
      } else if (currentOperator.value === "÷") {
        do {
          num2.value = Math.floor(Math.random() * (max - min + 1)) + 1;
        } while (num1.value % num2.value !== 0);
      } else {
        num2.value = Math.floor(Math.random() * (max - min + 1)) + min;
      }
    };
    const checkAnswer = () => {
      if (userAnswer.value === null || userAnswer.value === "")
        return;
      let correctAnswer;
      switch (currentOperator.value) {
        case "+":
          correctAnswer = num1.value + num2.value;
          break;
        case "-":
          correctAnswer = num1.value - num2.value;
          break;
        case "×":
          correctAnswer = num1.value * num2.value;
          break;
        case "÷":
          correctAnswer = num1.value / num2.value;
          break;
      }
      isCorrect.value = parseFloat(userAnswer.value) === correctAnswer;
      showFeedback.value = true;
      if (isCorrect.value) {
        feedbackMessage.value = "回答正确！";
        setTimeout(() => {
          showFeedback.value = false;
          userAnswer.value = "";
          generateProblem();
        }, 1e3);
      } else {
        feedbackMessage.value = `回答错误，正确答案是：${correctAnswer}`;
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(num1.value),
        b: common_vendor.t(currentOperator.value),
        c: common_vendor.t(num2.value),
        d: common_vendor.o(checkAnswer),
        e: userAnswer.value,
        f: common_vendor.o(common_vendor.m(($event) => userAnswer.value = $event.detail.value, {
          number: true
        })),
        g: common_vendor.o(checkAnswer),
        h: common_vendor.o(goBack),
        i: showFeedback.value
      }, showFeedback.value ? {
        j: common_vendor.t(feedbackMessage.value),
        k: common_vendor.n(isCorrect.value ? "correct" : "wrong")
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/problem/problem.js.map
