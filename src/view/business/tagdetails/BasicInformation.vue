<script>
import { date } from '@ktw/ktools';
import RuleValidate from './rule-validate.js';
// 基本信息详情页
export default {
  name: 'BasicInformation',
  props: {
    rowData: {
      type: Object,
      default: null,
    },
    treeData: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      validates: RuleValidate,
      formItem: {},
      copyRowData: this.rowData,
      //标签按钮名称
      tagName: '',
      //修改标签模态框显示
      tagDialog: false,
      //全部标签名
      tags: [],
      // 已选标签名
      selectedTags: [],
    };
  },
  mounted() {
    if (this.copyRowData.enddate) {
      this.copyRowData.enddate = date.format(new Date(this.copyRowData.enddate), 'YYYY-M-D');
    }
    if (this.copyRowData.begdate) {
      this.copyRowData.begdate = date.format(new Date(this.copyRowData.enddate), 'YYYY-M-D');
    }
    //资源分类格式转换
    if (typeof this.copyRowData.restype === 'string') {
      this.copyRowData.restype = this.copyRowData.restype.split(',');
    }
    // 标签按钮名称
    this.copyRowData.add ? (this.tagName = '新增标签') : (this.tagName = '修改标签');
    this.queryTagData();
    //字符串类型标签转数组
    if (typeof this.copyRowData.keyword === 'string') {
      this.copyRowData.keyword = this.copyRowData.keyword.split(',');
    }
  },
  methods: {
    // 表单校验
    submitValidate(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modBasicInformation();
          this.$Message.success('操作成功');
        } else {
          this.$Message.error('请完善表单');
        }
      });
    },
    //新增/修改基本信息
    async modBasicInformation() {
      //标签数据处理
      let copyKeyword = this.copyRowData.keyword.concat();
      copyKeyword = copyKeyword.join(',');
      //资源分类数据处理
      let copyRestype = this.copyRowData.restype[this.copyRowData.restype.length - 1];
      //判断新增或修改请求
      if (this.copyRowData.add === true) {
        //新增基本信息
        await api.db
          .addbasicinfoBusiness({
            abstract_: this.copyRowData.abstract_,
            begdate: this.copyRowData.begdate,
            enddate: this.copyRowData.enddate,
            cndadd: this.copyRowData.cndadd,
            id: this.copyRowData.id,
            keyword: copyKeyword,
            name: this.copyRowData.name,
            restitle: this.copyRowData.restitle,
            restype: copyRestype,
            rporgname: this.copyRowData.rporgname,
          })
          .then(p => {
            this.$emit('on-tagEvent', p.data);
          });
      } else {
        //修改基本信息
        await api.db
          .updatebasicinfoBusiness({
            abstract_: this.copyRowData.abstract_,
            begdate: this.copyRowData.begdate,
            enddate: this.copyRowData.enddate,
            cndadd: this.copyRowData.cndadd,
            id: this.copyRowData.id,
            keyword: copyKeyword,
            name: this.copyRowData.name,
            restitle: this.copyRowData.restitle,
            restype: copyRestype,
            rporgname: this.copyRowData.rporgname,
          })
          .then(p => {
            if (typeof this.copyRowData.keyword === 'string') {
              this.copyRowData.keyword = this.copyRowData.keyword.split(',');
            }
          });
      }
    },
    // 获取标签数据
    async queryTagData() {
      await api.db.findallBusiness().then(p => {
        if (typeof p.data == 'string') {
          this.tags = p.data;
          this.tags = this.tags.split(',');
        } else {
          this.tags = p.data;
        }
      });
    },
    //打开添加标签模态框
    addTagDialog() {
      this.tagDialog = true;
      //已选标签数据同步
      this.selectedTags = this.copyRowData.keyword;
    },
    //确认修改标签按钮
    modTag() {
      //已选标签与页面同步
      this.copyRowData.keyword = this.selectedTags.concat();
      //更新新增标签
      this.copyRowData.keyword = [...this.copyRowData.keyword, ...this.selectedTags];
      //类数组对象转数组
      this.copyRowData.keyword = Array.from(new Set(this.copyRowData.keyword));
    },
    //标签模态框取消
    cancel() {
      this.$Message.info('Clicked cancel');
    },
    //点击复选框触发事件
    checked(event) {
      console.log(this.selectedTags);
    },
    //关闭标签触发事件
    tagsClose(event, name) {
      const index = this.copyRowData.keyword.indexOf(name);
      this.copyRowData.keyword.splice(index, 1);
    },
  },
};
</script>

<template>
  <Form
    ref="copyRowData"
    :rules="validates"
    :label-width="110"
    :class="{shade:copyRowData.readonly}"
    :model="copyRowData">
    <Row>
      <Col span="9">
      <FormItem
        prop="restitle"
        label="业务资源标题：">
        <Input
          v-model="copyRowData.restitle"
          placeholder="给目标起个名字"/>
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem
        label="资源分类：">
        <Cascader
          :data="treeData"
          v-model="copyRowData.restype"
          filterable
          transfer
        ></Cascader>
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="9">
      <FormItem
        label="负责单位：">
        <Input
          v-model="copyRowData.rporgname"
          placeholder="负责单位" />
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem
        label="负责单位地址：">
        <Input
          v-model="copyRowData.cndadd"
          placeholder="负责单位地址" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem
        prop="name"
        label="表名：">
        <Input
          v-model="copyRowData.name"
          placeholder="请选择" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <FormItem
        label="数据使用时间：">
        <Col span="9">
        <DatePicker
          v-model="copyRowData.begdate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择起始时间"></DatePicker>
        </Col>
        <Col span="1">至</Col>
        <Col span="8">
        <DatePicker
          v-model="copyRowData.enddate"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择结束时间"></DatePicker>
        </Col>
      </FormItem>
    </Row>
    <Row>
      <Col span="18">
      <FormItem
        prop="keyword"
        label="标签关键字：">
        <Button
          icon="ios-add"
          type="dashed"
          size="small"
          @click="addTagDialog">
          {{ tagName }}
        </Button>
        <div v-cloak>
          <Tag
            v-for="(item,index) of copyRowData.keyword"
            v-cloak
            :key = "index"
            :name="item"
            type="dot"
            closable
            color="success"
            @on-close="tagsClose">
            {{ item }}</Tag>
        </div>
        <modal
          v-model="tagDialog"
          :title= "tagName"
          width = "500"
          @on-ok="modTag"
          @on-cancel="cancel">
          <CheckboxGroup
            v-model="selectedTags"
            @on-change="checked">
            <Checkbox
              v-for="(item,index) of tags"
              :key ="index"
              :label="item.name">
            </Checkbox>
          </CheckboxGroup>
        </modal>
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem
        prop="abstract_"
        label="摘要：">
        <Input
          :rows="4"
          v-model="copyRowData.abstract_"
          type="textarea"
          placeholder="请输入你的阶段性工作目标" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <Button
        v-show="!copyRowData.readonly"
        class="details-button-right"
        type="primary"
        @click="submitValidate('copyRowData')">
        保存</Button>
      </Col>
    </Row>
  </Form>
</template>

<style lang="less" scoped>
@import '../../../styles/components/common.less';
.k-form-item {
  margin-bottom: 18px;
  vertical-align: top;
  zoom: 1;
}
.k-date-picker {
  display: inline-block;
  line-height: normal;
  width: 92%;
}
.details-button-right {
  float: right;
}
.details-date-between {
}
</style>
