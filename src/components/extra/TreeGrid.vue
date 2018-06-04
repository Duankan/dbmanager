
<template>
  <div
    :style="{width:tableWidth}"
    class="autoTbale">
    <table
      id="hl-tree-table"
      class="table table-bordered">
      <thead>
        <tr>
          <th
            v-for="(column,index) in cloneColumns"
            :key="column.type">
            <label v-if="column.type === 'selection'">
              <input
                v-model="checks"
                type="checkbox"
                @click="handleCheckAll">
            </label>
            <label v-else>
              {{ renderHeader(column, index) }}
              <span
                v-if="column.sortable"
                class="ivu-table-sort">
                <Icon
                  :class="{on: column._sortType === 'asc'}"
                  type="arrow-up-b"
                  @click.native="handleSort(index, 'asc')" />
                <Icon
                  :class="{on: column._sortType === 'desc'}"
                  type="arrow-down-b"
                  @click.native="handleSort(index, 'desc')" />
              </span>
            </label>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item,index) in initItems"
          v-show="show(item)"
          :key="item.id"
          :class="{'child-tr':item.parent}">
          <td
            v-for="(column,snum) in columns"
            :key="column.key"
            :style="tdStyle(column)">
            <label v-if="column.type === 'selection'">
              <input
                :value="{id:item.id,name:item.name,value:item.value}"
                v-model="checkGroup"
                type="checkbox"
                @click="handleCheckClick(item,$event,index)">
            </label>
            <div v-if="column.type === 'caction'">
              <Button
                v-for="caction in (column.actions)"
                :type="caction.type"
                :key="caction.text"
                :disabled="item.typeId=='20003'||item.typeId=='20007'||item.typeId=='20008'||item.typeId=='20009'"
                size="small"
                @click="actionClick(item,$event,index,caction.type)">{{ caction.text }}</Button>
            </div>
            <div v-if="column.type ==='combbox'">
              <Select
                :style="{'width':item.width,'display':showTemplete(item)}"
                @click.native="selectClick(item,$event,index)"
                @on-change="v=>{selectChange(v,item)}">
                <Option
                  v-for="schema in (item.values)"
                  :value="schema.value"
                  :key="schema.value">{{ schema.name }}</Option>
              </Select>
            </div>
            <label v-if="column.type ==='text'">
              <input
                v-model="item[column.key]"
                style="border-style:none"
                type="textarea"
                readonly="readonly"
                @click="toggle(index,item)"/>
            </label>
            <label v-if="!column.type">
              <span v-if="snum==iconRow()">
                <i v-html="item.spaceHtml"></i>
                <i
                  v-if="item.children&&item.children.length>0"
                  :class="{'ivu-icon-plus-circled':!item.expanded,'ivu-icon-minus-circled':item.expanded }"
                  class="ivu-icon"></i>
                <i
                  v-else
                  class="ms-tree-space"></i>
              </span>
              <SvgIcon
                :icon-class="iconClass(item)"
                :size="16"></SvgIcon>
              <input
                v-model="item[column.key]"
                style="border-style:none"
                type="textarea"
                readonly="readonly"
                @click="toggle(index,item)"/>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { findComponentUpward } from '../../utils/assist.js';

