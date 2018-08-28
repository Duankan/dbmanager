/*
 * @Author: huangge
 * @Date: 2018-06-06 11:43:59
 * @Last Modified by: huangge
 * @Last Modified time: 2018-06-08 10:26:32
 */
import * as types from '@/store/types';
import { setTableColumns } from '../../utils/assist';

const commonParams = [
  'the_geom',
  'geom',
  'gid',
  'ID',
  'geometry',
  'x1',
  'x2',
  'y1',
  'y2',
  'Shape_Leng',
  'Shape_Area',
  'bbox',
];

export default {
  name: 'QueryBase',
  data() {
    return {
      commonParams,
    };
  },
  computed: {
    wfsLayerData() {
      return this.$store.getters.wfsLayerData;
    },
  },
  watch: {
    wfsLayerData: {
      handler(newVal) {
        if (this.layerDataConfig) {
          this.layerData1 = [];
          this.layerData2 = [];
        } else {
          this.layerData = [];
        }
        if (Object.keys(newVal).length !== 0) {
          for (const key in newVal) {
            if (this.layerDataConfig) {
              this.layerDataConfig.forEach(item => {
                this[item].push({
                  servicesurl: newVal[key].servicesurl,
                  label: key,
                  schema: newVal[key].schema,
                  crs: newVal[key].csys,
                  title: newVal[key].title,
                });
              });
            } else {
              this.layerData.push({
                servicesurl: newVal[key].servicesurl,
                label: key,
                schema: newVal[key].schema,
                crs: newVal[key].csys,
                title: newVal[key].title,
              });
            }
          }
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {},
  methods: {
    // 得到去公共字段的展示列表字段
    getColums(totalParams) {
      let fieldList = [],
        isSetWidth;
      totalParams.length > 9 ? (isSetWidth = true) : (isSetWidth = false);
      totalParams.forEach(item => {
        if (commonParams.filter(key => key === item.name).length === 0) {
          if (isSetWidth) {
            fieldList.push({
              title: item.name,
              key: item.name,
              align: 'center',
              width: 100,
              maxWidth: 200,
            });
          } else {
            fieldList.push({
              title: item.name,
              key: item.name,
              align: 'center',
            });
          }
        }
      });
      return fieldList;
    },
    //获取表格列
    getTableColumns(data) {
      if (data instanceof Array) {
        const cols = setTableColumns(data[0]);
        return cols;
      }
    },
    //获取数据行
    getTableRows(data) {
      if (data instanceof Array) {
        let rows = data.map(p => {
          return {
            ...p,
          };
        });
        return rows;
      }
    },
    // 列表展示
    showTable(fieldList, params, attributeType) {
      // this.$store.commit(types.REMOVE_BUS_FIELD);
      // this.$store.commit(types.REMOVE_BUS_ATTRIBUTE);
      this.$store.commit(types.SET_BUS_FIELD, fieldList);
      this.$store.commit(types.SET_BUS_ATTRIBUTE, { ...params, attributeType });
    },
  },
};
