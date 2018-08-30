<script>
import api from 'api';

const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';
const SET_MAP_GOCLAYER_DELETE = 'SET_MAP_GOCLAYER_DELETE';

export default {
  name: 'LayerCollect',
  props: {},
  data() {
    return {
      showPanel: false,
      treeData: [],
    };
  },
  watch: {
    async showPanel(val) {
      if (val) {
        this.init();
      }
    },
  },
  methods: {
    // 获取图层集列表
    async init() {
      const response = await api.db.findMapLayer({
        organizationId: this.$appUser.orgid,
        userId: this.$appUser.id,
        typeId: '50002',
      });
      this.treeData = response.data;
    },
    // 更新图层集名称
    async update(data) {
      let info = data.info;
      let entity = { ...data };
      entity.info = JSON.parse(entity.info);
      entity.name = entity._name;
      let params = {
        infoEntity: entity,
        mapExEntity: { info },
      };
      await api.db.updateMapLayer(params);
      data.name = data._name;
      this.$Message.success('重命名成功！');
      this.$set(data, 'editState', false);
    },
    // 浏览图层集
    view(data) {
      let config = JSON.parse(data.info);
      let layers = this.$store.getters.ogcLayers.map(p => p.options.layers);
      this.$store.commit(SET_MAP_GOCLAYER_DELETE, layers);
      this.$nextTick(p => {
        this.$store.commit(SET_MAP_SERVICELIST, config.layers);
        this.$nextTick(m => {
          let map = this.$store.getters.mapManager._map;
          map.setView(config.center, config.zoom);
        });
      });
    },
    // 删除图层集
    async delete(data) {
      await api.db.deleteMapLayer({
        id: data.id,
      });
      await this.init();
      this.$Message.success('图层集删除成功！');
    },
    renderContent(h, { root, node, data }) {
      return (
        <div>
          <svg-icon size="16" iconClass="maps" />
          {data.editState ? (
            <span class="layer-collect-wrap">
              <Input
                value={data.name}
                size="small"
                style={{ width: '100px' }}
                onOn-change={e => {
                  data._name = e.target.value;
                }}
              />
              <icon type="checkmark" color="#19be6b" nativeOnClick={() => this.update(data)} />
              <icon
                type="close-round"
                color="#000"
                nativeOnClick={() => this.$set(data, 'editState', false)}
              />
            </span>
          ) : (
            <span class="layer-collect-wrap">
              <span class="layer-collect-name" title={data.name}>
                {data.name}
              </span>
              <icon type="edit" nativeOnClick={() => this.$set(data, 'editState', true)} />
            </span>
          )}
          <span class="layer-collect-button">
            <svg-icon size="16" iconClass="view" nativeOnClick={() => this.view(data)} />
            <poptip
              confirm
              transfer
              title="确定要删除该图层收藏吗?"
              onOn-ok={() => this.delete(data)}
            >
              <svg-icon size="16" iconClass="delete" />
            </poptip>
          </span>
        </div>
      );
    },
  },
};
</script>

<template>
  <div class="k-layer-collect">
    <Tooltip
      content="图层集"
      placement="left">
      <div
        class="layer-collect"
        @click="showPanel = !showPanel">
        <Icon
          type="ios-albums-outline"
          color="#fff"
          size="22"/>
      </div>
    </Tooltip>

    <transition name="expand">
      <Card
        v-show="showPanel"
        :bordered="false"
        class="border-card"
        dis-hover>
        <p slot="title">图层集</p>
        <Tree
          :data="treeData"
          :render="renderContent"></Tree>
      </Card>
    </transition>
  </div>
</template>

<style lang="less" scoped>
.k-layer-collect {
  position: absolute;
  top: 86px;
  right: 28px;
  z-index: 800;

  .layer-collect {
    background: #bdbdbd;
    padding: 6px 8px;
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
    width: 260px;

    /deep/ .k-card-head {
      padding: 4px 10px;
      background: #318cf0;

      & > p {
        color: #fff;
      }
    }

    /deep/ .k-card-body {
      padding: 5px;
      overflow: hidden;
      max-height: 400px;
    }

    /deep/ .layer-collect-wrap {
      margin-left: 8px;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      .k-icon {
        margin-left: 8px;
      }
    }

    /deep/ .layer-collect-button {
      float: right;
      margin-top: 4px;
      > .k-svgicon {
        margin-right: 6px;
      }
    }

    /deep/ .k-tree-empty {
      text-align: center;
      font-size: 12px;
      color: #555555;
    }
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
