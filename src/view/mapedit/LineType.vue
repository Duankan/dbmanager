
<script>
import Currency from './LineTypeS/Currency';
import Side from './LineTypeS/Side';
import Fill from './LineTypeS/Fill';
import Tagging from './LineTypeS/Tagging';
import LineSymbol from './LineTypeS/LineSymbol';
export default {
  name: 'PolygonType',
  components: {
    Currency,
    Side,
    Fill,
    Tagging,
    LineSymbol,
  },
  data() {
    return {
      tool: '通用',
    };
  },
};
</script>

<template>
  <div class="outDiv">
    <div class="left">
      <RadioGroup
        v-model="tool"
        class="p">
        <Radio label="通用"></Radio>
        <Radio label="边"></Radio>
        <Radio label="标注"></Radio>
        <Radio label="线符号"></Radio>
        <Radio label="过滤"></Radio>
      </radiogroup>
      <p class="p">
        <span>
          样式名称：
        </span>
        <Input

          style="width: 300px"></Input>
      </p>
      <Currency v-if="tool=='通用'"></Currency>
      <Side v-if="tool=='边'"></Side>
      <Fill v-if="tool=='面填充'"></Fill>
      <Tagging v-if="tool=='标注'"></Tagging>
      <LineSymbol v-if="tool=='线符号'"></LineSymbol>
    </div>

    <div
      class="right">
      <div class="right-top"></div>
      <div class="right-bottom ">
        <Button
          type="ghost"
          icon="ios-plus"

        ></Button>
        <Button
          type="ghost"
          icon="ios-plus-outline"></Button>
        <Button
          type="ghost"
          icon="soup-can"></Button>
        <Button
          type="ghost"
          icon="soup-can-outline"></Button>
    </ButtonGroup>
      </div>
    </div>

    <div class="bottom">
      <Button
        style="float: right;margin:2px;"
        type="primary "
        icon="ios-search">另存</Button>
      <Button
        style="float: right;margin:2px;"
        type="primary "
        icon="ios-search">保存</Button>
      <Button
        style="float: right;margin:2px;"
        type="primary"
        icon="ios-search">取消</Button>


    </div>
  </div>

</template>

<style lang="less" scoped>
.left {
  width: 67%;
  float: left;
  height: 450px;
}
.right {
  width: 33%;
  height: 80%;

  float: right;
  height: 450px;
}
.right-top {
  height: 90%;
  border: 1px solid rgb(245, 218, 169);
  margin: 0 0 1% 0;
}
.right-bottom {
  height: 9%;
  border: 1px solid rgb(245, 218, 169);
}
.bottom {
  width: 100%;

  float: left;
}
.p {
  margin: 16px 0 0 0;
}
</style>
