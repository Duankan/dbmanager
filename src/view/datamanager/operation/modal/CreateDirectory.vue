<script>
import * as types from '@/store/types';
import api from 'api';
import { validateRequire } from '@/utils/validate';

export default {
  name: 'CreateDirectory',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      types: [],
      form: {
        name: '新建文件夹',
        type: '1',
        description: '',
      },
      rules: {
        name: [
          { validator: validateRequire, message: '文件夹名称不能为空', trigger: 'blur' },
          { type: 'string', max: 64, message: '文件夹名称不能超过64字符', trigger: 'blur' },
        ],
        type: [{ required: true, message: '文件夹类型不能为空', trigger: 'blur' }],
        description: [
          { type: 'string', max: 256, message: '描述信息不能超过256字符', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    current() {
      return this.$store.state.app.currentDirectory;
    },
  },
  async created() {
    const response = await api.db.findCatalogType({});
    this.types = response.data;
  },
  methods: {
    visibleChange(visible) {
      if (!visible) this.resetForm();
      this.$emit('input', visible);
    },
    confirm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const response = await api.db.addCatalog({
            name: this.form.name, //目录名称
            typeId: this.form.type, //分类ID
            describe: this.form.description, //描述(可选)
            access: 1, //访问权限(0:公开 1:私有)
            parentId: this.current.childId, //父childId
            ownerId: this.$appUser.orgid, //拥有者ID
            owner: 1, //拥有者类型(0:用户 1:组织)
          });
          this.$store.dispatch(types.APP_NODES_FETCH, this.current);
          this.$emit('input', false);
          this.$refs['form'].resetFields();
        }
      });
    },
    resetForm() {
      this.form = {
        name: '新建文件夹',
        type: '1',
        description: '',
      };
      this.$refs.form.resetFields();
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    width="380"
    title="新建文件夹"
    @on-visible-change="visibleChange">
    <Form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="70">
      <FormItem
        label="名称"
        prop="name">
        <Input
          v-model="form.name"
          placeholder="请输入文件夹名称"></Input>
      </FormItem>
      <FormItem
        label="类型"
        prop="type">
        <Select v-model="form.type">
          <Option
            v-for="item in types"
            :value="item.id"
            :label="item.name"
            :key="item.id">
            {{ item.name }}
            <span class="type-description">{{ item.describe }}</span>
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="描述"
        prop="description">
        <Input
          v-model="form.description"
          :autosize="{minRows: 2,maxRows: 4}"
          type="textarea"
          placeholder="请输入描述信息,便于日后管理(可选)."></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button
        type="success"
        size="large"
        long
        @click="confirm">确认</Button>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.k-form {
  margin-left: -20px;
  .k-form-item:last-child {
    margin-bottom: 0;
  }
  .type-description {
    margin-left: 20px;
    color: #666666;
  }
}
</style>
