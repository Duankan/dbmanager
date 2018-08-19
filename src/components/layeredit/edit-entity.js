import { geo2Wkt } from '@/utils/helps';
import { deepCopy } from '@/utils/assist';
import axios from 'axios';

/** 要素基础信息xml
 * wfs_featureType: 图层名，这里不写工作区
 * wfs_featureNS：工作区地址
 * wfs_srs: 参考系
 * wfs_poslist：绘制图形坐标
 * wfs_featureProperties：新增图形字段
 */
let feaStr =
  '<Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="2017.06.21" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd "><Insert><wfs_featureType xmlns="wfs_featureNS"><the_geom><MultiPolygon xmlns="http://www.opengis.net/gml" srsName="wfs_srs"><polygonMember><Polygon srsName="wfs_srs"><exterior><LinearRing srsName="wfs_srs"><posList>wfs_poslist</posList></LinearRing></exterior></Polygon></polygonMember></MultiPolygon></the_geom>wfs_featureProperties</wfs_featureType></Insert></Transaction>';

// 公共字段
const commomFields = ['the_geom', 'gid', 'x1', 'y1', 'x2', 'y2', 'shape_len', 'shape_area'];
/**
 * 编辑实体
 */
class EditEntity {
  constructor(geoEditor, store, map) {
    //编辑属性
    this.property = null;
    //编辑图形
    this.geometry = null;
    // 图形编辑对象
    this.geoEditor = geoEditor;
    // store
    this.store = store;
    // map
    this.map = map;
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
    const url = new URL(this.layerInfo.wmsLayer.servicesurl);
    this.queryUrl = url.origin + '/master/wfs';
    this.layerName = url.searchParams.get('layers');
    this.layerSrs = url.searchParams.get('srs');
    this.styles = url.searchParams.get('styles');
    this.aliasName = this.layerInfo.wmsLayer.title;
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
   * @description 将构建的json的属性信息变为xml字符串
   * @param {any} obj
   * @param {any} type
   * @returns
   * @memberof EditEntity
   */
  converPropertiesToXml(obj, type) {
    let xml = '';
    const status = {
      add() {
        for (var key in obj) {
          xml += `<${key}>${obj[key]}</${key}>`;
        }
      },
      update() {
        for (var key in obj) {
          xml += `<Property><Name>${key}</Name><Value>${obj[key]}</Value></Property>`;
        }
      },
    };
    if (status[type]) status[type].call(this);
    return xml;
  }

  /**
   * @description 新增要素 参数处理
   * @memberof EditEntity
   */
  setFeatureStr() {
    let featureObj = new Object();
    let coords = [];
    if (this.describeFeatureType) {
      this.describeFeatureType.forEach(feature => {
        const filename = feature.filename;
        if (commomFields.filter(field => field === filename.toLowerCase()).length === 0) {
          if (this.property[filename]) featureObj[filename] = this.property[filename].value;
        }
      });
      const propertiesXml = this.converPropertiesToXml(featureObj, 'add');
      const points = this.geometry.getLatLngs();
      if (points.length > 0) {
        points[0].forEach(point => {
          coords.push(point.lng);
          coords.push(point.lat);
        });
        coords.push(points[0][0].lng);
        coords.push(points[0][0].lat);
      }
      return { propertiesXml, coords };
    }
  }

  /**
   * @description 组合xml
   * @memberof EditEntity
   */
  setXml(propertiesXml) {
    let xml = deepCopy(feaStr);
    xml = xml.replace(/wfs_featureType/g, this.aliasName); //设置图层名
    xml = xml.replace('wfs_featureNS', 'http://www.opengeospatial.net/ktw'); // 设置工作区地址
    xml = xml.replace('wfs_poslist', propertiesXml.coords.join(' ')); //设置新增坐标
    xml = xml.replace(/wfs_srs/g, this.layerSrs); //设置参考系
    xml = xml.replace('wfs_featureProperties', propertiesXml.propertiesXml); // 设置新增图形字段
    return xml;
  }

  /**
   * 插入记录
   */
  async insert() {
    let entity = this.convertEntity();
    let propertiesXml = this.setFeatureStr();
    if (propertiesXml.coords && propertiesXml.coords.length > 0) {
      const xmlData = this.setXml(propertiesXml);
      const response = await axios.post(this.queryUrl, xmlData, {
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        dataType: 'text',
        traditional: true,
      });
      //  TODO: 更新图层
      if (response.data && response.status === 200) {
        this.geoEditor.clearLayers();
        this.reset();
        const editLayer = this.store.getters.ogcLayers.filter(
          layers => layers.options.layers === this.layerName
        );
        if (editLayer.length !== 0) {
          editLayer[0].redraw();
          const bounds = this.map.getCenter();
          const copyBounds = deepCopy(bounds);
          copyBounds.lat += 0.003;
          this.map.panTo({ lat: copyBounds.lat, lng: copyBounds.lng });
        }
      }
    }
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
