<script>
import api from 'api';
import { url } from '@ktw/ktools';
import MapEdit from '@/./view/mapedit/MapEdit';

const SET_MAP_SERVICELIST = 'SET_MAP_SERVICELIST';

export default {
  name: 'ServiceListItem',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      thumbnail: true,
      editshow:
        this.node.resource.shapeType.toUpperCase() == 'POLYGON' ||
        this.node.resource.shapeType.toUpperCase() == 'POINT' ||
        this.node.resource.shapeType.toUpperCase() == 'LINESTRING' ||
        this.node.resource.shapeType == 'polyline',
    };
  },
  computed: {
    serviceName() {
      return this.node.serviceType === '12' ? 'WMS' : 'WMTS';
    },
  },
  methods: {
    async view() {
      //把显示的图层一个个的都丢到MapView.vue里面去。在哪个页面做修改
      const response = await api.db.findService({
        resourceId: this.node.resourceId, // 资源id
        serivestatus: 0, // 服务状态(0 开启 1 关闭)
        baseservicetype: 1, // 基础服务
        metadataLayer: this.node.metadataLayer, // 元数据图层
      });
      const search = url.parse(this.node.serviceUrl).search;
      const layers = search.layers ? search.layers : search.typeName;
      if (response.data.length === 1) {
        this.$store.commit(SET_MAP_SERVICELIST, {
          [layers]: [response.data[0]],
        });
      } else {
        this.$store.commit(SET_MAP_SERVICELIST, {
          [layers]: [response.data[0], response.data[1]],
        });
      }
    },
    edit() {
      this.$emit('style-edit-event', this.node);
      // this.vm = this.$window({
      //   title: '图层编辑',
      //   footerHide: true,
      //   render: h => {
      //     return h(
      //       MapEdit,
      //       {
      //         props: {
      //           value: { data: this.node, sto: this.$store },
      //         },
      //       },
      //       [this.$scopedSlots.default]
      //     );
      //   },
      //   width: 730,
      //   height: 680,
      // });
    },
  },
};
</script>

<template>
  <Card>
    <Tooltip
      v-if="thumbnail"
      placement="right"
      transfer>
      <img
        :src="node.picPath"
        class="thumb"
        alt="缩略图"
        @error="() => thumbnail = false">
      <div
        slot="content"
        :style="{backgroundImage: `url(${node.picPath})`}"
        class="full-figure">
      </div>
    </Tooltip>
    <img
      v-else
      src="~assets/mapview/placeholder.jpg"
      class="thumb"
      alt="缩略图">
    <div class="service-info">
      <div>
        <Ellipsis :length="14">{{ node.title }}</Ellipsis>
        <Timeago :since="node.updateTime"></Timeago>
      </div>
      <span>{{ node.orgName }}</span>
      <div class="mask">
        <Icon
          v-if="editshow"
          type="gear-b"
          size="28"
          color="#fff"
          @click.native="edit"
        ></Icon>
        <Icon
          type="ios-search-strong"
          size="32"
          color="#fff"
          @click.native="view"></Icon>
      </div>
    </div>
    <span class="service-type">{{ serviceName }}</span>
  </Card>
</template>

<style lang="less" scoped>
.k-card {
  position: relative;
  cursor: pointer;
  margin-bottom: 8px;
  overflow: hidden;

  /deep/ .k-card-body {
    display: flex;
    padding: 4px 12px;
    height: 48px;

    .thumb {
      width: 40px;
      height: 40px;
    }

    .service-info {
      flex: 1;
      margin-left: 18px;

      div:nth-child(1) {
        height: 20px;
        line-height: 20px;
      }

      span:nth-child(2) {
        font-size: 12px;
        color: #9ea7b4;
      }

      .k-timeago {
        float: right;
        font-size: 12px;
      }

      .mask {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        z-index: 1;
        transform: translate3d(100%, 0, 0);
        transition: all 0.3s;
        background: rgba(0, 0, 0, 0.15);

        span {
          color: #fff;
          font-weight: bold;
        }

        .k-icon {
          text-align: center;
          &:first-child {
            flex: 1 1 0;
          }
          &:last-child {
            flex: 2 1 0;
          }
        }
      }
      &:hover {
        .mask {
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
      }
    }

    .service-type {
      display: inline-block;
      position: absolute;
      top: -2px;
      left: -22px;
      font-size: 12px;
      padding: 2px 16px;
      color: #fff;
      transform: scale(0.6) rotate(-45deg);
      background: #358cf0;
    }
  }
}
.full-figure {
  height: 180px;
  width: 180px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}
</style>
