
<script>
export default {
  name: 'LineType',
  data() {
    return {
      tool: '通用',
    };
  },
};
</script>

<template>
  <div>
    <RadioGroup
      v-model="tool"
    >
      <Radio label="通用"></Radio>
      <Radio label="线"></Radio>
      <Radio label="标注"></Radio>
      <Radio label="线符号"></Radio>
      <Radio label="过滤"></Radio>
    </radiogroup>
    <p>
      <span>
        样式名称：
      </span>
      <Input
        placeholder="Enter something..."
        style="width: 300px"></Input>
    </p>
    <p>
      <span>
        规格名称：
      </span>
      <Input
        placeholder="Enter something..."
        style="width: 300px"></Input>
    </p>
    <p>
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
  </div>
</template>

<style>
</style>
