//绘制工具
const DRAW_TOOLS = {
  BaseMap: 'map',
  MapPolygon: 'polygon',
  MapRectangle: 'rectangle',
  MapMarker: 'marker',
  MapPolyLine: 'polyline',
  MapCircle: 'circle',
};

/**
 * 地图引用对象
 */
class MapRefs {
  /**
   * 全局单实例
   */
  static singleton = null;

  /**
   * 返回单实例
   * @param refs 地图引用
   */
  static inst(refs) {
    if (!this.singleton && refs) {
      this.singleton = new MapRefs(refs);
    }
    return this.singleton;
  }

  /**
   * 销毁对象
   */
  static destroy() {
    this.singleton = null;
  }

  /**
   * 初始化
   * @param {any} root 地图宿主对象
   */
  constructor(root) {
    this.refs = {};
    Object.values(root.$refs).forEach(p => {
      let tag = p.$options._componentTag;
      if (DRAW_TOOLS[tag]) {
        this.refs[DRAW_TOOLS[tag]] = p;
      }
    });
  }

  /**
   * 获取地图组件
   */
  getMap() {
    return this.refs.map;
  }

  /**
   * 获取绘图编辑器对象
   * @param type 工具类型，可取以下值:
   * polygon,rectangle,marker,polyline,circle
   */
  getDrawer(type) {
    return this.refs[type];
  }
}

export default MapRefs;
