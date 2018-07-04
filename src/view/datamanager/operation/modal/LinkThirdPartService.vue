<script>
import api from 'api';
import * as types from '@/store/types';

const typeIds = ['5', '6', '10', '11', '12', '21', '22', '23', '73100'];

/*
 * 连接第三方服务
 */
export default {
  name: 'LinkThirdPartService',
  props: {
    //对话框是否打开
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //模态框是否打开
      opened: this.value,
      //当前步骤
      current: 0,
      //服务类型
      serviceTypes: [],
      //服务版本
      serviceVersions: [],
      //服务标签
      serviceTags: [],
      //服务校验表单
      validateForm: {},
      //服务发布表单
      publishForm: {},
      //服务校验规则
      validateRuleValidate: {
        serviceType: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
        version: [{ required: true, message: '请选择服务版本', trigger: 'blur' }],
        serviceUrl: [{ required: true, message: '请输入服务地址', trigger: 'blur' }],
      },
      //服务发布规则
      publishRuleValidate: {
        name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        title: [{ required: true, message: '请输入服务标题', trigger: 'blur' }],
      },
      //是否正在发布
      publishLoading: false,
    };
  },
  computed: {
    currentDirectory() {
      return this.$store.state.app.currentDirectory;
    },
  },
  watch: {
    value(val) {
      this.opened = val;
    },
  },
  async created() {
    //获取服务类型
    const resTypes = await api.db.findServiceType(typeIds);
    this.serviceTypes = resTypes.data;
    //获取服务标签
    const resTags = await api.db.findAllTags({});
    this.serviceTags = resTags.data;
  },
  methods: {
    //获取服务版本信息
    async getServiceVersions(id) {
      const response = await api.db.findServiceVersion({ id });
      this.serviceVersions = response.data;
    },
    //验证服务
    validateService() {
      this.$refs.validateForm.validate(async p => {
        if (p) {
          const response = await api.db.validateService(this.validateForm);
          if (response.data.serviceUrl) {
            this.current = 1;
          } else {
            this.$Message.info('服务验证失败！');
          }
        }
      });
    },
    //发布服务
    async publishService() {
      this.publishLoading = true;
      let data = {
        ...this.validateForm,
        ...this.publishForm,
        catalogId: this.currentDirectory.childId,
        userId: this.$user.id,
        userName: this.$user.name,
        orgId: this.$user.orgid,
        orgName: this.$user.orgname,
        serviceSource: 1,
        metadataLayer: 0,
      };
      api.db.publishServiceFromWeb(data).then(p => {
        this.publishLoading = false;
        this.$Message.success('服务发布成功！');
        // 刷新当前页面
        const currentNode = this.$store.state.app.currentDirectory;
        this.$store.dispatch(types.APP_NODES_FETCH, currentNode);
        this.opened = false;
      });
    },
    //模态框显隐变化
    visibleChange(val) {
      this.$emit('input', val);
    },
  },
};
</script>
<template>
  <Modal
    :value="opened"
    width="450"
    title="连接三方服务"
    @on-visible-change="visibleChange">
    <div class="step-header">
      <Steps
        :current="current"
        size="small">
        <Step title="服务验证"></Step>
        <Step title="服务发布"></Step>
      </Steps>
    </div>
    <div class="step-content">
      <div
        v-show="current==0"
        class="step-item">
        <Form
          ref="validateForm"
          :model="validateForm"
          :rules="validateRuleValidate"
          :label-width="90"
          label-position="left">
          <FormItem
            label="服务类型："
            prop="serviceType">
            <Select
              v-model="validateForm.serviceType"
              @on-change="getServiceVersions">
              <Option
                v-for="item in serviceTypes"
                :value="item.id"
                :key="item.id">
                {{ item.servicesTypeText }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            label="服务版本："
            prop="version">
            <Select v-model="validateForm.version">
              <Option
                v-for="item in serviceVersions"
                :value="item"
                :key="item">
                {{ item }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            label="服务地址："
            prop="serviceUrl">
            <Input v-model="validateForm.serviceUrl"></Input>
          </FormItem>
        </Form>
      </div>
      <div
        v-show="current==1"
        class="step-item">
        <Form
          ref="publishForm"
          :model="publishForm"
          :label-width="90"
          :rules="publishRuleValidate"
          label-position="left">
          <FormItem
            label="服务名称："
            prop="name">
            <Input
              v-model="publishForm.name"
              placeholder="请输入服务名称..."></Input>
          </FormItem>
          <FormItem
            label="服务标题："
            prop="title">
            <Input
              v-model="publishForm.title"
              placeholder="请输入服务标题..."></Input>
          </FormItem>
          <FormItem
            label="标签："
            prop="tag">
            <Select v-model="publishForm.tag">
              <Option
                v-for="item in serviceTags"
                :value="item.name"
                :key="item.id">
                {{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <FormItem
            label="描述："
            prop="introduction">
            <Input
              v-model="publishForm.introduction"
              :autosize="{minRows: 2,maxRows: 5}"
              type="textarea"
              placeholder="请输入服务描述信息..."></Input>
          </FormItem>
        </Form>
      </div>
    </div>
    <div
      slot="footer"
      class="step-footer">
      <Button
        v-show="current==0"
        type="warning"
        @click="validateService">验证</Button>
      <Button
        v-show="current==1"
        type="primary"
        @click="current=0">上一步</Button>
      <Button
        v-show="current==1"
        :loading="publishLoading"
        type="success"
        @click="publishService">发布</Button>
      <Button @click="visibleChange(false)">取消</Button>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.step-header {
  margin-left: 80px;
}
.step-content {
  margin: 25px 15px 0 15px;
}
</style>
