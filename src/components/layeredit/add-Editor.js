import EditorBase from './editor-base';
import FormEditor from './form-editor';

/**
 * 新增要素编辑器
 */
class AddEditor extends EditorBase {
  /**
   * 开始编辑
   */
  beginEdit() {
    //重置编辑器
    this.reset();
    //创建新增表单
    this.formEditor = FormEditor.createAddForm(this.schemas, {
      onEvent: this.dispatchEvent.bind(this),
    });
    this.entity.setProperty(this.formEditor.model);
    this.geoEditor.setPopup(this.formEditor.el, null, {
      maxWidth: 435,
    });
    //开始绘制
    this.geoEditor.fireDrawEvents(this.drawFinish.bind(this));
    // this.geoEditor.startDraw(this.shapeType);
    this.geoEditor.startDraw('polygon');
  }

  /**
   * 绘制完成
   */
  drawFinish(e) {
    e.openPopup();
    this.entity.setGeometry(e);
    this.entity.setLayerInfo(this.layerInfo);
    // 查询要素
    this.store
      .dispatch('MAP_WFS_PARAMS', {
        url: this.layerInfo.wfsLayer.servicesurl,
      })
      .then(response => {
        this.entity.setDescribeFeatureType(response);
        // TODO: 设置表单
      });
  }

  /**
   * 保存图形
   */
  save() {
    this.entity.insert();
  }

  /**
   * 重置编辑器
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

export default AddEditor;
