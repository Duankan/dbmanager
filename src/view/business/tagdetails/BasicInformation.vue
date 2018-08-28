<script>
import { date } from '@ktw/ktools';
// 基本信息详情页
export default {
  name: 'BasicInformation',
  props: {
    rowData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      formItem: {},
      copyRowData: this.rowData,
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
    this.queryTagData();
    //字符串类型标签转数组
    if (this.copyRowData.keyword) {
      this.copyRowData.keyword = this.copyRowData.keyword.split(',');
      console.log(this.copyRowData.keyword);
    }
  },
  methods: {
    /**修改基本信息 */
    async modBasicInformation() {
      // 标签转字符串
      if (this.copyRowData.keyword.constructor === Array) {
        this.copyRowData.keyword = this.copyRowData.keyword.join(',');
      }
      if (this.copyRowData.add == true) {
        //新增基本信息
        await api.db.addbasicinfoBusiness(this.copyRowData).then(p => {
          this.$emit('on-tagEvent', p.data);
        });
      } else {
        //修改基本信息
        await api.db.updatebasicinfoBusiness(this.copyRowData).then(p => {
          this.copyRowData.keyword = this.copyRowData.keyword.split(',');
          console.log(this.copyRowData);
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
    :label-width="100"
    :class="{shade:copyRowData.readonly}"
    :model="copyRowData">
    <Row>
      <Col span="9">
      <FormItem label="业务资源标题：">
        <Input
          v-model="copyRowData.restitle"
          placeholder="给目标起个名字"/>
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem label="资源分类：">
        <Input
          v-model="copyRowData.restype"
          placeholder="单选" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="9">
      <FormItem label="负责单位：">
        <Input
          v-model="copyRowData.rporgname"
          placeholder="负责单位" />
      </FormItem>
      </Col>
      <Col span="9">
      <FormItem label="负责单位地址：">
        <Input
          v-model="copyRowData.cndadd"
          placeholder="负责单位地址" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem label="表名：">
        <Input
          v-model="copyRowData.name"
          placeholder="请选择" />
      </FormItem>
      </Col>
    </Row>
    <Row>
      <FormItem label="数据使用时间：">
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
      <FormItem label="标签关键字：">
        <Button
          icon="ios-add"
          type="dashed"
          size="small"
          @click="addTagDialog">
          修改标签
        </Button>
        <div>
          <Tag
            v-for="item of copyRowData.keyword"
            :key = "item"
            :name="item"
            type="dot"
            closable
            color="primary"
            @on-close="tagsClose">
            {{ item }}</Tag>
        </div>
        <modal
          v-model="tagDialog"
          width = "500"
          title="修改标签"
          @on-ok="modTag"
          @on-cancel="cancel">
          <CheckboxGroup
            v-model="selectedTags"
            @on-change="checked">
            <Checkbox
              v-for="item of tags"
              :key ="item.name"
              :label="item.name"
            >
            </Checkbox>
          </CheckboxGroup>
        </modal>
        <!--<Input
          :rows="4"
          v-model="copyRowData.keyword"
          type="textarea"
          placeholder="请选择多个标签管理里面的标签" />-->
      </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span="18">
      <FormItem label="摘要：">
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
        @click="modBasicInformation">
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