export default {
  name: 'TreeGrid',
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
  data() {
    return {
      initItems: [], //处理后数据数组
      loadData: [],
      cloneColumns: [], //处理后的表头数据
      checkGroup: [], //复选框数组
      checks: false, //全选
      screenWidth: document.body.clientWidth, //自适应宽
      tdsWidth: 0, //td总宽
      timer: false, //控制监听时长
      dataLength: 0, //树形数据长度
    };
  },
  computed: {
    tableWidth() {
      return this.tdsWidth > this.screenWidth && this.screenWidth > 0
        ? this.screenWidth + 'px'
        : '100%';
    },
  },
  watch: {
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        setTimeout(() => {
          this.timer = false;
        }, 400);
      }
    },
    items() {
      if (this.items) {
        this.dataLength = this.Length(this.items);
        this.initData(this.deepCopy(this.items), 1, null);
        this.checkGroup = this.renderCheck(this.items);
        if (this.checkGroup.length == this.dataLength) {
          this.checks = true;
        } else {
          this.checks = false;
        }
      }
    },
    columns: {
      handler() {
        this.cloneColumns = this.makeColumns();
      },
      deep: true,
    },
    checkGroup(data) {
      this.checkAllGroupChange(data);
    },
  },
  mounted() {
    if (this.items) {
      this.dataLength = this.Length(this.items);
      this.initData(this.deepCopy(this.items), 1, null);
      this.cloneColumns = this.makeColumns();
      this.checkGroup = this.renderCheck(this.items);
      if (this.checkGroup.length == this.dataLength) {
        this.checks = true;
      } else {
        this.checks = false;
      }
    }
    // 绑定onresize事件 监听屏幕变化设置宽
    this.$nextTick(() => {
      this.screenWidth = document.body.clientWidth;
    });
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
      })();
    };
  },
  beforeDestroy() {
    window.onresize = null;
  },
  methods: {
    // 有无多选框折叠位置优化
    iconRow() {
      for (var i = 0, len = this.columns.length; i < len; i++) {
        if (this.columns[i].type == 'selection') {
          return 1;
        }
      }
      return 0;
    },
    // 设置td宽度,td的align
    tdStyle(column) {
      var style = {};
      if (column.align) {
        style['text-align'] = column.align;
      }
      if (column.width) {
        style['min-width'] = column.width + 'px';
      }
      return style;
    },

    // 排序事件
    handleSort(index, type) {
      this.cloneColumns.forEach(col => (col._sortType = 'normal'));
      if (this.cloneColumns[index]._sortType === type) {
        this.cloneColumns[index]._sortType = 'normal';
      } else {
        this.cloneColumns[index]._sortType = type;
      }
      this.$emit(
        'on-sort-change',
        this.cloneColumns[index]['key'],
        this.cloneColumns[index]['_sortType']
      );
    },
    // 点击某一行事件
    RowClick(data, event, index, text) {
      let result = this.makeData(data);
      this.$emit('on-row-click', result, event, index, text);
    },
    // 自定义按钮事件
    actionClick(data, event, index, type) {
      this.$emit('on-button-click', data, index, type);
    },
    //自定义combobox加载事件
    selectClick(data, event, index) {
      const plan = findComponentUpward(this, 'PlanCreate');
      if (plan && plan.getSchemalist) {
        plan.getSchemalist(data, schemas => {
          this.$set(data, 'values', schemas);
        });
      }
    },
    selectChange(value, data) {
      if (value != '' && value != undefined) this.$set(data, 'value', value);
    },
    // 点击事件 返回数据处理
    makeData(data) {
      const t = this.type(data);
      let o;
      if (t === 'array') {
        o = [];
      } else if (t === 'object') {
        o = {};
      } else {
        return data;
      }

      if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
          o.push(this.makeData(data[i]));
        }
      } else if (t === 'object') {
        for (let i in data) {
          if (
            i != 'spaceHtml' &&
            i != 'parent' &&
            i != 'level' &&
            i != 'expanded' &&
            i != 'isShow' &&
            i != 'load'
          ) {
            o[i] = this.makeData(data[i]);
          }
        }
      }
      return o;
    },
    // 处理表头数据
    makeColumns() {
      let columns = this.deepCopy(this.columns);
      this.tdsWidth = 0;
      columns.forEach((column, index) => {
        column._index = index;
        column._width = column.width ? column.width : '';
        column._sortType = 'normal';
        this.tdsWidth += column.width ? parseFloat(column.width) : 0;
      });
      return columns;
    },
    // 数据处理 增加自定义属性监听
    initData(items, level, parent) {
      this.initItems = [];
      let spaceHtml = '';
      for (var i = 1; i < level; i++) {
        spaceHtml += "<i class='ms-tree-space'></i>";
      }
      items.forEach((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
          spaceHtml: spaceHtml,
        });
        if (typeof item.expanded == 'undefined') {
          item = Object.assign({}, item, {
            expanded: false,
          });
        }
        if (typeof item.show == 'undefined') {
          item = Object.assign({}, item, {
            isShow: false,
          });
        }
        if (typeof item.isChecked == 'undefined') {
          item = Object.assign({}, item, {
            isChecked: false,
          });
        }
        item = Object.assign({}, item, {
          load: item.expanded ? true : false,
        });
        this.initItems.push(item);
        if (item.children && item.expanded) {
          this.initData(item.children, level + 1, item);
        }
      });
    },
    //  隐藏显示
    show(item) {
      return item.level == 1 || (item.parent && item.parent.expanded && item.isShow);
    },
    toggle(index, item) {
      let level = item.level + 1;
      let spaceHtml = '';
      for (var i = 1; i < level; i++) {
        spaceHtml += "<i class='ms-tree-space'></i>";
      }
      if (item.children) {
        if (item.expanded) {
          item.expanded = !item.expanded;
          this.close(index, item);
        } else {
          item.expanded = !item.expanded;
          if (item.load) {
            this.open(index, item);
          } else {
            item.load = true;
            if (this.loadData) {
              const plan = findComponentUpward(this, 'PlanCreate');
              if (plan && plan.loadData) {
                plan.loadData(item, children => {
                  children.forEach((child, childIndex) => {
                    this.initItems.splice(index + childIndex + 1, 0, child);
                    //设置监听属性
                    this.$set(this.initItems[index + childIndex + 1], 'parent', item);
                    this.$set(this.initItems[index + childIndex + 1], 'level', level);
                    this.$set(this.initItems[index + childIndex + 1], 'spaceHtml', spaceHtml);
                    this.$set(this.initItems[index + childIndex + 1], 'isShow', true);
                    this.$set(this.initItems[index + childIndex + 1], 'expanded', false);
                  });
                  return;
                });
              }
            } else {
              item.children.forEach((child, childIndex) => {
                this.initItems.splice(index + childIndex + 1, 0, child);
                //设置监听属性
                this.$set(this.initItems[index + childIndex + 1], 'parent', item);
                this.$set(this.initItems[index + childIndex + 1], 'level', level);
                this.$set(this.initItems[index + childIndex + 1], 'spaceHtml', spaceHtml);
                this.$set(this.initItems[index + childIndex + 1], 'isShow', true);
                this.$set(this.initItems[index + childIndex + 1], 'expanded', false);
              });
            }
          }
        }
      }
    },
    open(index, item) {
      if (item.children) {
        item.children.forEach((child, childIndex) => {
          child.isShow = true;
          if (child.children && child.expanded) {
            this.open(index + childIndex + 1, child);
          }
        });
      }
    },
    close(index, item) {
      if (item.children) {
        item.children.forEach((child, childIndex) => {
          child.isShow = false;
          child.expanded = false;
          if (child.children) {
            this.close(index + childIndex + 1, child);
          }
        });
      }
    },
    //点击check勾选框,判断是否有children节点 如果有就一并勾选
    handleCheckClick(data, event, index) {
      data.isChecked = !data.isChecked;
      var arr = data.children;
      if (arr) {
        if (data.isChecked) {
          this.checkGroup.push({ id: data.id, name: data.name, value: data.value });
          for (let i = 0; i < arr.length; i++) {
            this.checkGroup.push({ id: arr[i].id, name: data.name, value: data.value });
          }
        } else {
          for (var i = 0; i < this.checkGroup.length; i++) {
            if (this.checkGroup[i].id == data.id) {
              this.checkGroup.splice(i, 1);
            }
            for (var j = 0; j < arr.length; j++) {
              if (this.checkGroup[i].id == arr[j].id) {
                this.checkGroup.splice(i, 1);
              }
            }
          }
        }
      } else {
        if (!data.isChecked) {
          for (var i = 0; i < this.checkGroup.length; i++) {
            if (this.checkGroup[i].id == data.id) {
              this.checkGroup.splice(i, 1);
            }
          }
        }
      }
    },
    //checkbox 全选 选择事件
    handleCheckAll() {
      this.checks = !this.checks;
      if (this.checks) {
        this.checkGroup = this.getArray(this.checkGroup.concat(this.All(this.items)));
      } else {
        this.checkGroup = [];
      }
      // this.$emit('on-selection-change', this.checkGroup)
    },
    // 数组去重
    getArray(a) {
      var hash = {},
        len = a.length,
        result = [];
      for (var i = 0; i < len; i++) {
        if (!hash[a[i]]) {
          hash[a[i]] = true;
          result.push(a[i]);
        }
      }
      return result;
    },
    checkAllGroupChange(data) {
      if (this.dataLength > 0 && data.length === this.dataLength) {
        this.checks = true;
      } else {
        this.checks = false;
      }
      this.$emit('on-selection-change', this.checkGroup);
    },
    All(data) {
      let arr = [];
      data.forEach(item => {
        arr.push(item.id);
        if (item.children && item.children.length > 0) {
          arr = arr.concat(this.All(item.children));
        }
      });
      return arr;
    },
    // 返回树形数据长度
    Length(data) {
      let length = data.length;
      data.forEach(child => {
        if (child.children) {
          length += this.Length(child.children);
        }
      });
      return length;
    },
    // 返回表头
    renderHeader(column, $index) {
      if ('renderHeader' in this.columns[$index]) {
        return this.columns[$index].renderHeader(column, $index);
      } else {
        return column.title || '#';
      }
    },

    // 返回内容
    renderBody(row, column, index) {
      return row[column.key];
    },
    // 默认选中
    renderCheck(data) {
      let arr = [];
      data.forEach(item => {
        if (item._checked) {
          arr.push({ id: item.id, name: item.name, value: item.value });
        }
        if (item.children && item.children.length > 0) {
          arr = arr.concat(this.renderCheck(item.children));
        }
      });
      return arr;
    },
    // 深度拷贝函数
    deepCopy(data) {
      var t = this.type(data),
        o,
        i,
        ni;
      if (t === 'array') {
        o = [];
      } else if (t === 'object') {
        o = {};
      } else {
        return data;
      }
      if (t === 'array') {
        for (i = 0, ni = data.length; i < ni; i++) {
          o.push(this.deepCopy(data[i]));
        }
        return o;
      } else if (t === 'object') {
        for (i in data) {
          o[i] = this.deepCopy(data[i]);
        }
        return o;
      }
    },
    type(obj) {
      var toString = Object.prototype.toString;
      var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
      };
      return map[toString.call(obj)];
    },
    // 节点图标
    iconClass(item) {
      switch (item.typeId) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          return item.expand ? 'folder-open' : 'folder';
        case '20001': //点线面
        case '20010': //csv
        case '20011': //csv dataset
        case '20012': //csv zip
          switch (item.shapeType.toUpperCase()) {
            case 'POINT':
              return 'point';
            case 'POLYLINE':
            case 'LINESTRING':
            case 'MULTILINESTRING':
              return 'line';
            case 'POLYGON':
            case 'MULTIPOLYGON':
              return 'polygon';
          }
        case '20002': //地名地址
          return 'dmdz';
        case '20003': //dom tiff
        case '20007': //dom 影像图幅文件
          return 'dom';
        case '20008': //dem tiff
        case '20009': //dem 影像图幅文件
          return 'dem';
        case '20005': //接图表shapezip
          return 'grid';
        case '20014': //controlcsvzip dataset
          return 'point';
        case '10005': //doc
          return 'doc';
        case '10006': //txt
          return 'txt';
        case '10007': //csv
          return 'csv';
        case '10008': //xls
          return 'xls';
        case '10009': //zip
          return 'zip';
        case '10010': //pdf
          return 'pdf';
      }
    },
    showTemplete(item) {
      if (item.typeId < 5) {
        return 'none';
      } else if (
        [
          '20003',
          '20007',
          '20008',
          '20009',
          '10005',
          '10006',
          '10007',
          '10008',
          '10009',
          '10010',
        ].indexOf(item.typeId) > -1
      ) {
        return 'none';
      } else return 'block';
    },
  },
};
</script>
<style>
.autoTbale {
  overflow: auto;
}

table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

.table-bordered {
  border: 1px solid #ebebeb;
}

.table > tbody > tr > td,
.table > tbody > tr > th,
.table > thead > tr > td,
.table > thead > tr > th {
  border-top: 1px solid #e7eaec;
  line-height: 1.42857;
  padding: 8px;
  vertical-align: middle;
}

.table-bordered > tbody > tr > td,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > td,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > thead > tr > th {
  border: 1px solid #e7e7e7;
}

.table > thead > tr > th {
  border-bottom: 1px solid #ddd;
}

.table-bordered > thead > tr > td,
.table-bordered > thead > tr > th {
  background-color: #f5f5f6;
}

#hl-tree-table > tbody > tr {
  background-color: #fbfbfb;
}

#hl-tree-table > tbody > .child-tr {
  background-color: #fff;
}

label {
  margin: 0 8px;
}

.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 14px;
  height: 14px;
}

.ms-tree-space::before {
  content: '';
}

#hl-tree-table th > label {
  margin: 0;
}
.ivu-icon {
  display: inline-block;
  font-family: Ionicons;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  text-rendering: auto;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.ivu-icon-plus-circled:before {
  content: '\f216';
}
.ivu-icon-minus-circled:before {
  content: '\f207';
}
</style>
