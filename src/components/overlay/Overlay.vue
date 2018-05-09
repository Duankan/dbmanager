<script>
export default {
  name: 'Overlay',
  props: {},
  data() {
    return {
      formTop: {
        input1: '',
        input2: '',
        input3: '',
      },
    };
  },
};
</script>

<template>
  <Window :value="true">
    <Form
      :model="formTop"
      label-position="top">
      <FormItem label="Title">
        <Input v-model="formTop.input1"></Input>
      </FormItem>
      <FormItem label="Title name">
        <Input v-model="formTop.input2"></Input>
      </FormItem>
      <FormItem label="Aligned title">
        <Input v-model="formTop.input3"></Input>
      </FormItem>
    </Form>
  </Window>
</template>

<style lang="less" scoped>
</style>
