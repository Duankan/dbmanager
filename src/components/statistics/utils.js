/*
 * @Author: huangge
 * @Date: 2018-06-07 11:43:28
 * @Last Modified by:   huangge
 * @Last Modified time: 2018-06-07 11:43:28
 */
export const statisticsConfig = {
  classify: {
    key: 'classify',
    type: ['string', 'number', 'double', 'long', 'int'],
  },
  fields: {
    key: 'fields',
    type: ['number', 'double', 'long', 'int'],
  },
};

export const statisticsType = {
  Sum: {
    key: 'Sum',
    text: '求和',
    type: ['number', 'double', 'long', 'int'],
  },
  Count: {
    key: 'Count',
    text: '求个数',
    type: ['string', 'number', 'double', 'long', 'int'],
  },
  Max: {
    key: 'Max',
    text: '最大值',
    type: ['number', 'double', 'long', 'int'],
  },
  Min: {
    key: 'Min',
    text: '最小值',
    type: ['number', 'double', 'long', 'int'],
  },
  Area: {
    key: 'Area',
    text: '面积',
    type: ['number', 'double', 'long', 'int'],
  },
  Length: {
    key: 'Length',
    text: '长度',
    type: ['number', 'double', 'long', 'int'],
  },
};

export function filterField() {}
