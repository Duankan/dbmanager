/**
 * 地图联动组件
 */
class SynchronizeMap {
  constructor() {
    /**
     * 地图对象集合
     */
    this.maps = [];
  }
  /**
   * 初始化地图对象
   * @param {Array} maps 地图对象集合
   */
  initSyncMaps(...maps) {
    //this.store = store;
    this.maps = maps;
  }

  /**
   * 开始地图同步
   */
  startSyncMap() {
    this.maps.forEach(map => {
      let mapObject = map.$mapObject;
      mapObject.on('zoomend', this.zoomAllMap, this);
      mapObject.on(
        'focus',
        function() {
          mapObject.on('dragend', this.dragAllMap, this);
        },
        this
      );
      mapObject.on(
        'blur',
        function() {
          mapObject.off('dragend', this.dragAllMap, this);
        },
        this
      );
    });
  }

  /**
   * 停止地图同步
   */
  stopSyncMap() {
    this.maps.forEach(map => {
      let mapObject = map.$mapObject;
      mapObject.off('zoomend', this.zoomAllMap, this);
      mapObject.off(
        'focus',
        function() {
          mapObject.off('dragend', this.dragAllMap, this);
        },
        this
      );
      mapObject.off(
        'blur',
        function() {
          mapObject.off('dragend', this.dragAllMap, this);
        },
        this
      );
    });
  }

  /**
   * 获取地图视口参数
   * @param {any} e 事件参数
   */
  getMapView(e) {
    let targetMap = e.target;
    let targetZoom = targetMap.getZoom();
    let targetCenter = targetMap.getCenter();
    return { targetMap, targetZoom, targetCenter };
  }

  /**
   * 放缩所有地图
   * @param {any} e 事件参数
   */
  zoomAllMap(e) {
    const view = this.getMapView(e);
    this.maps.map(map => {
      let mapObject = map.$mapObject;
      if (mapObject !== view.targetMap) {
        if (mapObject._animateToZoom !== view.targetZoom) {
          mapObject.setView(view.targetCenter, view.targetZoom);
        }
      }
    });
  }

  /**
   * 拖拽所有地图
   * @param {any} e 事件参数
   */
  dragAllMap(e) {
    const view = this.getMapView(e);
    this.maps.map(map => {
      let mapObject = map.$mapObject;
      if (mapObject !== view.targetMap) {
        mapObject.setView(view.targetCenter, view.targetZoom);
      }
    });
  }

  // /**
  //  * 同步图形到所有地图
  //  * @param {Map} srcMap 源地图组件
  //  * @param {geometry} geometry 图形
  //  */
  // asyncGeometry(srcMap, geometry) {
  //   let geojson = geometry.toGeoJSON();
  //   // this.maps.forEach(p => {
  //   //   if (p.mapId != srcMap.mapId) {
  //   //     this.store.commit(`${p.mapId}/SET_MAP_GEOJSON`, { geojson, type: 'once' });
  //   //   }
  //   // });
  // }

  // /**
  //  * 清除所有图形
  //  */
  // clearGeometry() {
  //   this.maps.forEach(p => {
  //     this.store.commit(`${p.mapId}/SET_MAP_GEOJSON`, { geojson: {}, type: 'once' });
  //   });
  // }
}

export default SynchronizeMap;
