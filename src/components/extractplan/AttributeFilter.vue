<script>
const prefixCls = 'ivu-select-group';
export default {
  name: 'AttributeFilter',
  props: {
    value: { type: Object, default: () => {} },
  },
  data() {
    return {
      formItem: {
        input: '',
        select: 'beijing',
        textarea: '',
        operate: ['=', '<>', '>', '>=', '<', '<=', '_', '%', '()', 'IS', 'IN', 'NULL'],
        connect: ['like', 'and', 'or', 'not'],
      },
    };
  },
  methods: {
    btnOk() {},
  },
};
</script>
<template>
  <Form
    :model="formItem">
    <FormItem>
      <div>
        <div class="schemadiv">
          <div
            v-for="item in (value.schemas.split(','))"
            :key="item"
            class = "schemaitem">{{ item }}</div>
        </div>
        <div class="btnclass">
          <div class="opclass">
            <Button
              v-for="(op,index) in formItem.operate"
              :key="index"
              class="opbtnclass">
              {{ op }}
            </Button>
          </div>
          <div class="conectclass">
            <Button
              v-for="(op,index) in formItem.connect"
              :key="index"
              class="ctbtnclass">
              {{ op }}
            </Button>
          </div>
        </div>
      </div>
    </FormItem>
    <FormItem>
      <Select
        v-model="formItem.select"
        class="valueclass">
        <Option value="beijing">New York</Option>
        <Option value="shanghai">London</Option>
        <Option value="shenzhen">Sydney</Option>
      </Select>
      <Button
        type="primary"
        @click="getUnique">
        获取唯一值
      </Button>
    </FormItem>
    <FormItem>
      <div>SELECT * FROM {{ value.name }} WHERE</div>
    </FormItme>
      <FormItem>
        <Input
          v-model="formItem.textarea"
          :autosize="{minRows: 3,maxRows: 3}"
          type="textarea"
          class="textClass"
          placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem>
        <div class="sbtnclass">
          <Button
            type="primary"
            @click="btnOk">Submit</Button>
          <Button
            type="ghost"
            style="margin-left: 8px;">Cancel</Button>
        </div>
      </FormItem>
  </formitem></Form>
</template>
<style  lang="less" scoped>
.schemadiv {
  width: 310px;
  height: 160px;
  float: left;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #dddddd;
  .schemaitem {
    height: 25px;
    margin-left: 5px;
  }
  .schemaitem:hover {
    background-color: #f3f3f3;
  }
}
.btnclass {
  height: 160px;
  margin-left: 2px;
  padding-top: 4px;
  float: left;
  border: 1px solid #dddddd;
}
.opclass {
  width: 150px;
  height: 158px;
  float: left;
}
.opbtnclass {
  width: 44px;
  margin-left: 4px;
  margin-top: 4px;
}
.conectclass {
  width: 50px;
  height: 158px;
  float: left;
}
.ctbtnclass {
  width: 44px;
  margin-top: 4px;
}
.valueclass {
  width: 260px;
}
.textClass {
  height: 80px;
}
.sbtnclass {
  float: right;
}
</style>
