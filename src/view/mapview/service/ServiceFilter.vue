<script>
import api from 'api';

export default {
  name: 'ServiceFilter',
  data() {
    return {
      breadcrumb: [],
      filter: [
        {
          name: '所属类别',
          description: '',
          children: [
            { name: '发布人', description: '', field: 'userName' },
            { name: '发布部门', description: '', field: 'orgName' },
            { name: '服务标签', description: '', field: 'tag' },
            { name: '所在目录', description: '', field: 'catalogName' },
          ],
        },
        {
          name: '服务类型',
          description: '',
          children: [
            { name: '服务类型', description: '', field: 'metadataLayer' },
            { name: '服务类别', description: '', field: 'serviceType' },
            { name: '服务源', description: '', field: 'serviceSource' },
          ],
        },
        {
          name: '数据类型',
          description: '',
          field: 'shapeType',
        },
      ],
    };
  },
  methods: {
    async loadData(item) {
      const response = await api.db.getAttribute({
        filter: item.field,
      });
    },
  },
  // private String orgName; //所属部门
  // private String userName; //所属人
  // private String tag; //标签
  // private String catalogName; //目录名称

  // private Integer metadataLayer;//资源类型（0-基础服务 1-元数据服务 2-普通服务）
  // private String serviceType; //服务类型  WMS WMS-G WMTS
  // private Integer serviceSource; //服务来源（0-金拓维公司内部 1-第三方来源）

  // private Integer shapeType // 点 线 面
};
</script>

<template>
  <div class="service-filter">
    <Breadcrumb>
      <BreadcrumbItem>全部</BreadcrumbItem>
      <BreadcrumbItem
        v-for="(item, index) in breadcrumb"
        :key="item.id"
        @click.native="select(item, index)">{{ item.name }}</BreadcrumbItem>
    </Breadcrumb>
    <ul class="service-filter-list">
      <li
        v-for="item in filter"
        :key="item.name"
        @click="loadData(item)">
        {{ item.name }}
        <Icon
          v-if="item.children"
          type="chevron-right"></icon>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.service-filter {
  &-list li {
    height: 36px;
    line-height: 36px;
    padding: 0 12px;

    .k-icon {
      float: right;
      margin-top: 12px;
    }
    &:hover {
      background-color: #eee;
      cursor: pointer;
    }
  }
}
</style>
