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
      div: {
        input: '',
        select: 'beijing',
        textarea: this.value.filter || '',
        operate: ['=', '<>', '>', '>=', '<', '<=', '_', '%', 'like', 'is', 'in', 'not'],
        connect: ['and', 'or'],
        panduan: true,
        addFieldNUM: 0,
        addSymbolNUM: 0,
        addNumberNUM: 0,
        addConectNUM: 0,
      },
    };
  },
  computed: {
    schemas() {
      console.log(this.value);
      let fields = this.value ? this.value.schemas.split(',') : [];
      return fields;
    },
  },
  watch: {
    value(newVal) {
      this.empty();
      this.div.textarea = newVal.filter || '';
      if (this.div.textarea != '' && this.div.panduan) {
        this.div.addConectNUM = this.div.addFieldNUM - 1;
      } else if (this.div.textarea == '') {
        this.empty();
      }
    },
  },
  methods: {
    addField(field) {
      //在文本域中添加字段
      field = field.trim();
      if (
        this.div.addFieldNUM == this.div.addSymbolNUM &&
        this.div.addFieldNUM == this.div.addNumberNUM &&
        this.div.addFieldNUM == this.div.addConectNUM
      ) {
        this.div.textarea += ' "' + field + '" ';
        this.div.addFieldNUM += 1;
        this.$Message.success('添加成功！');
      } else if (
        this.div.addFieldNUM == this.addSymbolNUM &&
        this.div.addFieldNUM > this.addNumberNUM
      ) {
        this.$Message.error('添加失败，请添加比较值！');
      } else if (
        this.div.addFieldNUM > this.addSymbolNUM &&
        this.div.addFieldNUM > this.addNumberNUM
      ) {
        this.$Message.error('添加失败，字段值后请跟逻辑符！');
      } else if (
        this.div.addFieldNUM == this.div.addSymbolNUM &&
        this.div.addFieldNUM == this.div.addNumberNUM &&
        this.div.addFieldNUM > this.div.addConectNUM
      ) {
        this.$Message.error('添加失败，请添加连接符号，或查询！');
      }
    },
    addSymbol(symbol) {
      //在文本域中添加逻辑符
      if (
        this.div.addFieldNUM > this.div.addSymbolNUM &&
        this.div.addSymbolNUM == this.div.addNumberNUM
      ) {
        this.div.textarea += ' ' + symbol + ' ';
        this.div.addSymbolNUM += 1;
        this.$Message.success('添加成功！');
      } else if (
        this.div.addFieldNUM == this.div.addSymbolNUM &&
        this.div.addFieldNUM == this.div.addNumberNUM
      ) {
        this.$Message.error('添加失败，请添加连接符或查询！');
      } else if (
        this.div.addFieldNUM == this.div.addSymbolNUM &&
        this.div.addFieldNUM > this.div.addNumberNUM
      ) {
        this.$Message.error('添加失败，逻辑符后请跟比较值');
      }
    },
    addNumber(number) {
      /* if (this.value.filter && this.panduan) {
        this.addFieldNUM += 1;
        this.addSymbolNUM += 1;
        this.addNumberNUM += 1;
        this.panduan = false;
      }*/
      //在文本域中添加输入的值
      if (
        this.div.addFieldNUM > this.div.addNumberNUM &&
        this.div.addSymbolNUM > this.div.addNumberNUM
      ) {
        this.div.textarea += " '" + number + "' ";
        this.div.addNumberNUM += 1;
        this.$Message.success('添加成功！');
      } else if (
        this.div.addFieldNUM == this.div.addSymbolNUM &&
        this.div.addFieldNUM == this.div.addNumberNUM
      ) {
        this.$Message.error('添加失败，请添连接符！');
      } else if (
        this.div.addFieldNUM > this.div.addSymbolNUM &&
        this.div.addSymbolNUM == this.div.addNumberNUM
      ) {
        this.$Message.error('添加失败，请添逻辑符！');
      }
    },
    addConect(conect) {
      //在文本域中添加连接符

      if (
        this.div.addFieldNUM > this.div.addConectNUM &&
        this.div.addSymbolNUM > this.div.addConectNUM &&
        this.div.addNumberNUM > this.div.addConectNUM
      ) {
        this.div.textarea += ' ' + conect + ' ';
        this.div.addConectNUM += 1;
        this.$Message.success('添加成功！');
      } else if (
        this.div.addFieldNUM == this.div.addSymbolNUM &&
        this.div.addFieldNUM == this.div.addNumberNUM
      ) {
        this.$Message.error('添加失败，请添字段值！');
      } else if (
        this.div.addFieldNUM > this.div.addSymbolNUM &&
        this.div.addSymbolNUM == this.div.addNumberNUM
      ) {
        this.$Message.error('添加失败，请添逻辑符！');
      } else if (
        this.div.addFieldNUM > this.div.addConectNUM &&
        this.div.addSymbolNUM > this.div.addConectNUM
      ) {
        this.$Message.error('添加失败，请比较值！');
      }
    },
    empty() {
      //清空方法
      this.div.textarea = '';
      this.div.addFieldNUM = 0;
      this.div.addSymbolNUM = 0;
      this.div.addNumberNUM = 0;
      this.div.addConectNUM = 0;
    },
    btnOk() {
      //点击查询按钮，把文本域中的数据穿给DataTable.vue中，在那里面获取参数，修改原先参数，然后在继续查询
      //把文本域中的值全部取出来分析判断是否符合。//把文本域中的值全部取出来分析判断是否符合。
      let arr = this.div.textarea.split('  ');
      if (arr.length < 3) {
        this.$Message.error('请输入完整查询条件！');
      } else {
        let textareaFiltration = '';
        for (let i = 0; i < arr.length; i++) {
          textareaFiltration += arr[i] + ' ';
        }
        this.$emit('on-attr-filter', textareaFiltration);
      }
    },
    getFilter() {
      return this.div.textarea;
    },
  },
};
</script>
<template >
  <div class="attribute-filter-wrapper">
    <div class="form-row clearfix">
      <div
        :class="{ schemadiv: true, 'schemadiv-polygontype': value.style }"
      >
        <div
          v-for="(item,index) in schemas"
          :key="index"
          class = "schemaitem"
          @click="addField(item)">{{ item }}</div>
      </div>
      <div class="btnclass">
        <div class="opclass">
          <Button
            v-for="(op,index) in div.operate"
            :key="index"
            class="opbtnclass"
            @click="addSymbol(op)">
            {{ op }}
          </Button>
        </div>
        <div class="conectclass">
          <Button
            v-for="(op,index) in div.connect"
            :key="index"
            class="ctbtnclass"
            @click="addConect(op)">
            {{ op }}
          </Button>
        </div>
      </div>
    </div>
    <div class="form-row">
      <Input
        v-model="number"
        class="valueclass"
        placeholder="比较值"
      ></Input>
      <Button
        type="primary"
        @click="addNumber(number)">添加比较值</Button>
    </div>
    <div class="form-row">
      <div>SELECT * FROM {{ value.name }} WHERE</div>
    </div>
    <div class="form-row">
      <Input
        v-model="div.textarea"
        :autosize="{minRows: 2,maxRows: 2}"
        width="510px"
        readonly
        type="textarea"></Input>
    </div>
    <div
      v-if="value.showButton"
      class="form-row">
      <div class="sbtnclass">
        <Button
          v-if="value.showButton"
          type="warning"
          @click="empty()">清空</Button>
        <Button
          type="primary"
          @click="btnOk">查询</Button>
      </div>
    </div>
  </div>
</template>
<style  lang="less" scoped>
.attribute-filter-wrapper {
  .form-row {
    margin: 10px 0 10px 0;
  }
}
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
.schemadiv-polygontype {
  width: 163px;
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
  margin-left: 5px;
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
