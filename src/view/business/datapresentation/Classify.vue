<script>
export default {
  name: 'Classify',
  props: {
    labelsData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      treeId: '',
      treeDatas: [],
      tagId: [],
      dataTrees: [
        {
          title: '',
          expand: true,
          render: (h, { root, node, data }) => {
            return h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  width: '100%',
                },
              },
              [
                h('span', [
                  h('Icon', {
                    props: {
                      type: 'ios-folder',
                    },
                    style: {
                      marginRight: '8px',
                      fontSize: '10px',
                      color: '#ff9900',
                    },
                  }),
                  h('span', data.title),
                ]),
                // h(
                //   'span',
                //   {
                //     style: {
                //       display: 'inline-block',
                //       float: 'right',
                //       marginRight: '32px',
                //     },
                //   }[
                //     h('Button', {
                //       props: Object.assign({}, this.ButtonProps, {}),
                //       style: {
                //         marginRight: '5px',
                //         padding: '0px 3px',
                //       },
                //       on: {
                //         click: () => {
                //           this.append(data);
                //         },
                //       },
                //     })
                //   ]
                // ),
              ]
            );
          },
          children: [
            {
              title: '',
              expand: true,
              children: [
                {
                  title: '',
                  expand: true,
                },
              ],
            },
          ],
        },
      ],
      ButtonProps: {
        type: 'default',
        size: 'small',
      },
    };
  },
  //监听数据列表
  // watch: {
  //   dataTrees: {
  //     handler(newVals) {
  //       this.treeDatas = [];
  //       //给对象添加isEdit属性并赋值
  //       newVals.forEach(element => {
  //         this.$set(element, 'isEdit', false);
  //       });
  //       this.$emit('dataChangeEvnet', newVals);
  //     },
  //     immediate: true,
  //   },
  // },
  mounted() {
    this.searchTrees();
  },
  methods: {
    async searchTrees() {
      const response = await api.db.findallwithmatadata([]);
      this.dataTrees = response.data;
      this.dataTrees[0].expand = true;
    },
    renderContents(h, { root, node, data }) {
      return h(
        'span',
        {
          style: {
            display: 'inline-block',
            width: '100%',
          },
        },
        [
          h(
            'span',
            {
              style: {
                width: '85px',
                background: 'none',
              },
            },
            [
              h('Icon', {
                props: {
                  type: 'ios-folder-outline',
                },
                style: {
                  marginRight: '5px',
                },
              }),
              h(
                'k-input',
                {
                  props: {
                    size: 'small',
                    value: data.title,
                    readonly: true,
                  },
                  style: {
                    width: '76px',
                  },
                },
                data.title
              ),
            ]
          ),
          // h(
          //   'span',
          //   {
          //     style: {
          //       display: 'inline-block',
          //       float: 'right',
          //       marginRight: '10px',
          //     },
          //   },
          //   [
          //     h('Button', {
          //       props: Object.assign({}, this.ButtonProps, {
          //         icon: 'ios-plus-empty',
          //         treeData: data.isEdit,
          //       }),
          //       style: {
          //         marginRight: '5px',
          //         padding: '0px 3px',
          //       },
          //       on: {
          //         click: () => {
          //           this.append(data);
          //         },
          //       },
          //     }),
          //     h('Button', {
          //       props: Object.assign({}, this.ButtonProps, {
          //         icon: 'ios-minus-empty',
          //         treeData: data.isEdit,
          //       }),
          //       style: {
          //         marginRight: '5px',
          //         padding: '0px 3px',
          //       },
          //       on: {
          //         click: () => {
          //           this.remove(root, node, data);
          //         },
          //       },
          //     }),
          //     h('Button', {
          //       props: Object.assign({}, this.ButtonProps, {
          //         icon: 'ios-compose-outline',
          //         treeData: data.isEdit,
          //         readonly: false,
          //       }),
          //       style: {
          //         marginRight: '5px',
          //         padding: '0px 3px',
          //       },
          //       on: {
          //         click: () => {
          //           if (!data.isEdit) {
          //             // data.isEdit = false;

          //             this.edit(event, root, node, data);
          //           }
          //         },
          //       },
          //     }),
          //     h('Button', {
          //       props: Object.assign({}, this.ButtonProps, {
          //         icon: 'ios-checkmark',
          //         treeData: data.isEdit,
          //       }),
          //       style: {
          //         padding: '0px 3px',
          //         color: 'green',
          //       },
          //       on: {
          //         click: () => {
          //           // debugger;
          //           // if (!data.isEdit) {
          //           //   data.isEdit = true;
          //           this.updatas(root, node, data);
          //           // }
          //         },
          //       },
          //     }),
          //   ]
          // ),
        ]
      );
    },
    //添加树节点
    // append(data) {
    //   this.$Modal.confirm({
    //     render: h => {
    //       return h('Input', {
    //         props: {
    //           value: data.name, //添加的节点名
    //           // autofocus: true,
    //           placeholder: '请输入分类名',
    //         },
    //         on: {
    //           input: val => {
    //             data.name = val;
    //           },
    //         },
    //       });
    //     },
    //     onOk: async () => {
    //       //获取当前点击的id
    //       const id = data.data.id;
    //       const remark = data.data.remark;
    //       //把当前添加的数据放到id的子节点里
    //       const children = data.children || [];
    //       children.push({
    //         title: data.name,
    //         expand: true,
    //       });
    //       // this.$set(data, 'children', children);
    //       const response = await api.db.addBusiness({
    //         name: data.name, //分类名
    //         remark: remark, //描述
    //         parid: id, //父节点ID
    //       });
    //       this.$Message.info('添加成功');
    //       //渲染页面
    //       this.searchTrees();
    //     },
    //     onCancel: () => {
    //       this.$Message.info('取消');
    //     },
    //   });
    // },
    // 删除树节点
    // async remove(root, node, data) {
    //   const treeId = data.data.id;
    //   this.$Modal.confirm({
    //     title: '删除分类',
    //     content: '<p>确定删除该分类？</p>',
    //     onOk: async id => {
    //       const response = await api.db.deletetypeBusiness({ id: treeId });
    //       //获取父节点
    //       const parentKey = root.find(el => el === node).parent;
    //       //获取当前节点
    //       const parent = root.find(el => el.nodeKey === parentKey).node;
    //       //获取当前节点的值
    //       const index = parent.children.indexOf(data);
    //       parent.children.splice(index, 1);
    //       this.$Message.info('已删除');
    //     },
    //     onCancel: () => {
    //       this.$Message.info('取消');
    //     },
    //   });
    // },
    // edit(event, root, node, data) {
    //   event.target.parentElement.parentElement.parentElement
    //     .getElementsByTagName('span')[0]
    //     .getElementsByTagName('input')[0]
    //     .focus();
    //   // readonly = false;
    // },
    // async updatas(root, node, data) {
    //   const id = data.data.id;
    //   const remark = data.data.remark;
    //   const name = data.data.title;
    //   const response = await api.db.updateBusiness({
    //     id: id,
    //     name: name,
    //     remark: remark,
    //   });

    //   this.$Message.info('修改成功');
    // },
  },
};
</script>
<template>
  <div class="main">
    <div
      class="top"
    ><Icon
      type="ios-square"
      class="bg-icon"
      size="20"/>
      <span>目录</span>
      <Tree
        ref="tree"
        :data="dataTrees"
        :render="renderContents"
      ></Tree>
</div></div></template>

<style lang="less" scoped>
.main {
  width: 100%;
  padding-left: 25px;
  padding-right: 22px;
  height: 54%;
  border: 1px solid #e8eaec;
  padding: 0px 22px 5px 25px;
  border-top: 0px;
  padding-top: 10px;
}
.top {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.bg-icon {
  width: 8px;
  height: 8px;
  line-height: 8px;
  background-color: #2d8cf0;
  margin-right: 5px;
}
/deep/.k-input {
  background: none;
  border: none;
  cursor: default;
  color: #515a6e;
  &:active,
  &:visited {
    border-color: #ffffff;
  }
}
</style>
