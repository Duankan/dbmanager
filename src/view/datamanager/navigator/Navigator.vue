<script>
import CommonTree from './CommonTree';
import api from 'api';

export default {
  name: 'Navigator',
  components: {
    CommonTree,
  },
  data() {
    return {
      classify: [
        {
          name: '最近',
          icon: 'map-edit',
        },
        {
          name: '全部',
          icon: 'map-edit',
        },
        {
          name: '矢量',
          icon: 'map-edit',
        },
        {
          name: '影像',
          icon: 'map-edit',
        },
        {
          name: '服务',
          icon: 'map-edit',
        },
        {
          name: '样式',
          icon: 'map-edit',
        },
        {
          name: '文档',
          icon: 'map-edit',
        },
        {
          name: '其他',
          icon: 'map-edit',
        },
      ],
    };
  },
  methods: {
    async select(node) {
      const response = await api.db.findCatalog({
        owner: 1,
        ownerId: this.$user.orgid,
        access: 1,
        hasChild: false,
        relatedType: 1,
        orderby: 'sort_asc',
        getmode: 'all',
        resourceTypeId: '1,2',
        parentId: node.childId,
      });
      this.$emit('on-load-nodes', response.data);
    },
    async favor(nodeData) {
      await api.db.addCommonCatalog({
        favoriteId: nodeData.id, //目录id
        name: nodeData.name, //目录名称（可自定）
        type: '1001', // 1001:目录 1002:服务 1003:数据
        userId: this.$user.id, //用户id
      });
      this.$refs['common-tree'].update();
    },
  },
};
</script>

<template>
  <div class="navigator">
    <div>
      <h4>收藏夹</h4>
      <CommonTree
        ref="common-tree"
        @on-current-select="select"></CommonTree>
    </div>
    <div>
      <h4>我的数据</h4>
      <DataTree
        directory
        accordion
        @on-current-select="select">
        <Icon
          slot-scope="{ nodeData }"
          :size="16"
          color="red"
          type="android-favorite"
          @click.native.stop="favor(nodeData)"></Icon>
      </DataTree>
    </div>
    <div>
      <h4>分类</h4>
      <ul class="classify">
        <li
          v-for="item in classify"
          :key="item.name">
          <SvgIcon
            :icon-class="item.icon"
            :size="18"></SvgIcon>
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
.navigator {
  width: 260px;
  height: 100%;
  padding: 10px 15px;
  border-right: 1px solid #eee;

  h4 {
    margin: 16px 0 8px 0;
    text-indent: 8px;
    border-left: 2px solid #318cf0;
    &:first-child {
      margin-top: 8px;
    }
  }

  .classify {
    list-style: none;
    font-size: 14px;
    padding-left: 16px;
    li {
      margin: 16px 0;
      cursor: pointer;
      &:first-child {
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }
    }
  }
}
</style>
