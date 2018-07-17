/**
 * 表单校验器
 */

//校验是否输入为空
export function validateRequire(rule, value, callback) {
  if (value.trim() === '') {
    callback(new Error(rule.message));
  } else {
    callback();
  }
}

//校验是否输入特殊字符
export function validateSpecChar(rule, value, callback) {
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]*$/.test(value)) {
    callback(new Error('不能输入特殊字符！'));
  } else {
    callback();
  }
}
