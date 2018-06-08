/*
 * @Author: huangge
 * @Date: 2018-06-07 11:43:28
 * @Last Modified by: huangge
 * @Last Modified time: 2018-06-07 15:48:09
 */
export const classicConfig = {
  classify: {
    key: 'classify',
    type: ['string', 'number', 'double', 'long', 'int'],
  },
  fields: {
    key: 'fields',
    type: ['number', 'double', 'long', 'int'],
  },
};

export const statisticsConfig = {
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

export function filterClassic(schema, type) {
  let classic = [];
  if (type && classicConfig[type]) {
    classic = schema.filter(item => classicConfig[type].type.includes(item.type.toLowerCase()));
    return classic;
  } else {
    return null;
  }
}

export function filterStatistics(schema, text) {
  let statistics = [];
  if (text) {
    const config = Object.values(statisticsConfig).filter(item => item.text === text);
    if (config.length !== 0) {
      statistics = schema.filter(item => config[0].type.includes(item.type.toLowerCase()));
      return statistics;
    } else {
      return null;
    }
  }
}
