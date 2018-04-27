<script>
import CommonTree from './CommonTree';

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
    select(node) {
      console.log(node);
    },
  },
};
</script>

<template>
  <div class="navigator">
    <div>
      <h4>收藏夹</h4>
      <CommonTree></CommonTree>
    </div>
    <div>
      <h4>我的数据</h4>
      <DataTree
        directory
        accordion
        @on-current-select="select"></DataTree>
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
