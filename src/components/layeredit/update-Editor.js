import EditorBase from './editor-base';
import FormEditor from './form-editor';
import { coords2Latlngs } from '@/utils/helps';

/**
 * 编辑要素编辑器
 */
class UpdateEditor extends EditorBase {
  /**
   * 开始编辑
   */
  beginEdit() {
    //重置编辑器
    this.reset();
    //绘制一个点
    this.geoEditor.fireDrawEvents(this.drawFinish.bind(this), this.editFinish.bind(this));
    this.geoEditor.startDraw('point');
  }

  /**
   * 绘制完成
   */
  drawFinish(e) {
    //点选查询
    this.store
      .dispatch('MAP_WFS_QUERY', {
        url: this.layerInfo.wfsLayer.wfsurl,
        pageIndex: 1,
        pageSize: 5,
        options: {
          type: 'POST',
          geometry: e,
        },
      })
      .then(p => {
        if (p.features.length > 0) {
          this.initEditor(p.features[0]);
        }
      });
  }

  /**
   * 初始化编辑器
   * @param {any} feature
   */
  initEditor(feature) {
    this.geoEditor.clearLayers();
    this.formEditor = FormEditor.createAddForm(this.schemas, {
      onEvent: this.dispatchEvent.bind(this),
    });
    this.entity.setProperty(this.formEditor.model);
    this.geoEditor.setPopup(this.formEditor.el, null, {
      maxWidth: 435,
    });
    let a = feature.geometry.coordinates[0];
    let latlngs = coords2Latlngs(feature.geometry);
    // this.geoEditor.createGeometry(this.shapeType, latlngs);
    this.geoEditor.createGeometry('polygon', latlngs);
    this.geoEditor.editGeometry();
  }

  /**
   * 编辑完成
   * @param {any} e 图形
   */
  editFinish(e) {
    this.entity.setGeometry(e);
  }

  /**
   * 保存图形
   */
  save() {
    this.geoEditor.finishEdit();
  }

  /**
   * 重置编辑
   */
  reset() {
    if (this.formEditor) {
      this.formEditor.remove();
      this.formEditor = null;
    }
    this.geoEditor.clearLayers();
    this.entity.reset();
  }
}

export default UpdateEditor;
