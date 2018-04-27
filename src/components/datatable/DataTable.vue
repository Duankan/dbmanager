<script>
import { createTableHeader } from './utils';

const MAP_WFS_QUERY = 'MAP_WFS_QUERY';

export default {
  name: 'DataTable',
  props: {
    height: {
      type: [String, Number],
      default: 200,
    },
  },
  data() {
    return {
      tableData: [],
      pageIndex: 0,
      pageSize: 10,
      total: 0,
    };
  },
  computed: {
    queryOptions() {
      return this.$store.state.bus.attribute;
    },
    columns() {
      return createTableHeader(this.tableData);
    },
  },
  watch: {
    queryOptions(options) {
      options.forEach(async option => {
        delete option.title;
        const response = await this.$store.dispatch(MAP_WFS_QUERY, option);
        console.log(response);
      });
    },
  },
  methods: {
    label(h) {
      return (
        <span>
          1234
          <icon type="ios-close-empty" />
        </span>
      );
    },
  },
};
</script>

<template>
  <div class="datatable">
    <Tabs
      value="name1">
      <TabPane
        :label="label"
        name="name1">
        <Table
          :columns="columns"
          :data="tableData"
          :height="height"
          stripe
          size="small"
        ></Table>
        <Page
          :total="total"
          :page-size="10"
          :page-size-opts="[10, 20, 30, 40]"
          size="small"
          placement="top"
          show-total
          show-elevator
          show-sizer
          @on-change="(val) => pageIndex = val"
          @on-page-size-change="val => pageSize = val"
        ></Page>
      </TabPane>
    </Tabs>
  </div>
</template>

<style lang="less" scoped>
.k-page {
  margin: 10px 0;
}
</style>
