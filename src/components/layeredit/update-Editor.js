import EditorBase from './editor-base';
import FormEditor from './form-editor';
import GeometryUtil from './geometry-utils';
import { Message, Modal } from '@ktw/kcore';
import * as kmap from '@ktw/kmap';

//缓冲像素距离
const BUFFER_PIXEL = 3;

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
    this.geoEditor.startDraw(
      'point',
      {},
      {
        same: true,
        start: '选择一个编辑图形',
      }
    );
  }

  /**
   * 绘制完成
   */
  async drawFinish(e) {
    //获取地图单位
    let crs = this.layerInfo.layer.options.saveCrs;
    let idx = crs.lastIndexOf(':') + 1;
    crs = crs.substr(idx);
    let mapUnit = kmap.default.kmapAPI.commonFunction.getUnits(crs);
    let isDegree = mapUnit.units == 'degrees';
    //缓冲距离转换
    let buffer = GeometryUtil.pixel2LngLat(this.map, BUFFER_PIXEL, isDegree);
    //投影转换
    let geometry = await GeometryUtil.projectGeometry(this.layerInfo, e);
    //点选查询
    let point = geometry.getLatLng();
    let sqlFilter = `INTERSECTS(the_geom,buffer(POINT(${point.lat} ${point.lng}),${buffer}))`;
    this.store
      .dispatch('MAP_WFS_QUERY', {
        url: this.layerInfo.wfsInfo.wfsurl,
        pageIndex: 1,
        pageSize: 5,
        options: {
          type: 'POST',
          cql_filter: sqlFilter,
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
    let latlngs = GeometryUtil.coords2Latlngs(feature.geometry);
    let geometry = this.geoEditor.createGeometry(this.shapeType, latlngs);
    this.entity.setGeometry(geometry);
    geometry.openPopup();
    this.geoEditor.editGeometry();
  }

  /**
   * 编辑完成
   * @param {any} e 图形
   */
  async editFinish(e) {
    if (e.length > 0) {
      this.entity.setGeometry(e[0]);
    }
    let data = await this.entity.update();
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
        let data = await this.entity.delete();
        this.reset();
        this.refreshLayer();
      },
    });
  }
}

export default UpdateEditor;
