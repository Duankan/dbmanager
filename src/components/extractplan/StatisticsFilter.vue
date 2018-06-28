<script>
export default {
  name: 'StatisticsFilter',
  props: {
    value: { type: Object, default: () => {} },
  },
  data() {
    return {
      statisticsConfig: [
        {
          key: 'Sum',
          text: '求和',
        },
        {
          key: 'Count',
          text: '求个数',
        },
        {
          key: 'Max',
          text: '最大值',
        },
        {
          key: 'Min',
          text: '最小值',
        },
        {
          key: 'Area',
          text: '面积',
        },
        {
          key: 'Length',
          text: '长度',
        },
      ],
      filter: '',
      way: '',
    };
  },
  methods: {
    statisticsGo() {
      console.log(this.value.condition);
      console.log(this.filter);
      console.log(this.way);
    },
  },
};
</script>
<template >


  <Form >
    <FormItem
      label="选择字段："
    >
      <Select
        v-model="filter"
        style="width:150px"
      >
        <Option
          v-for="item in value.schemas.split(',')"
          :value="item"
          :key="item">{{ item }}</Option>
      </Select>
    </FormItem>
    <FormItem
      label="统计方式：">
      <Select
        v-model="way"
        style="width:150px">
        <Option
          v-for="item in
          statisticsConfig"
          :value="item.key"
          :key="item.key">{{ item.text }}
        </Option>
      </Select>
    </FormItem>
    <FormItem
      label="统计结果：" >
      <Input
        :autosize="{minRows: 2,maxRows: 5}"
        type="textarea"
        placeholder="Enter something...">
        </Input>
    </FormItem>
    <Button
      type="primary"
      style="float: right;"
      @click="statisticsGo()"
    >开始统计</Button>
</Form></template>
