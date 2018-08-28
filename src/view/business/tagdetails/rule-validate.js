const RuleValidate = {
  name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  restitle: [{ required: true, message: '业务资源标题不能为空', trigger: 'blur' }],
  restype: [{ required: true, message: '资源分类不能为空', trigger: 'blur' }],
  keyword: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请至少选择一个标签',
      trigger: 'change',
    },
  ],

  type: [{ required: true, message: '字段类型不能为空', trigger: 'blur' }],
  length: [{ required: true, message: '字段长度不能为空', trigger: 'blur' }],
  relatedtype: [{ required: true, message: 'Please select gender', trigger: 'change' }],
};
export default RuleValidate;
