<script>
import * as types from '@/store/types';
import BatchPublish from './BatchPublish';
import api from 'api';

export default {
  name: 'Publish',
  components: {
    BatchPublish,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    nodes: {
      type: Array,
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
      tableData: [], // 多个服务发布对象
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
        crs: [{ required: true, message: '空间参考值不能为空', trigger: 'blur' }],
        styles: [{ required: true, message: '渲染样式不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
        serviceType: [
          { required: true, type: 'string', message: '服务类型不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    styleType() {
      const shapeType = 'POLYGON';
      switch (shapeType.toUpperCase()) {
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
  },
  watch: {
    nodes(val) {
      this.tableData = val.map(item => {
        let serviceName = item.name;
        if (!/^[a-zA-Z]/.test(item.name)) {
          serviceName = `s${serviceName}`;
        }
        // if (/[\u4e00-\u9fa5]/.test(serviceName)) {
        //   serviceName = await this.hz2py(val[0].name);
        // }
        return {
          title: item.name,
          crs: '',
          styles: '',
          name: serviceName,
          serviceType: ['12', '6'],
        };
      });
    },
  },
  async created() {
    // 获取空间参考
    this.remoteMethod('');
    // 获取样式信息
    const response = await api.db.findSyleByType({
      orgId: this.$user.orgid,
      type: this.styleType,
    });
    this.styleOptions = response.data;
  },
  methods: {
    // 点击发布按钮，发布服务，并将axios对象添加到任务队列
    publish() {
      this.nodes.forEach(async (item, index) => {
        const { serviceType, ...rest } = this.tableData[index];
        const params = {
          catalogId: item.catalogId,
          resourceId: item.resourceId,
          userId: this.$user.id,
          userName: this.$user.name,
          orgId: this.$user.orgid,
          orgName: this.$user.orgname,
          limits: 1,
          serviceType: serviceType.join(','),
          ...rest,
        };
        if (!params.crs) delete params.crs;
        const response = await api.db.publishService(params);
      });
      // 刷新当前页面
      const currentNode = this.$store.state.app.currentDirectory;
      this.$store.dispatch(types.APP_NODES_FETCH, currentNode);
      // 关闭modal窗口
      this.visibleChange(false);
    },
    visibleChange(visible) {
      if (!visible) {
        this.tableData = [];
        this.$refs['form'] && this.$refs['form'].resetFields();
      }
      this.$emit('input', visible);
    },
    // 资源名称转拼音，作为默认服务标题和服务名称
    async hz2py(str) {
      const response = await api.db.findChar(str);
      return response.data;
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
      v-if="nodes.length === 1"
      ref="form"
      :model="tableData[0]"
      :rules="ruleValidate"
      :label-width="80">
      <FormItem
        label="服务标题"
        prop="title">
        <Input v-model="tableData[0].title"></Input>
      </FormItem>
      <FormItem
        label="空间参考"
        prop="crs">
        <Select
          v-model="tableData[0].crs"
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
          v-model="tableData[0].styles"
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
        <!-- <Upload
          multiple
          action="//jsonplaceholder.typicode.com/posts/">
          <SvgIcon
            icon-class="upload"
            size="18"
            color="#318CF0"></SvgIcon>
        </Upload> -->
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务名称"
        prop="name">
        <Input v-model="tableData[0].name"></Input>
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务类型"
        prop="serviceType">
        <CheckboxGroup v-model="tableData[0].serviceType">
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
          v-model="tableData[0].description"
          :autosize="{minRows: 2,maxRows: 5}"
          type="textarea"
          placeholder="请输入服务描述信息..."></Input>
      </FormItem>
    </Form>
    <!-- 控制是否显示服务发布详细信息 -->
    <div
      v-if="nodes.length === 1"
      class="show-more"
      @click="showMore = !showMore">
      <Icon :type="showMore ? 'chevron-up' : 'chevron-down'"></Icon>
    </div>
    <BatchPublish
      v-else
      :value="tableData"></BatchPublish>
  </Modal>
</template>

<style lang="less" scoped>
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
