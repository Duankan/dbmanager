<script>
import PlanTable from './PlanTable';
import PlanCreate from './PlanCreate';

export default {
  name: 'PlanExtract',
  components: { PlanTable, PlanCreate },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      current: 0,
      btnContent: '新增方案',
      catalog: [],
    };
  },
  methods: {
    async next() {
      if (this.current == 1) {
        this.current = 0;
        this.btnContent = '新增方案';
      } else if (this.current < 1) {
        this.current++;
        this.btnContent = '返回';
        const response = await api.db.findCatalog({
          owner: 1,
          ownerId: this.$user.orgid,
          access: 1,
          hasChild: false,
          orderby: 'sort_asc',
        });
        this.catalog = response.data;
      }
    },
  },
};
</script>
<template>
  <div id="plan-div">
    <p>当前正在进行第 {{ current + 1 }} 步</p>
    <Steps :current="current">
      <Step title="方案列表"></Step>
      <Step title="方案搭建"></Step>
    </Steps>
    <PlanTable
      v-if="current==0"
      :value="value"></PlanTable>
    <PlanCreate
      v-if="current==1"
      :value="catalog"></PlanCreate>
    <div class="btnclass">
      <Button
        type="primary"
        @click="next">{{ btnContent }}</Button></div>
  </div>
</template>
<style lang="less" scoped>
@maxheight: 550px;
#plan-div {
  height: @maxheight;
  overflow-y: scroll;
}

.btnclass {
  margin-top: 10px;
}
</style>
