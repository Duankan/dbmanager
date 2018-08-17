import AddEditor from './add-Editor';
import UpdateEditor from './update-Editor';

/**
 * 图层编辑器对象
 */
class LayerEditor {
  /**
   * 构造图层编辑器对象
   * @param {String} layer 图层ID
   * @param {Vuex.Store} Store信息
   */
  constructor(layer, store) {
    //图层ID
    this.layer = layer;
    //Vuex Store
    this.store = store;
    //地图对象
    this.map = this.store.getters.mapManager._map;
    //图层信息
    let serviceList = this.store.state.map.serviceList[this.layer];
    let wmsLayer = serviceList.find(p => p.servicestype == 12);
    let wfsLayer = serviceList.find(p => p.servicestype == 6);
    this.layerInfo = { wmsLayer, wfsLayer };
    //新增图形编辑器对象
    this.addEditor = new AddEditor(this.map, this.layerInfo, this.store);
    //编辑图形编辑器对象
    this.updateEditor = new UpdateEditor(this.map, this.layerInfo, this.store);
    //当前编辑器
    this.currentEditor = null;
  }

  //新增要素
  addFeature() {
    this.reset();
    this.addEditor.beginEdit();
    this.currentEditor = this.addEditor;
  }
  //编辑要素
  editFeature() {
    this.reset();
    this.updateEditor.beginEdit();
    this.currentEditor = this.updateEditor;
  }
  //重置编辑
  reset() {
    if (this.currentEditor) {
      this.currentEditor.reset();
    }
    this.currentEditor = null;
  }
}

export default LayerEditor;
