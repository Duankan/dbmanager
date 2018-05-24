<script>
import { date } from '@ktw/ktools';
import { isVector } from '@/utils';

export default {
  name: 'ViewInformation',
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
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '名称',
          key: 'name',
        },
        {
          title: '别名',
          key: 'alias',
        },
        {
          title: '类型',
          key: 'type',
        },
      ],
      spatial: {},
    };
  },
  computed: {
    isVector() {
      return isVector(this.node);
    },
    nodeInformation() {
      const {
        name,
        _alias,
        _size,
        shapeType,
        typeName,
        _pubState,
        tag,
        hasMetadata,
        catalogName,
        _userName,
        orgName,
        createTime,
        updateTime,
        description,
      } = this.node;
      return [
        { field: '名称', value: name },
        { field: '别名', value: _alias },
        { field: '大小', value: _size },
        { field: '类型', value: shapeType },
        { field: '类型名称', value: typeName },
        { field: '发布状态', value: _pubState ? '已发布' : '未发布' },
        // { field: '标签', value: tag },
        { field: '元数据', value: hasMetadata },
        { field: '所属目录', value: catalogName },
        { field: '所属用户', value: _userName },
        { field: '所属组织', value: orgName },
        { field: '创建时间', value: date.format(new Date(createTime), 'YYYY-M-D HH:mm') },
        { field: '更新时间', value: date.format(new Date(updateTime), 'YYYY-M-D HH:mm') },
        // { field: '描述', value: description ? description : '暂无描述' },
      ];
    },
  },
  methods: {
    visibleChange(visible) {
      this.$emit('input', visible);
    },
    copy(e) {
      this.$clipboard(e.target.textContent).then(e => {
        this.$Message.success('复制成功');
      });
    },
    async toggle(name) {
      if (name === 'spatial') {
        const response = await api.db.findSrsById({
          id: this.node.crs.split(':')[1],
        });
        this.spatial = response.data;
      }
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    width="400"
    scrollable
    @on-visible-change="visibleChange">
    <Tabs
      v-if="value"
      value="base"
      @on-click="toggle">
      <TabPane
        label="基本信息"
        name="base">
        <table class="information-table">
          <tr
            v-for="item in nodeInformation"
            :key="item.field">
            <th>{{ item.field }}</th>
            <td>{{ item.value }}</td>
          </tr>
        </table>
      </TabPane>
      <TabPane
        v-if="isVector"
        label="空间信息"
        name="spatial">
        <table class="information-table">
          <tr>
            <th>编号 :</th>
            <td @click="copy">{{ `${spatial.authName}:${spatial.authSrId}` }}</td>
          </tr>
          <tr>
            <th>名称 :</th>
            <td @click="copy">{{ spatial.srName }}</td>
          </tr>
          <tr>
            <th>范围 :</th>
            <td @click="copy">{{ node.bbox }}</td>
          </tr>
          <tr>
            <th>WKT :</th>
            <td @click="copy">{{ spatial.srText }}</td>
          </tr>
        </table>
      </TabPane>
      <TabPane
        v-if="isVector"
        label="属性信息"
        name="fields">
        <Table
          :columns="columns"
          :data="node.schema"
          :height="400"
          size="small"
          stripe></Table>
      </TabPane>
    </Tabs>
    <div slot="footer"></div>
  </Modal>
</template>

<style lang="less" scoped>
.information-table {
  table-layout: fixed;
  width: 100%;
  th,
  td {
    height: 40px;
    line-height: 2.5;
    vertical-align: top;
    word-break: break-all;
  }
  th {
    width: 60px;
  }
}
.k-table-wrapper {
  border: none;
  /deep/ .k-table {
    &::before,
    &::after {
      background-color: transparent;
    }
    th {
      border: none;
    }
  }
}
.k-modal {
  /deep/ &-close {
    z-index: 1;
  }
  /deep/ &-footer {
    padding: 0;
    border: none;
  }
}
</style>
