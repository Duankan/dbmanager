
<script>
export default {
  name: 'Currency',
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
    };
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
        placeholder="Enter something..."
        style="width: 300px"></Input>
    </p>
    <p class="p">
      <span>
        偏移&#160;&#160;&#160;&#160;&#160;&#160;&#160;：
      </span>
      <InputNumber
        :max="10"
        :min="-10"
        style="width: 150px"
      ></InputNumber>
      <InputNumber
        :max="10"
        :min="-10"
        style="width: 150px" ></InputNumber>
    </p>
    <p class="p">
      <span>
        最大比例尺：
      </span>
      <Select
        style="width:289px">
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
