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
          title: '空间参考',
          key: 'crs',
          render: (h, params) => {
            if (params.row._edit) {
              return (
                <Select
                  value={params.row.crsId}
                  remote-method={this.getSpatialRefs}
                  label-in-value
                  filterable
                  remote
                  placeholder={'搜索空间参考'}
                  onOn-change={e => {
                    params.row.crsName = e.label;
                    params.row.crsId = e.value;
                  }}
                >
                  {this.crs.map(p => (
                    <Option value={p.authSrId} key={p.authSrId}>
                      {`${p.authName}:${p.authSrId}`}
                    </Option>
                  ))}
                </Select>
              );
            } else {
              return <p> {`${params.row.crsName}`}</p>;
            }
          },
        },
        {
          title: '渲染样式',
          key: 'style',
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
      ],
      //表格数据
      data: [],
      //服务列表
      services: [],
      //样式列表
      styles: [],
      //空间参考列表
      crs: [],
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
      await this.getStyles();
      this.getResources();
    },
    //重置控件状态
    resetControl() {},
    //获取样式
    async getStyles() {
      const response = await api.db.findSyleByType({
        orgId: this.$appUser.orgid,
      });
      this.styles = response.data;
    },
    //获取空间参考
    async getSpatialRefs(id) {
      const response = await api.db.findSrs({
        objCondition: {
          authSrId: id, // 坐标系统id
        },
        pageIndex: 1, // 分页索引
        pageSize: 10, // 分页大小
      });
      this.crs = response.data.dataSource;
    },
    //获取可发布的资源
    async getResources() {
      const response = await api.db.findCatalog({
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
      let resources = response.data;
      resources = resources.filter(p => FILTER_TYPES.indexOf(p.typeId) > -1 && !p.pubState);
      resources.forEach(p => {
        p.styleType = getNodeStyleType(p);
        p.styleId = null;
        p.styleName = '';
        p.crsId = p.crs.split(':')[1];
        p.crsName = p.crs;
        p._edit = false;
      });
      this.data = resources;
    },
    editRow(row, index) {
      let rows = this.$refs.publishTable.rebuildData;
      if (rows[index]._edit) return;
      rows.forEach(p => {
        p._edit = p._index == index;
      });
      this.crs = [
        {
          authName: 'EPSG',
          authSrId: rows[index].crsId,
          id: rows[index].crsId,
        },
      ];
    },
  },
};
</script>
<template>
  <Modal
    :value="value"
    :width="700"
    @on-visible-change="visibleChange">
    <Table
      ref="publishTable"
      :columns="columns"
      :data="data"
      @on-row-click="editRow">
    </Table>
  </Modal>
</template>
<style lang="less">
</style>
