<script>
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

      </TabPane>
      <TabPane
        v-if="isVector"
        label="空间信息"
        name="spatial">
        <table class="spatial-information">
          <tr>
            <th>编号:</th>
            <td @click="copy">{{ `${spatial.authName}:${spatial.authSrId}` }}</td>
          </tr>
          <tr>
            <th>名称:</th>
            <td @click="copy">{{ spatial.srName }}</td>
          </tr>
          <tr>
            <th>范围:</th>
            <td @click="copy">{{ node.bbox }}</td>
          </tr>
          <tr>
            <th>WKT:</th>
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
.spatial-information {
  table-layout: fixed;
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
