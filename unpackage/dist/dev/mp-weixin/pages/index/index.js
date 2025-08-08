"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const minValue = common_vendor.ref(1);
    const maxValue = common_vendor.ref(10);
    const selectedOperators = common_vendor.ref(["+", "-"]);
    const operatorOptions = common_vendor.ref([
      { value: "+", label: "加法" },
      { value: "-", label: "减法" },
      { value: "*", label: "乘法" },
      { value: "÷", label: "除法" }
    ]);
    const handleOperatorChange = (e) => {
      selectedOperators.value = e.detail.value;
    };
    function startPractice() {
      if (minValue.value >= maxValue.value) {
        common_vendor.index.showToast({ title: "最大值必须大于最小值", icon: "none" });
        return;
      }
      if (selectedOperators.value.length === 0) {
        common_vendor.index.showToast({ title: "请至少选择一个运算符", icon: "none" });
        return;
      }
      const operators = encodeURIComponent(selectedOperators.value.join(","));
      common_vendor.index.navigateTo({
        url: `/pages/problem/problem?min=${minValue.value}&max=${maxValue.value}&operators=${operators}`
      });
    }
    return (_ctx, _cache) => {
      return {
        a: minValue.value,
        b: common_vendor.o(common_vendor.m(($event) => minValue.value = $event.detail.value, {
          number: true
        })),
        c: maxValue.value,
        d: common_vendor.o(common_vendor.m(($event) => maxValue.value = $event.detail.value, {
          number: true
        })),
        e: common_vendor.f(operatorOptions.value, (op, k0, i0) => {
          return {
            a: op.value,
            b: selectedOperators.value.includes(op.value),
            c: common_vendor.t(op.label),
            d: op.value
          };
        }),
        f: common_vendor.o(handleOperatorChange),
        g: common_vendor.o(startPractice)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
