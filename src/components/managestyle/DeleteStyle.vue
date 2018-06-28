<script>
import { deleteStatus, getDelelteStatus } from '@/utils/helps';
import { date, filesize } from '@ktw/ktools';
export default {
  name: 'DeleteStyle',
  props: {
    errorData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 表列字段
      tableColumns: [
        {
          title: '样式别名',
          ellipsis: true,
          key: 'alias',
        },
        {
          title: '文件大小',
          ellipsis: true,
          key: 'filesize',
        },
        {
          title: '入库时间',
          ellipsis: true,
          key: 'createTime',
        },
        {
          title: '上传失败原因',
          ellipsis: true,
          key: 'errorData',
        },
      ],
      tableData: [],
    };
  },
  watch: {
    errorData: {
      handler(newVals) {
        newVals.forEach(item => {
          this.tableData.push({
            alias: item.alias,
            filesize: filesize(item.size),
            createTime: date.format(new Date(item.createTime), 'YYYY-M-D HH:mm'),
            errorData: getDelelteStatus(item.errorCallback.statusCode),
          });
        });
      },
      immediate: true,
    },
  },
  methods: {
    logOut() {
      this.tableData = [];
      this.$emit('on-close-style', false);
    },
  },
};
</script>

<template>
  <div class="db-delete-style">
    <Table
      :columns="tableColumns"
      :data="tableData"
      height="350"
      stripe
      border
      highlight-row
      size="small"
    >
    </Table>
    <Button
      type="primary"
      long
      @click="logOut"
    >返回
    </Button>
  </div>
</template>

<style lang="less" scoped>
</style>
