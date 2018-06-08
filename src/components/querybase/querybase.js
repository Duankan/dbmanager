/*
 * @Author: huangge
 * @Date: 2018-06-06 11:43:59
 * @Last Modified by: huangge
 * @Last Modified time: 2018-06-07 13:51:22
 */
import * as types from '@/store/types';

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
        this.layerData = [];
        if (Object.keys(newVal).length !== 0) {
          for (const key in newVal) {
            this.layerData.push({
              servicesurl: newVal[key].servicesurl,
              label: key,
              schema: newVal[key].schema,
              crs: newVal[key].csys,
            });
          }
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {},
  methods: {
    // 得到展示列表的字段
    getColums(totalParams) {
      let fieldList = [];
      totalParams.forEach(item => {
        if (commonParams.filter(key => key === item.name).length === 0) {
          fieldList.push({
            title: item.name,
            key: item.name,
            align: 'center',
            width: 100,
            maxWidth: 200,
          });
        }
      });
      return fieldList;
    },
    // 列表展示
    showTable(fieldList, params) {
      this.$store.commit(types.REMOVE_BUS_FIELD);
      this.$store.commit(types.REMOVE_BUS_ATTRIBUTE);
      this.$store.commit(types.SET_BUS_FIELD, fieldList);
      this.$store.commit(types.SET_BUS_ATTRIBUTE, params);
    },
  },
};
