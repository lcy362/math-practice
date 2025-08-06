if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$2 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const minValue = vue.ref(0);
      const maxValue = vue.ref(20);
      const selectedOperators = vue.ref(["+", "-"]);
      const operatorOptions = vue.ref([
        { value: "+", label: "加法" },
        { value: "-", label: "减法" },
        { value: "*", label: "乘法" },
        { value: "/", label: "除法" }
      ]);
      const handleOperatorChange = (e) => {
        formatAppLog("log", "at pages/index/index.vue:40", "222" + e.detail.value);
        selectedOperators.value = e.detail.value;
      };
      function startPractice() {
        if (minValue.value >= maxValue.value) {
          uni.showToast({ title: "最大值必须大于最小值", icon: "none" });
          return;
        }
        if (selectedOperators.value.length === 0) {
          uni.showToast({ title: "请至少选择一个运算符", icon: "none" });
          return;
        }
        const operators = encodeURIComponent(selectedOperators.value.join(","));
        uni.navigateTo({
          url: `/pages/problem/problem?min=${minValue.value}&max=${maxValue.value}&operators=${operators}`
        });
      }
      const __returned__ = { minValue, maxValue, selectedOperators, operatorOptions, handleOperatorChange, startPractice, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "range-selector" }, [
        vue.createElementVNode("text", null, "数字范围："),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            type: "number",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.minValue = $event),
            placeholder: "最小值"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [
            vue.vModelText,
            $setup.minValue,
            void 0,
            { number: true }
          ]
        ]),
        vue.createElementVNode("text", null, "至"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            type: "number",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.maxValue = $event),
            placeholder: "最大值"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [
            vue.vModelText,
            $setup.maxValue,
            void 0,
            { number: true }
          ]
        ])
      ]),
      vue.createElementVNode("view", { class: "operator-selector" }, [
        vue.createElementVNode("text", null, "选择运算符："),
        vue.createElementVNode(
          "checkbox-group",
          { onChange: $setup.handleOperatorChange },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.operatorOptions, (op) => {
                return vue.openBlock(), vue.createElementBlock("label", {
                  key: op.value
                }, [
                  vue.createElementVNode("checkbox", {
                    value: op.value,
                    checked: $setup.selectedOperators.includes(op.value)
                  }, null, 8, ["value", "checked"]),
                  vue.createTextVNode(
                    " " + vue.toDisplayString(op.label),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          32
          /* NEED_HYDRATION */
        )
      ]),
      vue.createElementVNode("button", {
        class: "confirm-btn",
        onClick: $setup.startPractice
      }, "开始练习")
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "/Users/lcy/Documents/HBuilderProjects/math-practice/pages/index/index.vue"]]);
  const _sfc_main$1 = {
    __name: "problem",
    setup(__props, { expose: __expose }) {
      __expose();
      const queryParams = vue.ref({});
      const num1 = vue.ref(0);
      const num2 = vue.ref(0);
      const currentOperator = vue.ref("+");
      const userAnswer = vue.ref("");
      const isCorrect = vue.ref(false);
      const showFeedback = vue.ref(false);
      const feedbackMessage = vue.ref("");
      vue.onMounted(() => {
        const pages = getCurrentPages();
        if (pages.length) {
          queryParams.value = pages[pages.length - 1].options || {};
          generateProblem();
        }
      });
      const generateProblem = () => {
        const min = parseInt(queryParams.value.min) || 0;
        const max = parseInt(queryParams.value.max) || 20;
        const operators = (queryParams.value.operators || "+,-").split(",").filter((item) => item.trim() != "");
        formatAppLog("log", "at pages/problem/problem.vue:50", "opt:" + operators);
        currentOperator.value = operators[Math.floor(Math.random() * operators.length)];
        num1.value = Math.floor(Math.random() * (max - min + 1)) + min;
        if (currentOperator.value === "-") {
          num2.value = Math.floor(Math.random() * (num1.value - min + 1)) + min;
        } else if (currentOperator.value === "/") {
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
          case "*":
            correctAnswer = num1.value * num2.value;
            break;
          case "/":
            correctAnswer = num1.value / num2.value;
            break;
        }
        formatAppLog("log", "at pages/problem/problem.vue:83", "correctAnswer:" + correctAnswer);
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
        uni.navigateBack();
      };
      const __returned__ = { queryParams, num1, num2, currentOperator, userAnswer, isCorrect, showFeedback, feedbackMessage, generateProblem, checkAnswer, goBack, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode(
        "view",
        { class: "problem" },
        vue.toDisplayString($setup.num1) + " " + vue.toDisplayString($setup.currentOperator) + " " + vue.toDisplayString($setup.num2) + " = ? ",
        1
        /* TEXT */
      ),
      vue.withDirectives(vue.createElementVNode(
        "input",
        {
          type: "number",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.userAnswer = $event),
          placeholder: "输入答案",
          onConfirm: $setup.checkAnswer,
          focus: ""
        },
        null,
        544
        /* NEED_HYDRATION, NEED_PATCH */
      ), [
        [
          vue.vModelText,
          $setup.userAnswer,
          void 0,
          { number: true }
        ]
      ]),
      vue.createElementVNode("button", {
        class: "submit-btn",
        onClick: $setup.checkAnswer
      }, "提交"),
      vue.createElementVNode("button", {
        class: "back-btn",
        onClick: $setup.goBack
      }, "返回主页"),
      $setup.showFeedback ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass(["feedback", $setup.isCorrect ? "correct" : "wrong"])
        },
        vue.toDisplayString($setup.feedbackMessage),
        3
        /* TEXT, CLASS */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesProblemProblem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/Users/lcy/Documents/HBuilderProjects/math-practice/pages/problem/problem.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/problem/problem", PagesProblemProblem);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/lcy/Documents/HBuilderProjects/math-practice/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
