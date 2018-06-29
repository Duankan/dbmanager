<script>
const prefixCls = 'ivu-select-group';
export default {
  name: 'AttributeFilter',
  props: {
    value: { type: Object, default: () => {} },
  },
  data() {
    return {
      number: '',
      formItem: {
        input: '',
        select: 'beijing',
        textarea: this.value.filter || '',
        operate: ['=', '<>', '>', '>=', '<', '<=', '_', '%', 'like', 'is', 'in', 'not'],
        connect: ['and', 'or'],
      },
      addFieldNUM: 0,
      addSymbolNUM: 0,
      addNumberNUM: 0,
      addConectNUM: 0,
    };
  },
  watch: {
    value(newVal) {
      this.formItem.textarea = newVal.filter || '';
    },
  },
  methods: {
    addField(field) {
      //在文本域中添加字段
      field = field.trim();
      if (
        this.addFieldNUM == this.addSymbolNUM &&
        this.addFieldNUM == this.addNumberNUM &&
        this.addNumberNUM == this.addConectNUM
      ) {
        this.formItem.textarea += ' "' + field + '" ';
        this.addFieldNUM += 1;
        this.$Message.success('添加成功！');
      } else if (this.addFieldNUM == this.addSymbolNUM && this.addFieldNUM > this.addNumberNUM) {
        this.$Message.error('添加失败，请添加比较值！');
      } else if (this.addFieldNUM > this.addSymbolNUM && this.addFieldNUM > this.addNumberNUM) {
        this.$Message.error('添加失败，字段值后请跟逻辑符！');
      } else if (
        this.addFieldNUM == this.addSymbolNUM &&
        this.addFieldNUM == this.addNumberNUM &&
        this.addFieldNUM > this.addConectNUM
      ) {
        this.$Message.error('添加失败，请添加连接符号，或查询！');
      }
    },
    addSymbol(symbol) {
      //在文本域中添加逻辑符
      if (this.addFieldNUM > this.addSymbolNUM && this.addSymbolNUM == this.addNumberNUM) {
        this.formItem.textarea += ' ' + symbol + ' ';
        this.addSymbolNUM += 1;
        this.$Message.success('添加成功！');
      } else if (this.addFieldNUM == this.addSymbolNUM && this.addFieldNUM == this.addNumberNUM) {
        this.$Message.error('添加失败，请添加连接符或查询！');
      } else if (this.addFieldNUM == this.addSymbolNUM && this.addFieldNUM > this.addNumberNUM) {
        this.$Message.error('添加失败，逻辑符后请跟比较值');
      }
    },
    addNumber(number) {
      //在文本域中添加输入的值
      if (this.addFieldNUM > this.addNumberNUM && this.addSymbolNUM > this.addNumberNUM) {
        this.formItem.textarea += " '" + number + "' ";
        this.addNumberNUM += 1;
        this.$Message.success('添加成功！');
      } else if (this.addFieldNUM == this.addSymbolNUM && this.addFieldNUM == this.addNumberNUM) {
        this.$Message.error('添加失败，请添连接符！');
      } else if (this.addFieldNUM > this.addSymbolNUM && this.addSymbolNUM == this.addNumberNUM) {
        this.$Message.error('添加失败，请添逻辑符！');
      }
    },
    addConect(conect) {
      //在文本域中添加连接符
      if (
        this.addFieldNUM > this.addConectNUM &&
        this.addSymbolNUM > this.addConectNUM &&
        this.addNumberNUM > this.addConectNUM
      ) {
        this.formItem.textarea += ' ' + conect + ' ';
        this.addConectNUM += 1;
        this.$Message.success('添加成功！');
      } else if (this.addFieldNUM == this.addSymbolNUM && this.addFieldNUM == this.addNumberNUM) {
        this.$Message.error('添加失败，请添字段值！');
      } else if (this.addFieldNUM > this.addSymbolNUM && this.addSymbolNUM == this.addNumberNUM) {
        this.$Message.error('添加失败，请添逻辑符！');
      } else if (this.addFieldNUM > this.addConectNUM && this.addSymbolNUM > this.addConectNUM) {
        this.$Message.error('添加失败，请比较值！');
      }
    },
    empty() {
      //清空方法
      this.formItem.textarea = ' ';
      this.addFieldNUM = 0;
      this.addSymbolNUM = 0;
      this.addNumberNUM = 0;
      this.addConectNUM = 0;
    },
    btnOk() {
      console.log(this.value);
      //点击查询按钮，把文本域中的数据穿给DataTable.vue中，在那里面获取参数，修改原先参数，然后在继续查询
      //把文本域中的值全部取出来分析判断是否符合。//把文本域中的值全部取出来分析判断是否符合。
      let arr = this.formItem.textarea.split('  ');
      if (arr.length < 3) {
        this.$Message.error('请输入完整查询条件！');
      } else {
        let textareaFiltration = '';
        for (let i = 0; i < arr.length; i++) {
          textareaFiltration += arr[i] + ' ';
        }
        this.$emit('lxc', textareaFiltration);
      }
    },
  },
};
</script>
<template >
  <Form
    :model="formItem"
  >
    <FormItem>
      <div>
        <div class="schemadiv">
          <div
            v-for="item in (value.schemas.split(','))"
            :key="item"
            class = "schemaitem"
            @click="addField(item)">{{ item }}</div>
        </div>
        <div class="btnclass">
          <div class="opclass">
            <Button
              v-for="(op,index) in formItem.operate"
              :key="index"
              class="opbtnclass"
              @click="addSymbol(op)">
              {{ op }}
            </Button>
          </div>
          <div class="conectclass">
            <Button
              v-for="(op,index) in formItem.connect"
              :key="index"
              class="ctbtnclass"
              @click="addConect(op)">
              {{ op }}
            </Button>
          </div>
        </div>
      </div>
    </FormItem>
    <FormItem>
      <Input
        v-model="number"
        class="valueclass"
        placeholder="比较值"
      ></Input>
      <Button
        type="primary"
        @click="addNumber(number)">添加比较值</Button>
    </FormItem>
    <FormItem>
      <div>SELECT * FROM {{ value.name }} WHERE</div>
    </FormItme>
      <FormItem>
        <Input
          v-model="formItem.textarea"
          :autosize="{minRows: 2,maxRows: 2}"
          width="510px"
          readonly
          type="textarea"></Input>
      </FormItem>
      <FormItem v-if="value.showButton">
        <div class="sbtnclass">
          <Button
            type="warning"
            @click="empty()">清空</Button>
          <Button
            type="primary"
            @click="btnOk">查询</Button>
          <Button
            type="ghost"
            style="margin-left: 8px;">取消</Button>
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
  background-color: mistyrose;
  width: 44px;
  margin-top: 4px;
}
.valueclass {
  width: 260px;
  color: red;
}
.textClass {
  height: 80px;
}
.sbtnclass {
  float: right;
}
</style>
