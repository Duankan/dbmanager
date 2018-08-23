<script>
import LayerEditBar from '@/components/layeredit/LayerEditBar';
import LayerHistory from '@/components/layerhistory/LayerHistory';
const layerType = [{ key: 0, type: 'wms' }, { key: 1, type: 'wmts' }];
export default {
  name: 'LayerTree',
  data() {
    return {
      form: {
        name: '',
        description: '',
      },
      rule: {
        name: [{ required: true, message: '保存的图层组名称不能为空', trigger: 'blur' }],
      },
      showPanel: false,
      showTree: true,
      //历史图层window
      historyHandler: null,
      //编辑功能window
      editHandler: null,
    };
  },
  computed: {
    ogcLayers() {
      return this.$store.getters.ogcLayers;
    },
    layerData() {
      const layerData = [
        {
          title: '全选图层',
          children: [],
          expand: true,
        },
      ];
      layerData[0].children = this.ogcLayers.map(layer => {
        let type, getType;
        if (layer) {
          if (layer instanceof L.NonTiledLayer.WMS) {
            getType = layerType.find(item => item.key === 0);
          } else if (layer instanceof L.TileLayer.WMTS) {
            getType = layerType.find(item => item.key === 1);
          }
          type = getType.type;
          return {
            id: layer._leaflet_id,
            name: layer.options.layers ? layer.options.layers : layer.options.layer,
            title: layer.options.title ? layer.options.title : layer.options.layer,
            bbox: layer.options.saveBbox,
            opacity: layer.options.opacity,
            type,
            checked: layer.options.visible,
          };
        }
      });
      return layerData;
    },
  },
  watch: {
    ogcLayers() {
      this.showPanel = true;
    },
  },
  async created() {
    const response = await api.public.findCatalog({
      owner: 1,
      ownerId: this.$appUser.orgid,
      access: 1,
      hasChild: false,
      orderby: 'sort_asc',
    });
    this.catalogId = response.data[0].childId;
  },
  methods: {
    renderTreeNode(h, { root, node, data }) {
      if (data.children) {
        return (
          <span class={'k-tree-title-name'}>
            {data.title}
            <span class={'k-tree-more'}>
              <svg-icon
                size={16}
                icon-class={'delete'}
                title="全部删除"
                nativeOnClick={() => this.removeLayer(root, node, data)}
              />
            </span>
          </span>
        );
      } else {
        let layerEdit = (
          <svg-icon
            size={16}
            icon-class={'edit'}
            color={'#1296db'}
            title="图层编辑"
            nativeOnClick={() => this.editLayer(root, node, data)}
          />
        );
        let layerHistory = (
          <svg-icon
            size={16}
            icon-class={'history'}
            title="历史版本"
            nativeOnClick={() => this.layerHistory(root, node, data)}
          />
        );
        return (
          <div class={'k-tree-group'}>
            <ellipsis length={18}>{data.title}</ellipsis>
            <span class={'k-tree-more'}>
              <svg-icon
                size={16}
                icon-class={'position'}
                title="图层定位"
                nativeOnClick={() => this.positionLayer(root, node, data)}
              />
              {data.type == 'wms' ? layerEdit : ''}
              {data.type == 'wmts' ? layerHistory : ''}
              <svg-icon
                size={16}
                icon-class={'delete'}
                title="图层删除"
                nativeOnClick={() => this.deleteLayer(root, node, data)}
              />
            </span>

            <slider
              value={data.opacity * 100}
              step={10}
              onOn-input={val => this.setOpacity(data.id, val / 100)}
              tip-format={val => `透明度：${val}%`}
            >
              {data.title}
            </slider>
          </div>
        );
      }
    },
    // 图层透明度
    setOpacity(id, opacity) {
      const layer = this.ogcLayers.filter(item => item._leaflet_id === id)[0];
      layer.setOpacity(opacity);
    },
    // 图层可见
    check(node) {
      const { id, checked, children } = node;
      if (children) {
        this.ogcLayers.forEach(layer => layer.setVisible(checked));
      } else {
        const layer = this.ogcLayers.find(layer => layer._leaflet_id === id);
        layer.setVisible(checked);
      }
    },
    // 图层排序，node(放置的位置)，dragNode(当前节点)
    sort(position, node, dragNode) {
      if (node.nodeKey == 0) return;
      // position 靠近下边缘 1, 靠近上边缘 -1
      debugger;
      this.$store.commit('SET_MAP_WMSLAYER_SORT', {
        position,
        dragNodeId: dragNode.id,
        dropNodeId: node.id,
      });
      // this.ogcLayers.forEach((layer, index, arr) => layer.setZIndex(arr.length - index));
    },
    // 移除图层
    deleteLayer(root, node, data) {
      this.$store.commit('SET_MAP_GOCLAYER_DELETE', [data.name]);
    },
    // 移除全部图层
    removeLayer(root, node, data) {
      const deleteLayers = data.children.map(layer => layer.name);
      this.$store.commit('SET_MAP_GOCLAYER_DELETE', deleteLayers);
    },
    // 图层定位
    positionLayer(root, node, data) {
      this.$events.emit('on-set-bbox', { bbox: data.bbox, index: node.nodeKey, type: data.type });
    },
    //编辑图层要素
    editLayer(root, node, data) {
      this.closeEditWindow();
      let container = this.$store.getters.mapManager._map._container.parentElement;
      this.editHandler = this.$FloatPanel.create({
        title: '图层编辑工具栏',
        width: 270,
        position: {
          x: container.clientWidth - 300,
          y: 300,
        },
        parent: container,
        render: h => {
          return h(LayerEditBar, {
            props: {
              layer: data.name,
            },
          });
        },
      });
    },
    //查看图层历史版本
    async layerHistory(root, node, data) {
      this.closeHistoryWindow();
      const response = await api.db.getVersionByName({ id: data.name });
      if (response.data) {
        if (response.data.length > 0) {
          this.createHistoryWindow(response.data, data.name);
        } else {
          this.$Message.warning('该图层没有历史版本！');
        }
      } else {
        this.$Message.warning('该图层没有历史版本！');
      }
    },
    //创建历史图层窗口
    createHistoryWindow(data, layerName) {
      let container = this.$store.getters.mapManager._map._container.parentElement;
      let self = this;
      this.historyHandler = this.$FloatPanel.create({
        title: '图层历史版本',
        width: 285,
        height: container.clientHeight - 100,
        position: {
          x: container.clientWidth - 360,
          y: 20,
        },
        parent: container,
        disableDrag: true,
        render: h => {
          return h(LayerHistory, {
            props: {
              layerData: data,
              originalLayerName: layerName,
            },
          });
        },
        onClose() {
          self.historyHandler.getContent().reset();
        },
      });
    },
    //关闭历史图层窗口
    closeHistoryWindow() {
      if (this.historyHandler) {
        this.$FloatPanel.remove(this.historyHandler.panelId);
      }
      this.historyHandler = null;
    },
    //关闭编辑窗口
    closeEditWindow() {
      if (this.editHandler) {
        this.editHandler.getContent().reset();
        this.$FloatPanel.remove(this.editHandler.panelId);
      }
      this.editHandler = null;
    },
    // 切换图层面板显示隐藏
    toggle() {
      this.showPanel = !this.showPanel;
      this.showTree = true;
    },
    // 按钮点击事件
    click() {
      if (this.showTree) {
        this.showTree = false;
      } else {
        this.save();
      }
    },
    // 保存地图文档
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let document = this.getDocumentInfo();
          const response = await api.db.createMapLayer({
            infoEntity: {
              id: '',
              catalogId: this.catalogId, // 目录id
              name: this.form.name, // 地图文档名称
              description: this.form.description, // 描述
              info: document, // 地图文档信息对象
              size: 0,
              typeId: '50002',
              userId: this.$appUser.id, // 用户Id
              userName: this.$appUser.name, // 用户名
            },
            mapExEntity: {
              info: JSON.stringify(document), //地图扩展信息
            },
          });
          this.$Message.success('保存地图文档成功！');
          this.showTree = true;
        }
      });
    },
    //获取地图文档信息
    getDocumentInfo() {
      let layers = this.$store.state.map.serviceList;
      //设置图层选项(显隐和透明度)
      for (let key in layers) {
        let wfsLayer = layers[key].find(p => p.servicestype == 12);
        let layerInfo = this.ogcLayers.find(p => (p.options.layers = key));
        wfsLayer.options = {
          visible: layerInfo.options.visible,
          opacity: layerInfo.options.opacity,
        };
      }
      //获取中心点和缩放
      let map = this.$store.getters.mapManager._map;
      let document = {
        layers,
        center: map.getCenter(),
        zoom: map.getZoom(),
      };
      return document;
    },
  },
};
</script>

