<script>
export default {
  name: 'LayerCollect',
  props: {},
  data() {
    return {
      showPanel: false,
      editState: false,
      treeData: [],
      name: '',
    };
  },
  watch: {
    async showPanel(val) {
      if (val) {
        const response = await api.db.findMapLayer({
          organizationId: this.$user.orgid,
          userId: this.$user.id,
          typeId: '50002',
        });
        this.treeData = response.data;
      }
    },
  },
  methods: {
    // 更新地图文档名称
    update() {
      this.editState = false;
    },
    delete() {},
    renderContent(h, { root, node, data }) {
      return (
        <div>
          <svg-icon size="16" iconClass="maps" />
          {this.editState ? (
            <span class="layer-collect-wrap">
              <Input value={data.name} size="small" style={{ width: '120px' }} />
              <icon type="checkmark" color="#19be6b" nativeOnClick={this.update} />
            </span>
          ) : (
            <span class="layer-collect-wrap">
              <span class="layer-collect-name">{data.name}</span>
              <icon type="edit" nativeOnClick={() => (this.editState = true)} />
            </span>
          )}
          <span class="layer-collect-button">
            <svg-icon size="16" iconClass="view" />
            <poptip confirm transfer title="确定要删除该图层收藏吗?" onOn-ok={this.delete}>
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
      content="地图文档"
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
        dis-hover>
        <p slot="title">地图文档</p>
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
