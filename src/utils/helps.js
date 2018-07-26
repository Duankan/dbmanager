/*
放置系统用到的帮助函数
默认工具函数集 @ktw/ktools 已集成
在需要的组件中 通过 import { uuid } from '@ktw/ktools'; 按需引入
*/

/* 数据类型判断 */
export function nodeType(node) {
  switch (node.typeId) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
      return 'directory';
    case '20001': //点线面
    case '20002': //地名地址
    case '20005': //接图表Shapezip
    case '20010': //csv
    case '20011': //csv dataset
    case '20012': //csv zip
    case '20016': //地名地址csvzip
      return 'vector';
    case '20003': //dom tiff
    case '20007': //dom 影像图幅文件
    case '20008': //dem tiff
    case '20009': //dem 影像图幅文件
      return 'raster';
    case '20102': //sld 样式文件
      return 'sld';
    case '10005': //doc
    case '10006': //txt
    case '10007': //csv
    case '10008': //xls
    case '10009': //zip
    case '10010': //pdf
      return 'file';
    case '20099': //第三方服务
      return 'service';
  }
}

export function isDirectory(node) {
  return nodeType(node) === 'directory';
}

export function isVector(node) {
  return nodeType(node) === 'vector';
}

export function isRaster(node) {
  return nodeType(node) === 'raster';
}

export function isSld(node) {
  return nodeType(node) === 'sld';
}

export function isFile(node) {
  return nodeType(node) === 'file';
}

// 第三方服务及gis数据类型
export function isService(node) {
  return nodeType(node) === 'service';
}

//是否是资源
export function isResource(node) {
  return parseInt(node.typeId) > 8;
}

export function isGisResource(node) {
  return isVector(node) || isRaster(node);
}

//是否能追加数据
export function canAppend(node) {
  return node.typeId == '20001' || node.typeId == '20002';
}

export function canView(serviceList) {
  return serviceList.length >= 2 || (serviceList.length === 1 && serviceList[0].servicestype === 5);
}

//获取资源图标
export function iconClass(node) {
  switch (node.typeId) {
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
      return node.expand ? 'folder-open' : 'folder';
    case '20001': //点线面
    case '20010': //csv
    case '20011': //csv dataset
    case '20012': //csv zip
      switch (node.shapeType.toUpperCase()) {
        case 'POINT':
          return 'point';
        case 'POLYLINE':
        case 'LINESTRING':
        case 'MULTILINESTRING':
          return 'line';
        case 'POLYGON':
        case 'MULTIPOLYGON':
          return 'polygon';
      }
    case '20002': //地名地址
      return 'dmdz';
    case '20003': //dom tiff
    case '20007': //dom 影像图幅文件
      return 'dom';
    case '20008': //dem tiff
    case '20009': //dem 影像图幅文件
      return 'dem';
    case '20005': //接图表shapezip
      return 'grid';
    case '20014': //controlcsvzip dataset
      return 'point';
    case '10005': //doc
      return 'doc';
    case '10006': //txt
      return 'txt';
    case '10007': //csv
      return 'csv';
    case '10008': //xls
      return 'xls';
    case '10009': //zip
      return 'zip';
    case '10010': //pdf
      return 'pdf';
    default:
      return 'other';
  }
}

//获取节点样式类型
export function getNodeStyleType(node) {
  switch (node.shapeType.toUpperCase()) {
    case 'DEM':
      return 4;
    case 'POLYGON':
    case 'MULTIPOLYGON':
      return 3;
    case 'POLYLINE':
    case 'LINESTRING':
    case 'MULTILINESTRING':
      return 2;
    case 'POINT':
      return 1;
    default:
      return 0;
  }
}

/* 时间函数 */
export function getTimeStamp(day = 0) {
  const date = new Date();
  const BASE = 24 * 60 * 60 * 1000;
  const todayTimeStamp = date.getTime() - date.getTime() % BASE;
  return todayTimeStamp - day * BASE;
}

// 样式文件管理
export const styleType = [
  {
    value: ' ',
    label: '全部',
  },
  {
    value: '1',
    label: '点类型',
  },
  {
    value: '2',
    label: '线类型',
  },
  {
    value: '3',
    label: '面类型',
  },
  {
    value: '4',
    label: 'DEM类型',
  },
  {
    value: '0',
    label: '未知类型',
  },
];
export function getStyleType(type) {
  if (type === '') type = ' ';
  const filterStyle = styleType.filter(item => item.value === String(type));
  if (filterStyle.length !== 0) {
    return filterStyle[0].label;
  }
}

//schema保留字段
export const schemaReservedFileds = [
  'the_geom',
  'geom',
  'gid',
  'x1',
  'y1',
  'x2',
  'y2',
  'Shape_Leng',
  'Shape_Area',
  'bbox',
];

//过滤schema字段，去掉保留字段
export function filterSchema(schemas) {
  let fields = [];
  schemas.forEach(p => {
    if (schemaReservedFileds.indexOf(p) < 0) {
      fields.push(p);
    }
  });
  return fields;
}

//元数据保留字段
const metaReservedFields = [
  'geom',
  'gid',
  'x1',
  'y1',
  'x2',
  'y2',
  'ID',
  'Shape_Leng',
  'Shape_Area',
];

//元数据字段
export function filterMeta(schemas) {
  let fields = [];
  schemas.forEach(p => {
    if (metaReservedFields.indexOf(p) >= 0) {
      fields.push(p);
    }
  });
  return fields;
}

export const deleteStatus = [
  {
    value: '200',
    label: '删除成功',
  },
  {
    value: '35271',
    label: '样式被占用',
  },
  {
    value: '400',
    label: '删除失败',
  },
  {
    value: '404',
    label: '样式已被删除',
  },
  {
    value: '403',
    label: '用户信息失效',
  },
  {
    value: '500',
    label: '服务器异常',
  },
];

export function getDelelteStatus(type) {
  const filterStyle = deleteStatus.filter(item => item.value === String(type));
  if (filterStyle.length !== 0) {
    return filterStyle[0].label;
  }
}

//获取资源对应的文件过滤条件
export function getFileAccept(dataTypeId) {
  switch (dataTypeId) {
    case '10005': //doc
      return 'application/msword';
    case '10006': //txt
      return 'text/plain';
    case '10007': //csv
      return '.csv';
    case '10008': //excel
      return 'application/vnd.ms-excel';
    case '10009': //zip
      return 'application/zip';
    case '10010': //pdf
      return 'application/pdf';
    case '10099': //其他
      return '*.*';
    case '20001': //Shapezip
    case '20002': //地名地址Shapezip
    case '20005': //接图表Shapezip
    case '20012': //csvzip
    case '20016': //地名地址csvzip
      return 'application/zip';
    case '20099': //第三方资源
      return '*.*';
    default:
      return '*.*';
  }
}
