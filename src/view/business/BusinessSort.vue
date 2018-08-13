<script>
export default {
  name: 'BusinessSort',
  data() {
    return {
      dataTree: [
        {
          title: '文件夹',
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
                      props: Object.assign({}, this.ButtonProps, {
                        icon: 'ios-plus-empty',
                        // type: 'primary',
                      }),
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
              title: '文件夹一',
              expand: true,
              children: [
                {
                  title: '数据1',
                  expand: true,
                },
                {
                  title: '数据2',
                  expand: true,
                },
              ],
            },
            {
              title: '文件夹二',
              expand: true,
              children: [
                {
                  title: '数据1',
                  expand: true,
                },
                {
                  title: '数据2',
                  expand: true,
                },
                {
                  title: '数据3',
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
  methods: {
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
                  type: 'ios-paper-outline',
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
                    // readonly: true,
                    // disabled: true,
                  },
                  style: {
                    width: '65px',
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
                }),
                style: {
                  padding: '0px 3px',
                },
                on: {
                  click: () => {
                    this.edit(root, node, data);
                  },
                },
              }),
            ]
          ),
        ]
      );
    },
    append(data) {
      this.$Modal.confirm({
        render: h => {
          return h('Input', {
            props: {
              value: this.value,
              autofocus: true,
              placeholder: '请输入分类名',
            },
            on: {
              input: val => {
                this.value = val;
              },
            },
            onOk: () => {
              this.$Message.info('Clicked ok');
            },
            onCancel: () => {
              this.$Message.info('Clicked cancel');
            },
          });
        },
      });

      // const children = data.children || [];

      // children.push({
      //   title: '数据',
      //   expand: true,
      // });
      // this.$set(data, 'children', children);
    },
    remove(root, node, data) {
      //获取根节点
      const parentKey = root.find(el => el === node).parent;
      //获取父节点
      const parent = root.find(el => el.nodeKey === parentKey).node;
      //获取当前节点
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    edit(root, node, data) {
      this.$Modal.confirm({
        render: h => {
          return h('Input', {
            props: {
              value: this.value,
              autofocus: true,
              placeholder: '请输入分类名',
            },
            on: {
              input: val => {
                this.value = val;
              },
            },
          });
        },
      });
    },
    // //获取根节点
    // const parentKey = root.find(el => el === node).parent;
    //  //获取父节点
    // const parent = root.find(el => el.nodeKey === parentKey).node;
    // // //获取当前节点
    // const index = parent.children.indexOf(data);
    //  //获取当前节点的名称
    //  parent.children[index].title;
  },
  // },
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
        :data="dataTree"
        :render="renderContent"></Tree>
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
  // cursor: default;
  color: #515a6e;
}
</style>
