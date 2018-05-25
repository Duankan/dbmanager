<script>
import api from 'api';

export default {
  name: 'BatchPublish',
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
      publishLoading: false,
      crsOptions: [],
      styleOptions: [],
      tableData: [],
      columns: [
        {
          title: '服务标题',
          key: 'title',
          align: 'center',
          render: (h, params) => {
            return (
              <Input
                value={params.row.title}
                onOn-change={e => (this.tableData[params.index].title = e.target.value)}
              />
            );
          },
        },
        {
          title: '服务名称',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            return (
              <Input
                value={params.row.name}
                onOn-change={e => (this.tableData[params.index].name = e.target.value)}
              />
            );
          },
        },
        {
          title: '空间参考',
          key: 'crs',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return (
              <Select
                value={params.row.crs}
                remote-method={this.remoteMethod}
                loading={this.crsLoading}
                filterable
                remote
                onOn-change={val => {
                  this.remoteMethod('');
                  console.log(params);
                  this.tableData[params.index].crs = val;
                }}
              >
                {this.crsOptions.map(option => (
                  <Option
                    label={`${option.authName}:${option.authSrId}`}
                    value={option.authSrId}
                    key={option.id}
                  />
                ))}
              </Select>
            );
          },
        },
        {
          title: '渲染样式',
          key: 'styles',
          align: 'center',
          render: (h, params) => {
            const styleType = this.getStyleType(params.row.shapeType);
            const styleOptions = this.styleOptions.filter(node => node.type === styleType);
            return (
              <Select
                value={params.row.styles}
                filterable
                onOn-change={val => (this.tableData[params.index].styles = val)}
              >
                {styleOptions.map(style => (
                  <Option label={style.alias} value={style.name} key={style.id}>
                    {style.alias}
                  </Option>
                ))}
              </Select>
            );
          },
        },
        {
          title: '服务类型',
          key: 'serviceType',
          align: 'center',
          width: 200,
          render: (h, params) => {
            return (
              <Select
                value={params.row.serviceType}
                multiple
                onOn-change={val => (this.tableData[params.index].serviceType = val)}
              >
                <Option value="12">WMS</Option>
                <Option value="6">WFS</Option>
                <Option value="20" disabled>
                  WFS-G
                </Option>
                <Option value="5" disabled>
                  WMTS
                </Option>
              </Select>
            );
          },
        },
      ],
    };
  },
  watch: {
    async nodes(val) {
      this.tableData = await Promise.all(
        val.map(async node => {
          const name = await this.handleServiceName(node.name);
          return {
            title: node.name,
            crs: '',
            styles: '',
            name,
            serviceType: ['12', '6'],
            shapeType: node.shapeType,
          };
        })
      );
    },
  },
  created() {
    this.remoteMethod('');
    this.getStyle();
  },
  methods: {
    visibleChange(visible) {
      this.$emit('input', visible);
    },
    // 获取所有样式信息
    async getStyle() {
      const response = await api.db.findSyleByType({
        orgId: this.$user.orgid,
      });
      this.styleOptions = response.data;
    },
    // 获取资源节点样式类别 render中调用
    getStyleType(shapeType) {
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
    // 点击发布按钮，发布服务，并将axios对象添加到任务队列
    async publish() {
      this.publishLoading = true;
      await Promise.all(
        this.nodes.map(async (item, index) => {
          const { serviceType, shapeType, ...rest } = this.tableData[index];
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
          return api.db.publishService(params);
        })
      );
      this.publishLoading = false;
      // 刷新当前页面
      const currentNode = this.$store.state.app.currentDirectory;
      this.$store.dispatch(types.APP_NODES_FETCH, currentNode);
      // 关闭modal窗口
      this.visibleChange(false);
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    :mask-closable="false"
    :width="800"
    title=""
    scrollable
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
    <Table
      :columns="columns"
      :data="tableData"
      :height="400"
      size="small"
    ></Table>
  </Modal>

</template>

<style lang="less" scoped>
.k-modal {
  /deep/ &-close {
    z-index: 1;
  }
  /deep/ &-body {
    padding: 20px 0;
  }
}
.k-table-wrapper {
  border: none;

  /deep/ .k-table {
    &::after,
    &::before {
      display: none;
    }

    th,
    td {
      border-bottom: none;
      background-color: transparent;
    }
  }
}
</style>