<template>
  <div class="k-layer-tree">
    <Tooltip
      content="图层"
      placement="left">
      <div
        class="layer-control"
        @click="toggle">
        <Icon
          type="social-buffer"
          color="#fff"
          size="24"/>
      </div>
    </Tooltip>
    <transition name="expand">
      <Card
        v-show="showPanel"
        :bordered="false"
        class="border-card"
        dis-hover>
        <p slot="title">图层管理</p>
        <Icon
          v-show="!showTree"
          slot="extra"
          type="reply"
          color="#fff"
          size="20"
          @click.native="showTree = true"></Icon>
        <Tree
          v-show="showTree"
          :data="layerData"
          :render="renderTreeNode"
          :click-node-expand="false"
          show-checkbox
          only-sort
          draggable
          @on-current-check="check"
          @on-drop="sort"
        />
        <Form
          v-show="!showTree"
          ref="form"
          :model="form"
          :rules="rule"
          :label-width="60">
          <FormItem
            label="图层集"
            prop="name">
            <Input v-model="form.name"></Input>
          </FormItem>
          <FormItem
            label="图层描述"
            prop="description">
            <Input
              v-model="form.description"
              :autosize="{minRows: 2,maxRows: 5}"
              type="textarea"
            ></Input>
          </FormItem>
        </Form>
        <Button
          v-if="ogcLayers.length"
          :type="showTree ? 'primary' : 'success'"
          class="save-layer"
          size="small"
          long
          @click="click">{{ showTree ? '保存' : '提交' }}
        </Button>
      </Card>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.k-layer-tree {
  position: absolute;
  top: 28px;
  right: 28px;
  z-index: 800;

  .layer-control {
    background: #318cf0;
    padding: 4px 8px;
    border-radius: 4px;
    transition: box-shadow 0.3s;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
    }
  }

  .k-card {
    position: absolute;
    top: 0px;
    right: 50px;
    width: 280px;

    /deep/ .k-card-head {
      padding: 4px 10px;
      background: #318cf0;

      & > p {
        color: #fff;
      }
    }

    /deep/ .k-card-extra {
      top: 5px;
      right: 10px;
      cursor: pointer;
    }

    /deep/ .k-card-body {
      padding: 5px;
    }
  }

  .k-tree {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 300px;
    padding-right: 16px;

    /deep/ .k-tree-arrow {
      visibility: hidden;
    }

    /deep/ .k-tree-children {
      padding: 0;
    }

    /deep/ .k-tree-more {
      float: right;
      > .k-svgicon {
        margin-left: 6px;
      }
    }

    /deep/ .k-tree-title:hover {
      .k-slider {
        height: auto;
        margin: 8px 0;
        opacity: 1;
      }
    }
  }

  /deep/ .k-slider {
    height: 0;
    opacity: 0;
    width: 90%;
    transition: all 0.3s;
  }

  /deep/ .k-slider-wrap {
    margin: 0;
  }

  .k-form-item:last-child {
    margin-bottom: 0px;
  }

  .save-layer {
    margin-top: 16px;
  }

  .expand-enter-active,
  .expand-leave-active {
    transform-origin: right top;
    transition: all 0.3s ease-in-out;
  }

  .expand-enter,
  .expand-leave-to {
    opacity: 0;
    transform: scale3d(0, 0, 0);
  }
}
</style>
