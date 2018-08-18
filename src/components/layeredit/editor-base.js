import * as kmap from '@ktw/kmap';
import EditEntity from './edit-entity';
import FormEditor from './form-editor';

/**
 * 编辑器基类
 */
class EditorBase {
  /**
   * 构造编辑器对象
   * @param {L.Map} map 地图对象
   * @param {Object} layerInfo 编辑图层信息
   * @param {Vuex.Store} Store信息
   */
  constructor(map, layerInfo, store) {
    //地图对象
    this.map = map;
    //图层信息
    this.layerInfo = layerInfo;
    //Vuex Store
    this.store = store;
    //图层类型
    this.shapeType = layerInfo.wmsLayer.defaltstyle;
    //字段信息
    this.schemas = layerInfo.wmsLayer.schema;
    //图形编辑器对象
    this.geoEditor = new kmap.default.kmapAPI.DrawGeometry(map);
    //表单编辑器对象
    this.formEditor = null;
    //编辑实体
    this.entity = new EditEntity();
  }

  /**
   * 事件分发
   * @param {any} eventName 事件名
   * @param {any} args 事件参数
   */
  dispatchEvent(eventName, args) {
    if (this[eventName]) {
      this[eventName](args);
    }
  }
}

export default EditorBase;