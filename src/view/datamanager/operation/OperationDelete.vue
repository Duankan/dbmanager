<script>
import api from 'api';

export default {
  name: 'OperationDelete',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    node: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: '文件名',
          key: 'alias',
        },
        {
          title: '类型',
          key: 'typeName',
        },
        {
          title: '大小',
          key: 'size',
        },
        {
          title: '上传人',
          key: 'userName',
        },
        {
          title: '所属组织',
          key: 'orgName',
        },
      ],
    };
  },
  computed: {
    tableData() {
      return Array.isArray(node) ? node : [node];
    },
  },
  // alias:"ddxc"
  // aliasPath:"ddxc"
  // catalogId:"0000000062a2b8490162a2b965a10004"
  // catalogName:"国土_组织目录"
  // classify:""
  // cloudFileName:"ffffffffede3787e.docx"
  // createTime:1524469935700
  // deleState:0
  // description:""
  // fResourceId:"4028811362d64ebd0162f17c9c4a0042"
  // hasMetadata:0
  // id:"0000000062e119fb0162f17d2e540154"
  // isChild:"closed"
  // name:"ddxc"
  // orgId:"0000000062a2b8490162a2b965490000"
  // orgName:"国土"
  // parentId:"0000000062a2b8490162a2b965a10004"
  // path:"/clouddisk/source/2dad6390/ffffffffede3787e/ffffffffede3787e.docx"
  // pubState:"-"
  // regState:0
  // resourceId:"0000000062e119fb0162f17d2e540154"
  // resourceTypeId:"1"
  // serviceList:Array[0]
  // size:"11.29 KB"
  // typeId:"10005"
  // typeName:"doc"
  // updateTime:"2018/4/23"
  // userId:"0000000062a2b8490162a2bb4afe0069"
  // userName:"dbadmin"
  methods: {
    async deleteNode() {
      await api.db.deleteResource([this.node.id]);
      this.$Message.success(`文件 ${this.node.alias} 删除成功！`);
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    width="420">
    <p
      slot="header"
      style="color:#f60;text-align:center">
      <Icon type="information-circled"></Icon>
      <span>删除确认</span>
    </p>
    <div style="text-align:center">
      <p>删除操作不可逆，确认删除后，文件将无法被找回！</p>
      <Table
        :columns="columns"
        :data="tableData"
        size="small"></Table>
    </div>
    <div slot="footer">
      <Button
        :loading="loading"
        type="error"
        size="large"
        long
        @click="deleteNode">删除</Button>
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.k-table-wrapper {
  border: none;
}
.k-table {
  &:after,
  &::before {
    background-color: transparent;
  }
  th {
    border: none;
  }
}
</style>
