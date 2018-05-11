/*
  定义modules中用到的action。
  命令规则：
    模块名_属性名_操作(FETCH、QUERY等)   ！！！ 所有字母大写 作为常量导出
  属性名尽可能与modules.state中属性名一致，并且直观容易理解，否则请在该行后用 // 注释。
*/

/* app modules */

/* -------------------------------------------------------------------------------------------------------- */

/*
  定义modules中用到的mutation。
  命令规则：
    操作名[SET, UPDATE, REMOVE]_模块名_属性名   ！！！ 所有字母大写 作为常量导出
  属性名尽可能与modules.state中属性名一致，并且直观容易理解，否则请在该行后用 // 注释。
*/

/* app modules */

/* bus modules */
export const SET_BUS_CATALOG = 'SET_BUS_CATALOG';
export const SET_BUS_RESOURCE = 'SET_BUS_RESOURCE';
export const SET_BUS_SERVICE = 'SET_BUS_SERVICE';
export const SET_BUS_PUBLISH = 'SET_BUS_PUBLISH';
export const SET_BUS_ATTRIBUTE = 'SET_BUS_ATTRIBUTE';

export const REMOVE_BUS_CATALOG = 'REMOVE_BUS_CATALOG';
export const REMOVE_BUS_RESOURCE = 'REMOVE_BUS_RESOURCE';
export const REMOVE_BUS_SERVICE = 'REMOVE_BUS_SERVICE';
export const REMOVE_BUS_PUBLISH = 'REMOVE_BUS_PUBLISH';
export const REMOVE_BUS_ATTRIBUTE = 'REMOVE_BUS_ATTRIBUTE';
