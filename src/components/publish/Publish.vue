<script>
import * as types from '@/store/types';
import api from 'api';

export default {
  name: 'Publish',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      crsLoading: false,
      publishLoading: false,
      showMore: false, // 控制显示详细信息
      crsOptions: [],
      styleOptions: [],
      publishForm: {
        title: '',
        crs: '',
        styles: '',
        name: '',
        serviceType: ['12', '6'],
      },
      ruleValidate: {
        title: [
          { required: true, message: '服务标题不能为空', trigger: 'blur' },
          // { type: /^[0-9]*$/, message: '不能以数字开头', trigger: 'change' },
          // {
          //   type: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
          //   message: '只能输入中文、字母、数字、下划线',
          //   trigger: 'change',
          // },
        ],
        name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
      },
    };
  },
  computed: {
    current() {
      return this.$store.state.app.currentDirectory;
    },
  },
  watch: {
    async node(val) {
      if (val) {
        const name = await this.handleServiceName(val.name);
        this.publishForm = Object.assign(this.publishForm, {
          title: val.name,
          name,
        });
        this.getStyle(val);
      }
    },
  },
  created() {
    // 获取空间参考
    this.remoteMethod('');
  },
  methods: {
    visibleChange(visible) {
      if (!visible) {
        this.publishForm.crs = '';
        this.publishForm.styles = '';
      }
      this.$emit('input', visible);
    },
    // 获取样式信息
    async getStyle(node) {
      const response = await api.db.findSyleByType({
        orgId: this.$user.orgid,
        type: this._getStyleType(node),
      });
      this.styleOptions = response.data;
    },
    // 获取资源节点样式类别
    _getStyleType(node) {
      switch (node.shapeType.toUpperCase()) {
        case 'DEM':
          return 4;
        case 'POLYGON':
        case 'MULTIPOLYGON':
          return 3;
        case 'POLYLINE':
        case 'LINESTRING':
        case 'MULTILINESTRING':
          return 2;
        case 'POINT':
          return 1;
        default:
          return 0;
      }
    },
    // 点击发布按钮，发布服务，并将axios对象添加到任务队列
    async publish() {
      this.publishLoading = true;

      const { serviceType, ...rest } = this.publishForm;
      const params = {
        catalogId: this.node.catalogId,
        resourceId: this.node.resourceId,
        userId: this.$user.id,
        userName: this.$user.name,
        orgId: this.$user.orgid,
        orgName: this.$user.orgname,
        limits: 1,
        serviceType: serviceType.join(','),
        ...rest,
      };
      if (!params.crs) delete params.crs;
      await api.db.publishService(params);

      this.publishLoading = false;
      this.$Message.success('服务发布成功！');
      // 刷新当前页面
      const currentNode = this.$store.state.app.currentDirectory;
      this.$store.dispatch(types.APP_NODES_FETCH, currentNode);
      // 关闭modal窗口
      this.visibleChange(false);
    },
    // 处理服务名称
    async handleServiceName(name) {
      if (/[\u4e00-\u9fa5]/.test(name)) {
        const response = await api.db.findChar(name);
        name = response.data;
      }
      if (!/^[a-zA-Z]/.test(name)) {
        name = `s${name}`;
      }
      return name;
    },
    // crs远程查询
    async remoteMethod(query) {
      this.crsLoading = true;
      const response = await api.db.findSrs({
        objCondition: {
          authSrId: query, // 坐标系统id
        },
        pageIndex: 1, // 分页索引
        pageSize: 10, // 分页大小
      });
      this.$nextTick(() => {
        this.crsOptions = response.data.dataSource;
        this.crsLoading = false;
      });
    },
    // 样式文件临时上传
    async styleUpload(e) {
      const file = e.target.files[0];
      const alias = file.name.match(/(.*)\.sld$/)[1];
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'data',
        JSON.stringify({
          name: file.name,
          alias,
          description: '',
          classify: '',
          typeId: '20102',
          TypeName: 'sld',
          catalogId: this.current.childId,
          userId: this.$user.id,
          userName: this.$user.name,
          orgId: this.$user.orgid,
          orgName: this.$user.orgname,
        })
      );
      const response = await api.db.addStyle({}, formData);
      this.$Message.success('样式上传成功！');
      await this.getStyle(this.node);
      const style = this.styleOptions.find(item => item.id === response.data);
      if (style) {
        this.publishForm.styles = style.name;
      } else {
        this.$Message.warning('样式类别与资源类别不一致');
      }
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    :mask-closable="false"
    title="服务发布"
    @on-visible-change="visibleChange"
  >
    <div slot="footer">
      <Button
        :loading="publishLoading"
        type="primary"
        size="large"
        long
        @click="publish">发布</Button>
    </div>
    <Form
      ref="form"
      :model="publishForm"
      :rules="ruleValidate"
      :label-width="80">
      <FormItem
        label="服务标题"
        prop="title">
        <Input v-model="publishForm.title"></Input>
      </FormItem>
      <FormItem
        label="空间参考"
        prop="crs">
        <Select
          v-model="publishForm.crs"
          :remote-method="remoteMethod"
          :loading="crsLoading"
          filterable
          remote
        >
          <Option
            v-for="option in crsOptions"
            :label="`${option.authName}:${option.authSrId}`"
            :value="option.authSrId"
            :key="option.id">
            <span class="crs-name">{{ `${option.authName}:${option.authSrId}` }}</span>
            <span class="crs-info">{{ option.srName }}</span>
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="渲染样式"
        prop="styles">
        <Select
          v-model="publishForm.styles"
          filterable>
          <Option
            v-for="option in styleOptions"
            :label="option.alias"
            :value="option.name"
            :key="option.id">
            <span class="style-name">{{ option.alias }}</span>
            <span class="style-info">{{ new Date(option.updateTime).toLocaleDateString() }}</span>
          </Option>
        </Select>
        <label for="style">
          <SvgIcon
            icon-class="upload"
            size="18"
            color="#318CF0">
          </SvgIcon>
        </label>
        <input
          id="style"
          hidden
          type="file"
          name="file"
          @input="styleUpload">
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务名称"
        prop="name">
        <Input v-model="publishForm.name"></Input>
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务类型"
        prop="serviceType">
        <CheckboxGroup v-model="publishForm.serviceType">
          <Checkbox
            label="12"
            disabled>WMS</Checkbox>
          <Checkbox
            label="6"
            disabled>WFS</Checkbox>
          <Checkbox
            label="20"
            disabled>WFS-G</Checkbox>
          <Checkbox
            label="5"
            disabled>WMTS</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务描述"
        prop="description">
        <Input
          v-model="publishForm.description"
          :autosize="{minRows: 2,maxRows: 5}"
          type="textarea"
          placeholder="请输入服务描述信息..."></Input>
      </FormItem>
    </Form>
    <!-- 控制是否显示服务发布详细信息 -->
    <div
      class="show-more"
      @click="showMore = !showMore">
      <Icon :type="showMore ? 'chevron-up' : 'chevron-down'"></Icon>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.k-form-item {
  /deep/ &-content {
    display: flex;
    .k-svgicon {
      padding: 2px 10px 0 10px;
      cursor: pointer;
    }
  }
}
.crs-info,
.style-info {
  float: right;
  color: #bbbec4;
}
.show-more {
  height: 16px;
  margin-bottom: -16px;
  text-align: center;
  .k-icon {
    transition: all 0.3s;
    &:hover {
      cursor: pointer;
      transform: scale(1.5);
    }
  }
}
</style>
