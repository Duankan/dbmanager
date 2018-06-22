/*
放置系统用到的帮助函数
默认工具函数集 @ktw/ktools 已集成
在需要的组件中 通过 import { uuid } from '@ktw/ktools'; 按需引入
*/

/* 数据类型判断 */
function nodeType(node) {
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
    case '20010': //csv
    case '20011': //csv dataset
    case '20012': //csv zip
    case '20002': //地名地址
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
  return false;
}

export function isGisResource(node) {
  return isVector(node) || isRaster(node);
}

export function canView(serviceList) {
  return serviceList.length >= 2 || (serviceList.length === 1 && serviceList[0].servicestype === 5);
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
