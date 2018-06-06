<script>
export default {
  name: 'StyleTable',
  data() {
    return {
      tableColumns: [
        //表头
        {
          title: '样式别名',
          key: 'alias',
        },
        {
          title: '样式类型',
          key: 'type',
        },
        {
          title: '样式分类',
          key: 'classify',
        },
        {
          title: '入库时间',
          key: 'createTime',
        },
        {
          title: '操作',
          width: 170,
          align: 'center',
          render: (h, params) => {
            return h('div', { style: { width: '150px' } }, [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.deletePlan(params.row);
                    },
                  },
                },
                '删除'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                  },
                  style: { marginRight: '5px' },
                  on: {
                    click: () => {
                      this.downloadPlan(params.row);
                    },
                  },
                },
                '下载'
              ),
            ]);
          },
        },
      ],
      data1: [], //data1为查询出分页数据
      vmtype: '', //vm开头为绑定的值
      PageCount: 100,
      vmclassify: '',
      vmalias: '',
      vmetime: '',
      vmitime: '',
      dataCondition: {
        objCondition: {
          // 查询条件
          orgId: this.$user.orgid, // 组织id
          start: '', // 样式上传时间 (可选)
          end: '', // 样式上传时间 (可选)
          alias: '', // 样式别名 (可选)
          type: '', // 样式类型(-1 全部 0 未知 1 点 2 线 3 面 4 dem类型) (可选)
          classify: '', // 样式分类(见styleTypes) (可选)
        },
        pageIndex: 1, // 分页索引
        pageSize: 5, // 分页大小
      },
      type: [
        //样式类型
        {
          value: '1',
          label: '点类型',
        },
        {
          value: '2',
          label: '线类型',
        },
        {
          value: '3',
          label: '面类型',
        },
        {
          value: '0',
          label: '未知类型',
        },
      ],
      classify: [
        //样式分类
      ],
    };
  },
  async created() {
    //创建模板完成
    this.getData();
    this.setStyleTypes();
  },
  methods: {
    async changePage(evt) {
      //跳转页面方法
      this.dataCondition.pageIndex = evt;
      this.getData();
    },
    async getData() {
      //查询后端table数据方法
      const response = await api.db.findStyle(this.dataCondition);
      this.data1 = response.data.dataSource;
      this.changeTime(this.data1);
      this.changeType(this.data1);
      this.changeStyleType(this.data1);
      this.PageCount = response.data.pageInfo.totalCount * 2;
    },
    async setStyleTypes() {
      //查询后端数据设置样式分类的下拉框
      const styleTypes = await api.db.styleTypes();
      for (let item of styleTypes.data) {
        //alert(item.remark);
        let Type = {
          value: item.code,
          label: item.remark,
        };
        this.classify.push(Type);
      }
      this.classify.push({
        value: '其他类型',
        label: '其他类型',
      });
    },
    changeTime(data1) {
      //转换时间方法
      for (let item of data1) {
        item.createTime = new Date(item.createTime).toLocaleDateString();
      }
    },
    changeType(data1) {
      //把后端查询到的数据 类型int转换成中文方法
      for (let item of data1) {
        switch (item.type) {
          case 0:
            item.type = '未知类型';
            break;
          case 1:
            item.type = '点类型';
            break;
          case 2:
            item.type = '线类型';
            break;
          case 3:
            item.type = '面类型';
            break;
        }
      }
    },
    changeStyleType(data1) {
      //把后端查询到的数据 样式类型转换成中文方法
      for (let item of data1) {
        for (let item2 of this.classify) {
          if (item.classify == item2.value) {
            item.classify = item2.label;
          }
        }
      }
    },
    async deletePlan(evt) {
      //删除方法借口   deleteStyle
      await api.db.deleteStyle({ id: evt.id });
      this.getData();
    },
    downloadPlan(evt) {
      //下载方法借口   deleteStyle
      alert('ss');
      api.db.downloadStyle({ id: evt.id });
    },
    search() {
      //查询功能
      this.pageIndex = 1;
      this.dataCondition.objCondition.type = this.vmtype;
      this.dataCondition.objCondition.alias = this.vmalias;
      this.dataCondition.objCondition.classify = this.vmclassify;
      this.dataCondition.objCondition.start = new Date(this.vmetime);
      this.dataCondition.objCondition.end = new Date(this.vmitime);
      this.getData();
    },
    reset() {
      //重置功能
      this.vmetime = '';
      this.vmitime = '';
      this.vmalias = '';
      this.vmtype = '';
      this.vmclassify = '';
      this.dataCondition.objCondition.type = '';
      this.dataCondition.objCondition.alias = '';
      this.dataCondition.objCondition.classify = '';
      this.dataCondition.objCondition.start = '';
      this.dataCondition.objCondition.end = '';
      this.getData();
    },
  },
};
</script>

<template>
  <div>

    <div style="position:  absolute;top: 58px;left:  1.8%;height: 110px;width:  97%;">
      <div style="position:  absolute;top: 0px;height: 55px;width:  100%;" >
        <div style="position:  absolute;top: 0px;left:  0%;" >
          <span
            style="
    float:  left;
    font-size: 14px;
    line-height: 32px;
" >入库时间:</span>
          <Row>
            <Col span="12">
            <DatePicker
              v-model="vmetime"
              type="date"
              placeholder="2018-06-13"
              style="width: 200px"></DatePicker>
        </Col>
          </Row>
        </div>
        <div style="position:  absolute;top: 0px;left:  35%;" >
          <span
            style="
    float:  left;
    font-size: 14px;
    line-height: 32px;
" >出库时间:</span>
          <Row >
            <Col span="12">
            <DatePicker
              v-model="vmitime"
              type="date"
              placeholder="2018-06-13"
              style="width: 200px"></DatePicker>
        </Col>
          </Row>
        </div>
        <div style="position:  absolute;top: 0px;left:  70%;" >
          <span
            style="
    float:  left;
    font-size: 14px;
    line-height: 32px;
" >样式别名:</span>
          <Input
            v-model="vmalias"
            placeholder="default_point"
            clearable
            style="width: 215px"></Input>
        </div>
      </div>
      <div style="position:  absolute;top: 50px;height: 55px;width:  100%;" >
        <div style="position:  absolute;top: 0px;left:  0%;" >
          <span
            style="
    float:  left;
    font-size: 14px;
    line-height: 32px;
" >样式类型:</span>
          <Select
            v-model="vmtype"
            style="width:200px">
            <Option
              v-for="item in type"
              :value="item.value"
              :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div style="position:  absolute;top: 0px;left:  35%;" >
          <span
            style="
    float:  left;
    font-size: 14px;
    line-height: 32px;
" >样式分类:</span>
          <Select
            v-model="vmclassify"
            style="width:200px">
            <Option
              v-for="item in classify"
              :value="item.value"
              :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div style="position:  absolute;top: 0px;right:  0%;" >
          <Button
            type="primary"
            icon="ios-search"
            @click="search">查询</Button>
          <Button
            type="primary"
            @click="reset">重置</Button>
        </div>
      </div>
    </div>

    <div style="position: absolute;top: 170px;width: 97%;">
      <Table
        :columns="tableColumns"
        :data="data1"
      >
      </Table>
    </div>
    <div style="margin: 10px;overflow: hidden ;position:  absolute;top: 464px;right:  0%;">
      <div style="float: right;">


        <Page
          :total="PageCount"

          show-elevator

          @on-change="changePage"></Page>




      </div>
    </div>


  </div>
</template>
