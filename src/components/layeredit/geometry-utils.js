/**
 * 图形转换帮助类
 */
class GeometryUtil {
  /**
   * Geometry转WKT格式
   * @param {L.Geometry} geometry 图形对象
   */
  static geo2Wkt(geometry, reverse = false) {
    let geojson = geometry.toGeoJSON();
    let wktFormat = new L.Format.WKT();
    let wkt = wktFormat.readToWKT(geojson, reverse);
    return wkt;
  }

  /**
   * 像素长度转经纬度长度
   * @param {L.Map} map 地图对象
   * @param {Number} pixel 像素长度
   */
  static pixel2LngLat(map, pixel) {
    let distance = map.distance(
      map.containerPointToLatLng({ x: 0, y: 0 }),
      map.containerPointToLatLng({ x: pixel, y: 0 })
    );
    let buffer = distance / 111194.872221777;
    return buffer;
  }

  /**
   * 坐标点转图形点
   * @param {L.Geometry} geometry 图形
   */
  static coords2Point(geometry) {
    let points = geometry.coordinates;
    let latlngs = [points[1], points[0]];
    return latlngs;
  }

  /**
   * 坐标点转MultiLineString
   * @param {L.Geometry} geometry 图形
   */
  static coords2MultiLineString(geometry) {
    let segments = geometry.coordinates;
    let latlngs = [];
    for (let i = 0; i < segments[0].length; i++) {
      let pnts = segments[0][i];
      latlngs.push([pnts[1], pnts[0]]);
    }
    return latlngs;
  }

  /**
   * 坐标点转MultiPolygon
   * @param {L.Geometry} geometry 图形
   */
  static coords2MultiPolygon(geometry) {
    let segments = geometry.coordinates;
    let latlngs = [];
    for (let i = 0; i < segments[0].length; i++) {
      let pnts = [];
      let parts = segments[0][i];
      for (let j = 0; j < parts.length; j++) {
        let t = parts[j];
        pnts.push([t[1], t[0]]);
      }
      latlngs.push(pnts);
    }
    return latlngs;
  }

  /**
   * wfs查询图形转leaflet图形
   * @param {L.Geometry} geometry 图形
   */
  static coords2Latlngs(geometry) {
    let type = `coords2${geometry.type}`;
    let latlngs = [];
    if (this[type]) {
      latlngs = this[type](geometry);
    }
    return latlngs;
  }

  /**
   * 点图形转坐标点
   * @param {L.Point} geometry 图形对象
   */
  static point2Coords(geometry) {
    let point = geometry.getLatLng();
    let coords = [];
    coords.push(point.lng, point.lat);
    return coords;
  }

  /**
   * 面图形转坐标点
   * @param {L.Polyline} geometry 图形对象
   */
  static polyline2Coords(geometry) {
    let points = geometry.getLatLngs();
    let coords = [];
    points.forEach(point => {
      coords.push(point.lng);
      coords.push(point.lat);
    });
    return coords;
  }

  /**
   * 面图形转坐标点
   * @param {L.Polygon} geometry 图形对象
   */
  static polygon2Coords(geometry) {
    let points = geometry.getLatLngs();
    let coords = [];
    if (points.length > 0) {
      points[0].forEach(point => {
        coords.push(point.lng);
        coords.push(point.lat);
      });
      coords.push(points[0][0].lng);
      coords.push(points[0][0].lat);
    }
    return coords;
  }

  /**
   * geometry转坐标点
   * @param {L.Geometry} geometry 图形对象
   */
  static geo2Coords(geometry) {
    let points = [];
    if (geometry instanceof L.Polygon) {
      points = this.polygon2Coords(geometry);
    } else if (geometry instanceof L.Polyline) {
      points = this.polyline2Coords(geometry);
    } else if (geometry instanceof L.Marker) {
      points = this.point2Coords(geometry);
    }
    return points;
  }
}

export default GeometryUtil;
