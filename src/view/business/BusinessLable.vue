<script>
export default {
  name: 'BusinessLable',
  data() {
    return {
      newAddText: '',
      nextTodoId: 7,
      datas: [], //标签数据
    };
  },
  mounted() {
    this.lableDatas();
  },
  methods: {
    async lableDatas() {
      const response = await api.db.findAllTags({});
      this.datas = response.data;
    },
    //添加列表
    async addNewList() {
      const response = await api.db.addTaqs({
        name: this.newAddText, //标签名
        remark: '', //描述
        type: 1, //类型（0-空间数据，1-业务数据）
      });
      debugger;
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
          v-model="list.name"
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
