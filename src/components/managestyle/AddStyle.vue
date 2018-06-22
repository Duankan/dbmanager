<script>
const resourceType = [
  {
    value: 'sld',
    label: 'sld',
  },
];
export default {
  name: 'AddStyle',
  props: {
    classify: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 表单数据
      styleCondition: {
        name: '',
        TypeName: 'sld',
        classify: ' ',
        description: '',
      },
      // 表单验证
      ruleValidate: {
        name: [{ required: true, message: '请输入样式名称！', trigger: 'blur' }],
        TypeName: [{ required: true, message: '选择资源类型！', trigger: 'change' }],
        classify: [{ required: true, message: '选择样式类型！', trigger: 'change' }],
      },
      resourceType,
      fileName: '',
      cpClassify: [...this.classify],
    };
  },
  computed: {
    styleClassify() {
      const classify = this.cpClassify.filter(item => item.label !== '其他类型');
      return classify;
    },
    current() {
      return this.$store.state.app.currentDirectory;
    },
  },
  methods: {
    // 新增样式文件
    addNewStyle() {
      this.$refs['addstyle'].validate(async valid => {
        if (valid) {
          const formData = new FormData();
          formData.append('file', this.file);
          formData.append(
            'data',
            JSON.stringify({
              typeId: '20102',
              catalogId: this.current.childId,
              userId: this.$user.id,
              userName: this.$user.name,
              orgId: this.$user.orgid,
              orgName: this.$user.orgname,
              alias: this.styleCondition.name,
              ...this.styleCondition,
            })
          );
          const response = await api.db.addStyle({}, formData);
          this.$Message.success('样式上传成功！');
        }
      });
    },
    // 样式文件上传
    styleUpload(e) {
      this.file = e.target.files[0];
      if (this.file) {
        this.fileName = this.file.name;
        this.alias = this.file.name.match(/(.*)\.sld$/)[1];
      }
    },
    beforeUpload(file) {
      this.file = file;
      return false;
    },
    // 重置
    handleReset() {
      this.$refs['addstyle'].resetFields();
      this.file = null;
    },
  },
};
</script>

<template>
  <Form
    ref="addstyle"
    :model="styleCondition"
    :rules="ruleValidate"
    :label-width="90"
    class="db-add-style"
  >
    <FormItem
      label="样式名称："
      prop="name">
      <Input
        v-model="styleCondition.name"
        placeholder="请输入样式名称"
        clearable
      ></Input>
    </FormItem>
    <FormItem
      label="资源类型："
      prop="TypeName"
    >
      <Select
        v-model="styleCondition.TypeName"
        transfer
      >
        <Option
          v-for="(item,index) in resourceType"
          :value="item.value"
          :key="index">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="样式分类："
      prop="classify"
    >
      <Select
        v-model="styleCondition.classify"
        transfer
      >
        <Option
          v-for="item in styleClassify"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="描述："
    >
      <Input
        v-model="styleCondition.description"
        :autosize="{ minRows: 2, maxRows: 5 }"
        type="textarea"
        placeholder="请输入描述"></Input>
    </FormItem>
    <FormItem
      label="上传：">
      <label
        for="style"
        class="style-upload">
        <SvgIcon
          icon-class="upload"
          size="20"
          color="#318CF0">
        </SvgIcon>
      </label>
      <input
        id="style"
        hidden
        type="file"
        name="file"
        @input="styleUpload">
      {{ fileName!==''?fileName:'点击上传样式文件' }}
    </FormItem>
    <FormItem
      label="上传：">
      <Upload
        :before-upload="beforeUpload"
        multiple
        type="drag"
        action="#">
        <SvgIcon
          icon-class="upload"
          size="20"
          color="#318CF0">
        </SvgIcon>
      </Upload>
    </FormItem>
    <FormItem
    >
      <Button
        type="primary"
        @click="addNewStyle"
      >确定
      </Button>
      <Button
        type="primary"
        @click="handleReset"
      >重置
      </Button>
    </FormItem>
  </Form>
</template>

<style lang="less" scoped>
.db-add-style {
  /deep/.k-form-item {
    margin-bottom: 20px;
  }
  .style-upload {
    padding: 3px;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
