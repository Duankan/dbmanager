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
