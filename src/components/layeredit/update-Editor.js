import EditorBase from './editor-base';
import FormEditor from './form-editor';
import { coords2Latlngs } from '@/utils/helps';
import { Message, Modal } from '@ktw/kcore';

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
    this.geoEditor.fireDrawEvents(this.drawFinish.bind(this));
    this.geoEditor.setDrawTooltip('point', true, '选择一个编辑图形');
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
        } else {
          Message.warning('没有选中编辑图形！');
          this.reset();
        }
      });
  }

  /**
   * 初始化编辑器
   * @param {any} feature
   */
  initEditor(feature) {
    this.geoEditor.destory();
    this.formEditor = FormEditor.createEditForm(this.schemas, feature.properties, {
      onEvent: this.dispatchEvent.bind(this),
    });
    this.entity.setProperty(this.formEditor.model);
    this.geoEditor.fireDrawEvents(null, this.editFinish.bind(this));
    this.geoEditor.setPopup(this.formEditor.el, null, {
      maxWidth: 435,
    });
    let latlngs = coords2Latlngs(feature.geometry);
    let geometry = this.geoEditor.createGeometry(this.shapeType, latlngs);
    geometry.openPopup();
    this.geoEditor.editGeometry();
    this.entity.setGeometry(geometry);
  }

  /**
   * 编辑完成
   * @param {any} e 图形
   */
  async editFinish(e) {
    this.entity.setGeometry(e[0]);
    await this.entity.update();
    this.reset();
    this.refreshLayer();
  }

  /**
   * 保存图形
   */
  save() {
    this.geoEditor.finishEdit();
  }

  /**
   * 删除图形
   */
  delete() {
    Modal.confirm({
      title: '删除确认',
      content: '您确定要删除图形吗？',
      onOk: async () => {
        await this.entity.delete();
        this.reset();
        this.refreshLayer();
      },
    });
  }
}

export default UpdateEditor;
