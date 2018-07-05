/*
  定义modules中用到的action。
  命令规则：
    模块名_属性名_操作(FETCH、QUERY等)   ！！！ 所有字母大写 作为常量导出
  属性名尽可能与modules.state中属性名一致，并且直观容易理解，否则请在该行后用 // 注释。
*/

/* app modules */
export const APP_NODES_FETCH = 'APP_NODES_FETCH';
export const APP_SELECT_NODES_DELETE = 'APP_SELECT_NODES_DELETE';

/* -------------------------------------------------------------------------------------------------------- */

/*
  定义modules中用到的mutation。
  命令规则：
    操作名[SET, UPDATE, REMOVE]_模块名_属性名   ！！！ 所有字母大写 作为常量导出
  属性名尽可能与modules.state中属性名一致，并且直观容易理解，否则请在该行后用 // 注释。
*/

/* app modules */
export const SET_APP_CURRENT_DIRECTORY = 'SET_APP_CURRENT_DIRECTORY';
export const SET_APP_SELECT_NODES = 'SET_APP_SELECT_NODES';
export const SET_APP_DATATABLE = 'SET_APP_DATATABLE';

export const SORT_APP_NODES = 'SORT_APP_NODES';
export const UPDATE_APP_NODES = 'UPDATE_APP_NODES';

export const REMOVE_APP_SELECT_NODES = 'REMOVE_APP_SELECT_NODES';
export const REMOVE_APP_DATATABLE = 'REMOVE_APP_DATATABLE';

export const OPEN_BOTTOM_PANE = 'OPEN_BOTTOM_PANE';
export const COLLAPSE_BOTTOM_PANE = 'COLLAPSE_BOTTOM_PANE';
export const CLOSE_BOTTOM_PANE = 'CLOSE_BOTTOM_PANE';

/* bus modules */
export const SET_BUS_ATTRIBUTE = 'SET_BUS_ATTRIBUTE';
export const SET_BUS_FIELD = 'SET_BUS_FIELD';

export const REMOVE_BUS_ATTRIBUTE = 'REMOVE_BUS_ATTRIBUTE';
export const REMOVE_BUS_FIELD = 'REMOVE_BUS_FIELD';

export const SET_BUS_SELECT_PLANDATA = 'SET_BUS_SELECT_PLANDATA';
export const SET_BUS_PLANDATA = 'SET_BUS_PLANDATA';
export const REMOVE_BUS_SELECT_PLANDATA = 'REMOVE_BUS_SELECT_PLANDATA';
