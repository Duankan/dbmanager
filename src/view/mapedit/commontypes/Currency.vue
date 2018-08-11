//通用
<script>
export default {
  name: 'Currency',
  props: {
    msg: { type: Object, default: () => {} },
  },
  data() {
    return {
      proportion: [
        {
          value: '500',
          label: '500',
        },
        {
          value: '1000',
          label: '1000',
        },
        {
          value: '2000',
          label: '2000',
        },
        {
          value: '2500',
          label: '2500',
        },
        {
          value: '5000',
          label: '5000',
        },
        {
          value: '10000',
          label: '10000',
        },
        {
          value: '20000',
          label: '20000',
        },
        {
          value: '50000',
          label: '50000',
        },
        {
          value: '100000',
          label: '100000',
        },
      ],
      rulename: '', //绑定的规格名称的值
      xSkewing: 0, //绑定x偏移值
      ySkewing: 0, //绑定y偏移值
      maxRatio: '',
      minRatio: '',
    };
  },
  created() {
    this.getRuleName();
  },
  methods: {
    //获取规格名称
    async getRuleName() {
      const params = {
        stylename: this.msg.data.styles,
      };
      let cc = await api.db.getsldbyname(params);

      this.rulename = cc.data.nameLayers['0'].name;
    },
  },
};
</script>

<template>
  <div>

    <p class="p">
      <span>
        规格名称：
      </span>
      <Input
        v-model="rulename"
        placeholder="Enter something..."
        style="width: 300px"></Input>
    </p>
    <p class="p">
      <span>
        偏移xy&#160;&#160;&#160;：
      </span>
      <InputNumber
        :max="10"
        :min="-10"
        v-model="xSkewing"
        style="width: 150px"
      ></InputNumber>
      <InputNumber
        :max="10"
        :min="-10"
        v-model="ySkewing"
        style="width: 150px" ></InputNumber>
    </p>
    <p class="p">
      <span>
        最大比例尺：
      </span>
      <Select
        v-model="maxRatio"
        style="width:289px"
      >
        <Option
          v-for="item in proportion"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </p>
    <p class="p">
      <span>
        最小比例尺：
      </span>
      <Select
        v-model="minRatio"
        class="p"
        style="width:289px;margin: 0;">
        <Option
          v-for="item in proportion"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </p>
  </div>
</template>

<style lang="less" scoped>
.p {
  margin: 12px 0 0 0;
}
</style>
