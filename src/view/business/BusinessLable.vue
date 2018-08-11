<script>
export default {
  name: 'BusinessLable',
  data() {
    return {
      newAddText: '',
      nextTodoId: 7,
      datas: [
        { id: 1, text: '标签1' },
        { id: 2, text: '标签2' },
        { id: 3, text: '标签3' },
        { id: 4, text: '标签4' },
        { id: 5, text: '标签5' },
        { id: 6, text: '标签6' },
      ],
    };
  },
  methods: {
    //添加列表
    addNewList() {
      this.newAddText = '标签' + this.nextTodoId;
      this.datas.push({
        id: this.nextTodoId++,
        text: this.newAddText,
      });
    },
    //删除列表
    removeList(index) {
      this.datas.splice(index, 1);
    },
    //编辑列表
    editList(event) {
      event.target.parentElement.getElementsByTagName('input')[0].focus();
    },
  },
};
</script>
<template>
  <div class="lable-main">
    <div
      class="lable-top"
    ><Icon
      type="ios-square"
      class="lable-bg-icon"
      size="20"/>
      <span>标签</span>
      <Icon
        v-model="newAddText"
        class="lable-list-icon"
        type="ios-plus-outline"
        size="16"
        @click.native="addNewList"/>
    </div>
    <div class="lable">
      <div
        v-for="(list, index) in datas"
        :key="index"
        class="lable-list">
        <input
          v-model="list.text"
          type="text"
          class="lable-input-list"
        />
        <Icon
          class="lable-list-content-icons"
          type="ios-close-outline"
          size="16"
          @click.native="removeList(index)"></Icon>
        <Icon
          class="lable-list-content-icon"
          type="android-create"
          size="16"
          @click.native="editList($event)"
        ></Icon>
      </input>
      </div>
    </div>

  </div>
</template>

<style lang="less" scoped>
.lable-main {
  width: 100%;
  padding-left: 25px;
  padding-right: 22px;
  height: calc(~'100vh - 450px');
  padding: 0px 22px 5px 25px;
  border-top: 0px;
  padding-top: 10px;
}
.labletop {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.lable-bg-icon {
  width: 8px;
  height: 8px;
  line-height: 8px;
  background-color: #2d8cf0;
  margin-right: 5px;
}
.lable {
  width: 100%;
  height: calc(100%-40px);
  overflow-y: auto;
  margin-top: 3px;
}
.lable-list {
  width: 100%;
  height: 25px;
  background-color: #f8f8f9;
  margin-top: 8px;
  border-radius: 5px;
  padding-left: 10px;
  line-height: 25px;
}
.lable-list-icon {
  float: right;
  padding-right: 7px;
  cursor: pointer;
}
.lable-list-content-icon {
  padding-right: 4%;
  cursor: pointer;
  float: right;
  line-height: 25px;
}
.lable-list-content-icons {
  cursor: pointer;
  float: right;
  padding-right: 7px;
  line-height: 25px;
}
.lable-input-list {
  height: 25px;
  border: 0;
  background: none;
}
</style>
