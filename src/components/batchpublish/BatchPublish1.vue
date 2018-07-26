<script>
import { getNodeStyleType } from '@/utils/helps';

//可批量发布的类型
const FILTER_TYPES = ['20001', '20005', '20010', '20011', '20012'];

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
      crs: [
        { key: '参考1', value: 18 },
        { key: '参考2', value: 24 },
        { key: '参考3', value: 30 },
        { key: '参考4', value: 26 },
      ],
      columns1: [
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
          key: 'age',
          render: (h, params) => {
            if (params.row._edit) {
              return (
                <Select
                  value={params.row.age}
                  onOn-change={e => {
                    params.row.age = e;
                  }}
                >
                  {this.crs.map(p => (
                    <Option value={p.value} key={p.value}>
                      {p.value}
                    </Option>
                  ))}
                </Select>
              );
            } else {
              return <p>{params.row.age}</p>;
            }
          },
        },
        {
          title: '渲染样式',
          key: 'address',
          render: (h, params) => {
            if (params.row._edit) {
              return (
                <Select
                  value={params.row.age}
                  onOn-change={e => {
                    params.row.age = e;
                  }}
                >
                  {this.crs.map(p => (
                    <Option value={p.value} key={p.value}>
                      {p.value}
                    </Option>
                  ))}
                </Select>
              );
            } else {
              return <p>{params.row.age}</p>;
            }
          },
        },
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03',
          _edit: false,
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01',
          _edit: false,
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02',
          _edit: false,
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04',
          _edit: false,
        },
      ],
      services: [],
      pointStyles: [],
      lineStyles: [],
      polygonStyles: [],
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
      let styles = response.data;
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
      });
      debugger;
    },
    editRow(row, index) {
      let rows = this.$refs.table1.rebuildData;
      rows.forEach(p => {
        p._edit = p._index == index;
      });
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
      ref="table1"
      :columns="columns1"
      :data="data1"
      @on-row-click="editRow">
    </Table>
  </Modal>
</template>
<style lang="less">
</style>
