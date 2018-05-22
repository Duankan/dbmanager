<script>
import BatchPublish from './BatchPublish';
import api from 'api';

const REMOVE_BUS_PUBLISH = 'REMOVE_BUS_PUBLISH';

export default {
  name: 'Publish',
  components: {
    BatchPublish,
  },
  data() {
    return {
      showModel: false,
      crsLoading: false,
      publishLoading: false,
      showMore: false, // 控制显示详细信息
      crsOptions: [],
      styleOptions: [],
      formValidate: {
        title: '',
        crs: '',
        style: '',
        name: '',
        serviceType: ['WMS', 'WFS'],
        description: '',
      },
      ruleValidate: {
        title: [
          { required: true, message: '服务标题不能为空', trigger: 'blur' },
          // { type: /^[0-9]*$/, message: '不能以数字开头', trigger: 'change' },
          {
            type: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
            message: '只能输入中文、字母、数字、下划线',
            trigger: 'change',
          },
        ],
        crs: [{ required: true, message: '空间参考值不能为空', trigger: 'blur' }],
        style: [{ required: true, message: '渲染样式不能为空', trigger: 'blur' }],
        name: [{ required: true, type: 'date', message: '服务名称不能为空', trigger: 'blur' }],
        serviceType: [
          { required: true, type: 'string', message: '服务类型不能为空', trigger: 'blur' },
        ],
      },
      tableData: [],
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
    publishResource() {
      return this.$store.state.bus.publish;
    },
  },
  watch: {
    async publishResource(val) {
      this.showModel = true;
      if (val.length === 1) {
        // todo 公共正则表达式
        let serviceName = val[0].name;
        if (/[\u4e00-\u9fa5]/.test(serviceName)) {
          serviceName = await this.hz2py(val[0].name);
        }
        this.formValidate.name = serviceName;
        this.formValidate.title = val[0].name;
      } else {
        const template = {
          title: '',
          crs: '',
          style: '',
          name: '',
          serviceType: ['WMS', 'WFS'],
        };
        val.forEach(async item => {
          let serviceName = item.name;
          if (/[\u4e00-\u9fa5]/.test(serviceName)) {
            serviceName = await this.hz2py(val[0].name);
          }
          template.name = serviceName;
          template.title = item.name;
          this.tableData.push(template);
        });
      }
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
    async publish() {
      if (this.publishResource.length === 1) {
        const params = Object.assign(
          {
            catalogId: this.publishResource[0].catalogId,
            resourceId: this.publishResource[0].resourceId,
            userId: this.$user.id,
            userName: this.$user.name,
            limits: 1,
          },
          this.formValidate
        );
        const response = await api.db.publishService(params);
      } else {
        this.publishResource.forEach(async (item, index) => {
          const params = Object.assign(
            {
              catalogId: item.catalogId,
              resourceId: item.resourceId,
              userId: this.$user.id,
              userName: this.$user.name,
              limits: 1,
            },
            this.tableData[index]
          );
          const response = await api.db.publishService(params);
        });
      }
      this.cancel();
    },
    // 取消服务发布，清除bus store中publish存储的资源信息对象
    cancel() {
      this.$store.commit(REMOVE_BUS_PUBLISH);
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
        pageSize: 50, // 分页大小
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
    v-model="showModel"
    :mask-closable="false"
    title="服务发布"
    @on-cancel="cancel"
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
      v-if="publishResource.length === 1"
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80">
      <FormItem
        label="服务标题"
        prop="title">
        <Input v-model="formValidate.title"></Input>
      </FormItem>
      <FormItem
        label="空间参考"
        prop="crs">
        <Select
          v-model="formValidate.crs"
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
        prop="style">
        <Select
          v-model="formValidate.style"
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
        <Input v-model="formValidate.name"></Input>
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务类型"
        prop="serviceType">
        <CheckboxGroup v-model="formValidate.serviceType">
          <Checkbox
            label="WMS"
            disabled></Checkbox>
          <Checkbox
            label="WFS"
            disabled></Checkbox>
            <!-- <Checkbox label="WFS-G" disabled></Checkbox> -->
        </CheckboxGroup>
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务描述"
        prop="description">
        <Input
          v-model="formValidate.description"
          :autosize="{minRows: 2,maxRows: 5}"
          type="textarea"
          placeholder="请输入服务描述信息..."></Input>
      </FormItem>
    </Form>
    <!-- 控制是否显示服务发布详细信息 -->
    <div
      v-if="publishResource.length === 1"
      class="show-more"
      @click="showMore = !showMore">
      <Icon
        type="minus-round"
        size="16"></Icon>
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
      color: #318cf0;
    }
  }
}
</style>
