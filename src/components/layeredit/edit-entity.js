import { geo2Wkt } from '@/utils/helps';

// 要素基础信息
let feaStr =
  '<Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="2017.06.21" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><Insert><wfs_featureType xmlns="wfs_featureNS"><the_geom><MultiSurface xmlns="http://www.opengis.net/gml"><surfaceMember><Polygon ><exterior><LinearRing><posList>wfs_poslist</posList></LinearRing></exterior></Polygon></surfaceMember></MultiSurface></the_geom>wfs_featureProperties</wfs_featureType></Insert></Transaction>';

const commomFields = ['the_geom', 'gid', 'x1', 'y1', 'x2', 'y2', 'shape_len', 'shape_area'];
/**
 * 编辑实体
 */
class EditEntity {
  constructor() {
    //编辑属性
    this.property = null;
    //编辑图形
    this.geometry = null;
  }

  /**
   * 设置编辑实体
   * @param {Object} property 属性对象
   * @param {Object} geometry 图形对象
   */
  setEntity(property, geometry) {
    this.property = property;
    this.geometry = geometry;
  }

  /**
   * 设置属性
   * @param {Object} property 属性对象
   */
  setProperty(property) {
    this.property = property;
  }

  /**
   * 设置图形
   * @param {Object} geometry 图形对象
   */
  setGeometry(geometry) {
    this.geometry = geometry;
  }

  /**
   * @description 设置图层要素字段
   * @param {any} feature
   * @memberof EditEntity
   */
  setDescribeFeatureType(feature) {
    this.describeFeatureType = feature;
  }

  /**
   * @description 设置图层信息
   * @param {any} layerInfo
   * @memberof EditEntity
   */
  setLayerInfo(layerInfo) {
    this.layerInfo = layerInfo;
  }

  /**
   * 重置对象
   */
  reset() {
    this.property = null;
    this.geometry = null;
    this.describeFeatureType = null;
  }

  /**
   * 实体对象转换
   */
  convertEntity() {
    let wkt = null;
    if (this.geometry) {
      wkt = geo2Wkt(this.geometry);
    }
    let fields = {};
    if (this.property) {
      for (let key in this.property) {
        fields[key] = this.property[key].value;
      }
    }
    return { fields, wkt };
  }

  /**
   * @description 新增要素 参数处理
   * @memberof EditEntity
   */
  setFeatureStr() {
    let featureObj = new Object();
    if (this.describeFeatureType) {
      this.describeFeatureType.forEach(feature => {
        const filename = feature.filename;
        if (commomFields.filter(field => field === filename.toLowerCase()).length !== 0) {
        }
        // if (
        //   filename != 'the_geom' &&
        //   filename != 'gid' &&
        //   filename != 'x1' &&
        //   p != 'y1' &&
        //   p != 'x2' &&
        //   p != 'y2' &&
        //   p.toUpperCase() != 'SHAPE_LEN' &&
        //   p.toUpperCase() != 'SHAPE_AREA'
        // ) {
        //   var input_id = 'input' + i;
        //   //获取修改后的属性
        //   var new_val = $.trim($('#' + input_id).val());
        //   obj[addFeaturesProperties[i].filename] = new_val;
        // }
      });
    }
  }

  /**
   * 插入记录
   */
  async insert() {
    let entity = this.convertEntity();
    debugger;
  }

  /**
   * 更新记录
   */
  async update() {}

  /**
   * 删除记录
   */
  async delete() {}
}

export default EditEntity;
