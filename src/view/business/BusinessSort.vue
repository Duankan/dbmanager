<script>
export default {
  name: 'BusinessSort',
  data() {
    return {
      treeId: '',
      // isEdit: false,
      treeDatas: [],
      dataTree: [
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
                h(
                  'span',
                  {
                    style: {
                      display: 'inline-block',
                      float: 'right',
                      marginRight: '32px',
                    },
                  }[
                    h('Button', {
                      props: Object.assign({}, this.ButtonProps, {}),
                      style: {
                        marginRight: '5px',
                        padding: '0px 3px',
                      },
                      on: {
                        click: () => {
                          this.append(data);
                        },
                      },
                    })
                  ]
                ),
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
  watch: {
    dataTree: {
      handler(newVals) {
        this.treeDatas = [];
        //给对象添加isEdit属性并赋值
        newVals.forEach(element => {
          this.$set(element, 'isEdits', false);
        });
        this.$emit('on-dataTreeChangeEvnet', newVals);
      },
      immediate: true,
    },
  },
  mounted() {
    this.searchTree();
  },
  methods: {
    async searchTree() {
      const response = await api.db.findalltypeBusiness({});
      this.dataTree = response.data;
    },
    renderContent(h, { root, node, data }) {
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
                  },
                  style: {
                    width: '76px',
                  },
                  on: {
                    'on-change': e => {
                      data.value = e.target.value;
                    },
                  },
                },
                data.title
              ),
            ]
          ),
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '10px',
              },
            },
            [
              h('Button', {
                props: Object.assign({}, this.ButtonProps, {
                  icon: 'ios-plus-empty',
                }),
                class: { textdanger: data.isEdits },
                style: {
                  marginRight: '5px',
                  padding: '0px 3px',
                },
                on: {
                  click: () => {
                    this.append(data);
                  },
                },
              }),
              h('Button', {
                props: Object.assign({}, this.ButtonProps, {
                  icon: 'ios-minus-empty',
                }),
                class: { textdanger: data.isEdits },
                style: {
                  marginRight: '5px',
                  padding: '0px 3px',
                },
                on: {
                  click: () => {
                    this.remove(root, node, data);
                  },
                },
              }),
              h('Button', {
                props: Object.assign({}, this.ButtonProps, {
                  icon: 'ios-compose-outline',
                  readonly: false,
                }),
                class: { textdanger: data.isEdits },
                style: {
                  marginRight: '5px',
                  padding: '0px 3px',
                },
                on: {
                  click: () => {
                    data.isEdits = true;
                    this.edit(event, data);
                  },
                },
              }),
              h('Button', {
                props: Object.assign({}, this.ButtonProps, {
                  icon: 'ios-checkmark',
                }),
                class: { textdangers: !data.isEdits },
                style: {
                  padding: '0px 3px',
                  color: 'green',
                },
                on: {
                  click: () => {
                    if (!data.value) {
                      this.$Message.error('分类名不能为空');
                      data.isEdits = true;
                    } else {
                      this.updatas(data);
                      data.isEdits = false;
                      this.$Message.success('修改成功');
                    }
                  },
                },
              }),
            ]
          ),
        ]
      );
    },
    //添加树节点
    append(data) {
      this.$Modal.confirm({
        render: h => {
          return h('Input', {
            props: {
              value: data.name, //添加的节点名
              placeholder: '请输入分类名',
            },
            on: {
              input: val => {
                data.name = val;
              },
            },
          });
        },
        onOk: async () => {
          if (!data.name) {
            this.$Message.error('输入不能为空');
          } else {
            //获取当前点击的id
            const id = data.data.id;
            const remark = data.data.remark;
            //把当前添加的数据放到id的子节点里
            const children = data.children || [];
            children.push({
              title: data.name,
              expand: true,
            });
            // this.$set(data, 'children', children);
            const response = await api.db.addBusiness({
              name: data.name, //分类名
              remark: remark, //描述
              parid: id, //父节点ID
            });
            this.$Message.info('添加成功');
            //渲染页面
            this.searchTree();
          }
        },
        onCancel: () => {
          this.$Message.info('取消');
        },
      });
    },
    // 删除树节点
    async remove(root, node, data) {
      const treeId = data.data.id;
      this.$Modal.confirm({
        title: '删除分类',
        content: '<p>确定删除该分类？</p>',
        onOk: async id => {
          const response = await api.db.deletetypeBusiness({ id: treeId });
          //获取父节点
          const parentKey = root.find(el => el === node).parent;
          //获取当前节点
          const parent = root.find(el => el.nodeKey === parentKey).node;
          //获取当前节点的值
          const index = parent.children.indexOf(data);
          parent.children.splice(index, 1);
          this.$Message.info('已删除');
        },
        onCancel: () => {
          this.$Message.info('取消');
        },
      });
    },
    //编辑按钮
    edit(event, data) {
      event.target.parentElement.parentElement.parentElement
        .getElementsByTagName('span')[0]
        .getElementsByTagName('input')[0]
        .focus();
    },
    //编辑数据
    async updatas(index) {
      this.edit();
      const id = index.data.id;
      const remark = index.data.remark;
      const name = index.value;
      const oldname = index.title;
      const response = await api.db.updateBusiness({
        id: id,
        name: name,
        remark: remark,
        oldname: oldname,
      });
    },
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
      <span>资源分类</span>
      <Tree
        ref="tree"
        :data="dataTree"
        :render="renderContent"
      ></Tree>
</div></div></template>

<style lang="less" scoped>
.main {
  width: 100%;
  padding-left: 25px;
  padding-right: 22px;
  height: 244px;
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
/deep/.textdanger {
  display: none;
}
/deep/.textdangers {
  display: none;
}
</style>
