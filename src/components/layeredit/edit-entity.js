import { deepCopy } from '@/utils/assist';
import config from 'config';
import axios from 'axios';

//图层标记
const LAYER_FLAG = '{LAYER_FLAG}';

//图形标记
const GEOMETRY_FLAG = '{GEOMETRY_FLAG}';

//属性标记
const PROPERTY_FLAG = '{PROPERTY_FLAG}';

//坐标标记
const COORD_FLAG = '{COORD_FLAG}';

//ID标记
const ID_FLAG = '{ID_FLAG}';

//空间参考标记
const SPATIAL_FLAG = '{SPATIAL_FLAG}';

//新增要素模板
const ADD_TEMPLATE = `
<Transaction xmlns="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="2017.06.21" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
  <Insert>
    <${LAYER_FLAG} xmlns="http://www.opengeospatial.net/ktw">
      <the_geom>
        ${GEOMETRY_FLAG}
      </the_geom>
      ${PROPERTY_FLAG}
    </${LAYER_FLAG}>
  </Insert>
</Transaction>`;

//编辑要素模板
const UPDATE_TEMPLATE = `
<Transaction xmlns="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="2017.06.21" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
  <Update typeName="${LAYER_FLAG}">
    ${PROPERTY_FLAG}
    <Filter xmlns="http://www.opengis.net/ogc">
      <FeatureId fid="${ID_FLAG}"/>
    </Filter>
  </Update>
</Transaction>`;

//删除要素模板
const DELETE_TEMPLATE = `
<Transaction xmlns="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" service="WFS" version="2017.06.21" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
  <Delete xmlns="http://www.opengeospatial.net/ktw" typeName="${LAYER_FLAG}">
    <Filter xmlns="http://www.opengis.net/ogc">
      <FeatureId fid="${ID_FLAG}"/>
    </Filter>
  </Delete>
</Transaction>`;

//点图形模板
const POINT_TEMPLATE = `
<Point xmlns="http://www.opengis.net/gml" srsName="${SPATIAL_FLAG}">
  <pos>${COORD_FLAG}</pos>
</Point>`;

//线图形模板
const POLYLINE_TEMPLATE = `
<MultiLineString xmlns="http://www.opengis.net/gml" srsName="${SPATIAL_FLAG}">
  <lineStringMember>
    <LineString srsName="${SPATIAL_FLAG}">
      <posList>${COORD_FLAG}</posList>
    <LineString>
  <lineStringMember>
</MultiLineString>`;

//面图形模板
const POLYGON_TEMPLATE = `
<MultiPolygon xmlns="http://www.opengis.net/gml" srsName="${SPATIAL_FLAG}">
  <polygonMember>
    <Polygon srsName="${SPATIAL_FLAG}">
      <exterior>
        <LinearRing srsName="${SPATIAL_FLAG}">
           <posList>${COORD_FLAG}</posList>
        </LinearRing>
      </exterior>
    </Polygon>
  </polygonMember>
</MultiPolygon>`;

//要素模板
const FEATURE_TEMPLATE = {
  add: ADD_TEMPLATE,
  update: UPDATE_TEMPLATE,
  delete: DELETE_TEMPLATE,
};

//图形模板
const GEOMETRY_TEMPLATE = {
  point: POINT_TEMPLATE,
  polyline: POLYLINE_TEMPLATE,
  polygon: POLYGON_TEMPLATE,
};

/**
 * 编辑实体
 */
class EditEntity {
  constructor(layerInfo) {
    //图层信息
    this.layerInfo = layerInfo;
    //服务地址
    this.serviceUrl = `${config.project.hgisServer}/wfs`;
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
   * 重置对象
   */
  reset() {
    this.property = null;
    this.geometry = null;
  }

  /**
   * 属性信息转换为xml
   * @param {string} operate 操作类型
   */
  convertPropertiesToXml(operate) {
    const converts = {
      add(key, value) {
        return `<${key}>${value}</${key}>`;
      },
      update(key, value) {
        return `<Property><Name>${key}</Name><Value>${value}</Value></Property>`;
      },
    };
    let parts = [];
    Object.keys(this.property).forEach(p => {
      if (this.property[p].editable) {
        let part = converts[operate].call(this, p, this.property[p].value);
        parts.push(part);
      }
    });
    return parts.join('');
  }

  /**
   * 转换图形为xml
   */
  convertGeometryToXml() {
    const points = this.geometry.getLatLngs();
    let coords = [];
    if (points.length > 0) {
      points[0].forEach(point => {
        coords.push(point.lng);
        coords.push(point.lat);
      });
      coords.push(points[0][0].lng);
      coords.push(points[0][0].lat);
    }
    let shapeType = this.layerInfo.wmsLayer.resource.shapeType;
    let xml = deepCopy(GEOMETRY_TEMPLATE[shapeType]);
    xml = this.replace(xml, COORD_FLAG, coords.join(' '));
    xml = this.replace(xml, SPATIAL_FLAG, this.layerInfo.wmsLayer.csys);
    return xml;
  }

  /**
   * 字符串替换
   * @param {string} text 原字符串
   * @param {string} tar 需要替换字段
   * @param {string} rep 替换字符
   */
  replace(text, tar, rep) {
    return text.replace(new RegExp(tar, 'gm'), rep);
  }

  /**
   * 转换实体为XML
   * @param {String} operate 操作类型
   */
  convertEntityToXml(operate) {
    let strProperty = this.convertPropertiesToXml(operate);
    let strGeometry = this.convertGeometryToXml();
    let template = deepCopy(FEATURE_TEMPLATE[operate]);
    let xml = this.replace(template, LAYER_FLAG, this.layerInfo.wmsLayer.title);
    xml = this.replace(xml, PROPERTY_FLAG, strProperty);
    xml = this.replace(xml, GEOMETRY_FLAG, strGeometry);
    return xml;
  }

  /**
   * 插入记录
   */
  async insert() {
    let xmlData = this.convertEntityToXml('add');
    const response = await axios.post(this.serviceUrl, xmlData, {
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      dataType: 'text',
      traditional: true,
    });
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
