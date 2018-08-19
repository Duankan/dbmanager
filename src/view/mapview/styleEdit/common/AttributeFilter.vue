<script>
export default {
  name: 'AttributeFilter',
  props: {
    layerType: {
      type: String,
      default: '',
    },
    styleType: {
      type: String,
      default: '',
    },
    fieldNumS: {
      type: Array,
      default: () => [],
    },
    fieldNoNumS: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      number: '',
      filterStr: '',
      div: {
        input: '',
        select: 'beijing',
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
    // schemas() {
    //   let fields = this.value ? this.value.schemas.split(',') : [];
    //   return fields;
    // },
  },
  watch: {},
  methods: {
    addField(field) {
      this.filterStr += ' ' + field;
    },
    addSymbol(op) {
      this.filterStr += ' ' + op;
    },
    testFilter() {},
  },
};
</script>
<template >
  <div>
    <div class="schemadiv">
      <div
        v-for="item in fieldNoNumS"
        :key="item.name" 
        class="schemaitem"
        @click="addField(item.name)">{{ item.name }}</div>
      <div
        v-for="item in fieldNumS"
        :key="item.name" 
        class="schemaitem"
        @click="addField(item.name)">{{ item.name }}</div>
    </div>
    <div class="btnclass">
      <div class="opclass">
        <Button
          v-for="item in div.operate"
          :key="item"
          class="opbtnclass"
          @click="addSymbol(item)">
          {{ item }}
        </Button>
      </div>
      <div class="opclass">
        <Button
          v-for="item in div.connect"
          :key="item"
          class="opbtnclass"
          @click="addSymbol(item)">
          {{ item }}
        </Button>
      </div>
    </div>
    <div style="font-size:14px;margin-top:4px;">
      过滤条件
      <Tooltip 
        placement="right"
        style="float:right" 
        content=" (示例：NAME = '1' AND TYPE = '1')">
        <Icon 
          size="16"
          type="help-circled"></Icon>
      </Tooltip>
    </div>
    <Input 
      v-model="filterStr" 
      :rows="5" 
      type="textarea" 
      placeholder="图层过滤条件删选"></Input>
    <Button 
      type="primary" 
      style="margin-top:4px;"
      @click="testFilter">应用过滤</Button>
  </div>
</template>
<style  lang="less" scoped>
.attribute-filter-wrapper {
  .form-row {
    margin: 4px 0 4px 0;
  }
}
.schemadiv {
  width: 100%;
  height: 160px;
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
    font-size: 10px;
  }
  .schemaitem:hover {
    background-color: #f3f3f3;
  }
}
.btnclass {
  width: 100%;
  height: 160px;
  margin-top: 4px;
  padding-top: 0px;
  border: 1px solid #dddddd;
}
.opclass {
  width: 100%;
}
.opbtnclass {
  width: 50px;
  margin-left: 4px;
  margin-top: 4px;
}
.conectclass {
  width: 50px;
  height: 158px;
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
