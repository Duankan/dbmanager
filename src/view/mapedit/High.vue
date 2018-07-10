
<script>
export default {
  name: 'High',
  data() {
    return {
      soleAndSection: '', //选择是单选还是分段数
      proportion: '', //颜色渐变的数组
    };
  },
};
</script>

<template>
  <div>
    <RadioGroup v-model="soleAndSection">
      <Radio label="唯一值"></Radio>
      <Radio label="分段数"></Radio>
    </RadioGroup>
    <p>
      <span>
        字段：
      </span>
      <Select
        style="width:150px">
      </Select>
      <span>
        颜色渐变：
      </span>
      <Select
        style="width:150px">
        <Option
          v-for="item in proportion"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
    </p>
  </div>
</template>

<style>
</style>
