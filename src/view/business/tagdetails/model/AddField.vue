<script>
export default {
  name: 'AddField',
  data() {
    return {
      //新增字段
      addField: false,
    };
  },
  methods: {
    ok() {
      this.$Message.info('Clicked ok');
    },
    cancel() {
      this.$Message.info('Clicked cancel');
    },
  },
};
</script>

<template>
  <div></div>
</template>

<style lang="less" scoped>
</style>
