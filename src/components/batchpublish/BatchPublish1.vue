<script>
import { getNodeStyleType } from '@/utils/helps';

//可批量发布的类型
const FILTER_TYPES = ['20001', '20005', '20010', '20011', '20012'];

/**
 * 批量发布服务模块
 */
export default {
  name: 'BatchPublish1',
  props: {
    //对话框显示隐藏
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //表格列表
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '服务名称',
          key: 'name',
          ellipsis: true,
          render: (h, params) => {
            if (params.row._edit) {
              return (
                <Input
                  value={params.row.name}
                  onOn-change={e => {
                    params.row.name = e.target.value;
                  }}
                />
              );
            } else {
              return <p>{params.row.name}</p>;
            }
          },
        },
        {
          title: '服务标题',
          key: 'alias',
          ellipsis: true,
          render: (h, params) => {
            if (params.row._edit) {
              return (
                <Input
                  value={params.row.alias}
                  onOn-change={e => {
                    params.row.alias = e.target.value;
                  }}
                />
              );
            } else {
              return <p>{params.row.alias}</p>;
            }
          },
        },
        {
          title: '空间参考',
          key: 'crs',
          width: 110,
          render: (h, params) => {
            if (params.row._edit) {
              return (
                <Select
                  value={params.row.crsId}
                  remote-method={async e => {
                    const response = await api.db.findSrs({
                      objCondition: {
                        authSrId: e,
                      },
                      pageIndex: 1,
                      pageSize: 10,
                    });
                    params.row.crsList = response.data.dataSource;
                  }}
                  filterable
                  remote
                  placeholder={'搜索空间参考'}
                  onOn-change={e => {
                    params.row.crsId = e;
                  }}
                >
                  {params.row.crsList.map(p => (
                    <Option value={p.authSrId} key={p.authSrId}>
                      {p.authSrId}
                    </Option>
                  ))}
                </Select>
              );
            } else {
              return <p> {`${params.row.crsId}`}</p>;
            }
          },
        },
        {
          title: '渲染样式',
          key: 'style',
          width: 165,
          render: (h, params) => {
            let renderStyles = this.styles.filter(p => p.type == params.row.styleType);
            if (params.row._edit) {
              return (
                <Select
                  value={params.row.styleId}
                  label-in-value={true}
                  onOn-change={e => {
                    params.row.styleId = e.value;
                    params.row.styleName = e.label;
                  }}
                >
                  {renderStyles.map(p => (
                    <Option value={p.id} key={p.id}>
                      {p.alias}
                    </Option>
                  ))}
                </Select>
              );
            } else {
              return <p>{params.row.styleName}</p>;
            }
          },
        },
        {
          title: '状态',
          key: 'state',
          width: 60,
          render: (h, params) => {
            let legend = this.legends.find(p => p.value == params.row._state);
            return <div class="state-legend" style={{ 'background-color': legend.color }} />;
          },
        },
      ],
      //表格数据
      data: [],
      //服务列表
      services: [],
      //样式列表
      styles: [],
      //图例配置
      legends: [
        {
          value: '0',
          color: '#d9d9d9',
          text: '发布尚未执行',
        },
        {
          value: '1',
          color: '#19be6b',
          text: '发布成功',
        },
        {
          value: '2',
          color: '#ff9900',
          text: '服务已存在',
        },
        {
          value: '3',
          color: '#ed3f14',
          text: '发布失败',
        },
      ],
      //正在发布
      loading: false,
      //发布进度
      progress: 0,
    };
  },
  computed: {
    //当前目录
    current() {
      return this.$store.state.app.currentDirectory;
    },
    //当前选择节点
    node() {
      return this.$store.state.app.selectNodes[0];
    },
  },
  methods: {
    //模态框显示隐藏
    visibleChange(visible) {
      if (visible) {
        this.initControl();
      } else {
        this.resetControl();
      }
      this.$emit('input', visible);
    },
    //初始化控件
    async initControl() {
      //获取样式
      const styleRes = await api.db.findSyleByType({
        orgId: this.$appUser.orgid,
      });
      this.styles = styleRes.data;
      //获取可发布的资源
      const serviceRes = await api.db.findCatalog({
        owner: 1,
        ownerId: this.$appUser.orgid,
        access: 1,
        hasChild: false,
        relatedType: 1,
        orderby: 'sort_asc',
        getmode: 'all',
        resourceTypeId: '1,2',
        parentId: this.node.childId,
      });
      let resources = serviceRes.data;
      resources = resources.filter(p => FILTER_TYPES.indexOf(p.typeId) > -1 && !p.pubState);
      resources.forEach(p => {
        p.styleType = getNodeStyleType(p);
        p.styleId = null;
        p.styleName = '';
        p.crsId = p.crs.split(':')[1];
        p.crsList = [
          {
            authSrId: p.crsId,
          },
        ];
        p._edit = false;
        p._state = 0;
      });
      this.data = resources;
    },
    //重置控件状态
    resetControl() {
      this.loading = false;
      this.data = [];
      this.services = [];
      this.styles = [];
      this.progress = 0;
    },
    //编辑表格行
    editRow(row, index) {
      let rows = this.$refs.publishTable.rebuildData;
      if (rows[index]._edit) return;
      rows.forEach(p => {
        p._edit = p._index == index;
      });
    },
    //批量发布
    batchPublish() {
      //获取选择的资源
      let selection = this.$refs.publishTable.getSelection();
      let resIds = selection.map(p => p.resourceId);
      let rows = this.$refs.publishTable.rebuildData;
      let services = rows.filter(p => resIds.indexOf(p.resourceId) > -1);
    },
    //取消
    cancel() {
      this.visibleChange(false);
    },
  },
};
</script>
<template>
  <Modal
    :value="value"
    :width="770"
    title="批量发布服务"
    @on-visible-change="visibleChange">
    <div class="legend-wrapper clearfix">
      <div
        v-for="item in legends"
        :key="item.value"
        class="legend-item">
        <i :style="{backgroundColor:item.color}"></i>
        <span class="legend-text">{{ item.text }}</span>
      </div>
    </div>
    <Table
      ref="publishTable"
      :columns="columns"
      :data="data"
      height="330"
      @on-row-click="editRow">
    </Table>
    <div class="progress-wrapper">
      <label>发布进度：</label>
      <Progress :percent="progress"></Progress>
    </div>
    <div slot="footer">
      <Button
        type="ghost"
        @click="cancel">取消</Button>
      <Button
        type="primary"
        @click="batchPublish">批量发布</Button>
    </div>
    <Spin
      v-if="loading"
      fix>
      <Icon
        type="load-c"
        size="18"
        class="circle-spin-icon-load"></Icon>
    <div>正在发布服务...</div></Spin>
  </Modal>
</template>
<style lang="less" scoped>
.legend-wrapper {
  border: 1px solid #dddddd;
  border-bottom: 0;
  border-radius: 2px 2px 0 0;
  .legend-item {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    float: left;
    > i {
      width: 16px;
      height: 16px;
      border-radius: 8px;
      display: inline-block;
      background-color: #19be6b;
    }
    .legend-text {
      vertical-align: 3px;
      margin-left: 4px;
    }
  }
}
/deep/ .state-legend {
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #19be6b;
}
.progress-wrapper {
  margin-top: 10px;
  padding: 5px;
  display: flex;
  > label {
    width: 120px;
  }
}
</style>
