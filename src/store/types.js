/*
  定义modules中用到的action。
  命令规则：
    模块名_属性名_操作(FETCH、QUERY等)   ！！！ 所有字母大写 作为常量导出
  属性名尽可能与modules.state中属性名一致，并且直观容易理解，否则请在该行后用 // 注释。
*/

/* app modules */
export const APP_NODES_FETCH = 'APP_NODES_FETCH';
export const APP_NODES_TABLE = 'APP_NODES_TABLE';
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
export const CHANGE_APP_NODES = 'CHANGE_APP_NODES';

export const REMOVE_APP_SELECT_NODES = 'REMOVE_APP_SELECT_NODES';
export const REMOVE_APP_DATATABLE = 'REMOVE_APP_DATATABLE';

export const OPEN_BOTTOM_PANE = 'OPEN_BOTTOM_PANE';
export const COLLAPSE_BOTTOM_PANE = 'COLLAPSE_BOTTOM_PANE';
export const CLOSE_BOTTOM_PANE = 'CLOSE_BOTTOM_PANE';
export const SET_BUTTOM_PANE_TITLE = 'SET_BUTTOM_PANE_TITLE';

/* bus modules */
export const SET_BUS_ATTRIBUTE = 'SET_BUS_ATTRIBUTE';
export const SET_BUS_FIELD = 'SET_BUS_FIELD';

export const REMOVE_BUS_ATTRIBUTE = 'REMOVE_BUS_ATTRIBUTE';
export const REMOVE_BUS_FIELD = 'REMOVE_BUS_FIELD';

/* message modules */
export const ADD_POLL_TASK = 'ADD_POLL_TASK';
export const START_POLL_TASK = 'START_POLL_TASK';
export const UPDATE_POLL_TASK = 'UPDATE_POLL_TASK';
export const COMPLETE_POLL_TASK = 'COMPLETE_POLL_TASK';
export const ADD_NOTIFY_MESSAGE = 'ADD_NOTIFY_MESSAGE';
export const READ_NOTIFY_MESSAGE = 'READ_NOTIFY_MESSAGE';
export const READ_ALL_NOTIFY_MESSAGE = 'READ_ALL_NOTIFY_MESSAGE';
export const CLEAR_NOTIFY_MESSAGE = 'CLEAR_NOTIFY_MESSAGE';
export const SWIP_NOTIFY_MESSAGE = 'SWIP_NOTIFY_MESSAGE';
export const CHANGE_APP_SELECTHKEY = 'CHANGE_APP_SELECTHKEY';

export const CHANGE_APP_CLEAR_SELECTHKEY = 'CHANGE_APP_CLEAR_SELECTHKEY';

/*metadata modules*/
export const SEARCH_LABLE_DATA = 'SEARCH_LABLE_DATA';
export const SEARCH_LABLE_DATAS = 'SEARCH_LABLE_DATAS';
// export const SEARCH_TREE_DATA = 'SEARCH_TREE_DATA';
// export const SEARCH_TREE_DATAS = 'SEARCH_TREE_DATAS';
// export const SEARCH_TABLE_TAG = 'SEARCH_TABLE_TAG';
// export const SEARCH_TABLE_TAGS = 'SEARCH_TABLE_TAGS';
