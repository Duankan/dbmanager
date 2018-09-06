const RuleValidate = {
  name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  restitle: [{ required: true, message: '业务资源标题不能为空', trigger: 'blur' }],
  restype: [{ required: true, type: 'array', message: '资源分类不能为空', trigger: 'blur' }],
  keyword: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请至少选择一个标签',
      trigger: 'change',
    },
    { type: 'array', max: 200, message: '最多选择200个标签', trigger: 'change' },
  ],

  type: [{ required: true, message: '字段类型不能为空', trigger: 'change' }],
  length: [{ required: true, message: '字段长度不能为空', trigger: 'blur' }],
  relatedtype: [{ required: true, message: 'Please select gender', trigger: 'change' }],
  name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
  classfiy: [{ required: true, message: '字段分类不能为空', trigger: 'change' }],
  extendmethod: [{ required: true, message: '处理规则不能为空', trigger: 'blur' }],
};
export default RuleValidate;
