<script>
import * as types from '@/store/types';
import api from 'api';
import { filterSchema, getNodeStyleType } from '@/utils/helps';
import { date } from '@ktw/ktools';

const TASK_TYPE = '矢量切片';

export default {
  name: 'Publish',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      crsLoading: false,
      publishLoading: false,
      showMore: false, // 控制显示详细信息
      publishType: 1, //发布类型，1:矢量，2：影像，3地名地址
      crsOptions: [],
      styleOptions: [],
      resourceInfo: {}, //资源信息
      fieldsInfo: [], //字段信息
      levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], //影像发布等级
      plotTypes: ['1.0', '2.0'],
      plotPlans: ['rasterPlotWorld', 'rasterPlotRect'],
      serviceTypes: [],
      imageColors: ['#FFFFFFFF'], //影像输出颜色
      publishForm: this.createDefaultModel('', ''),
    };
  },
  computed: {
    current() {
      return this.$store.state.app.currentDirectory;
    },
  },
  watch: {
    async node(val) {
      if (val) {
        const name = await this.handleServiceName(val.name);
        this.publishForm = this.createDefaultModel(name, val.name);
        this.resourceInfo = val;
        this.showMore = false;
        this.getStyle(val);
        this.getType(val);
        this.getFields(val);
      }
    },
  },
  created() {
    // 获取空间参考
    this.remoteMethod('');
  },
  events: {
    'on-poll-complete': 'completePollTask',
  },
  methods: {
    visibleChange(visible) {
      if (!visible) {
        this.publishForm.crs = '';
        this.publishForm.styles = '';
      }
      this.$emit('input', visible);
    },
    //创建默认发布模型
    createDefaultModel(name, title) {
      return {
        title,
        name,
        crs: '',
        styles: '',
        isVectorTile: false,
        minCacheLevel: 0,
        maxCacheLevel: 8,
        serviceType: ['12', '6'],
        nameField: '',
        typeField: '',
        minLevel: 8,
        maxLevel: 17,
        rasterPlotPlan: 'rasterPlotWorld',
        rasterRplotType: '2.0',
        inputTransparentColor: '',
        outputTransparentColor: '',
      };
    },
    // 获取样式信息
    async getStyle(node) {
      const response = await api.db.findSyleByType({
        orgId: this.$appUser.orgid,
        type: getNodeStyleType(node),
      });
      this.styleOptions = response.data;
    },
    //获取节点类型
    getType(node) {
      switch (node.typeId) {
        case '20003': //dom tiff
        case '20007': //dom 影像图幅文件
        case '20008': //dem tiff
        case '20009': //dem 影像图幅文件
          this.publishType = 2;
          this.serviceTypes = [{ key: 'WMTS', value: '5' }];
          break;
        case '20002': //地名地址
        case '20016': //地名地址csvzip
          this.publishType = 3;
          this.serviceTypes = [
            { key: 'WMS', value: '12' },
            { key: 'WFS', value: '6' },
            { key: 'WFS-G', value: '20' },
          ];
          break;
        default:
          this.publishType = 1;
          this.serviceTypes = [{ key: 'WMS', value: '12' }, { key: 'WFS', value: '6' }];
          break;
      }
      this.publishForm.serviceType = this.serviceTypes.map(p => p.value);
    },
    //切片选择改变
    vectorChange(val) {
      if (val) {
        this.serviceTypes = [{ key: 'WMTS', value: '5' }, { key: 'WFS', value: '6' }];
      } else {
        this.serviceTypes = [{ key: 'WMS', value: '12' }, { key: 'WFS', value: '6' }];
      }
      this.publishForm.serviceType = this.serviceTypes.map(p => p.value);
    },
    //获取字段信息
    getFields() {
      if (this.resourceInfo.schema) {
        let fields = this.resourceInfo.schema.map(p => p.name);
        this.fieldsInfo = filterSchema(fields);
      }
    },
    //校验表单
    validateData() {
      if (!this.publishForm.title.trim()) {
        this.$Message.error('请输入服务标题');
        return false;
      }
      if (this.publishForm.title.trim().length > 64) {
        this.$Message.error('服务标题不能超过64个字符长度！');
        return false;
      }
      if (!this.publishForm.crs.trim()) {
        this.$Message.error('请选择空间参考');
        return false;
      }
      if (!this.publishForm.name.trim()) {
        this.$Message.error('请选择服务名称');
        return false;
      }
      if (this.publishForm.name.trim().length > 64) {
        this.$Message.error('服务名称不能超过64个字符长度！');
        return false;
      }
      //切片服务
      if (this.publishForm.isVectorTile) {
        if (this.publishForm.minCacheLevel >= this.publishForm.maxCacheLevel) {
          this.$Message.info('最大切片等级不能小于最小切片等级');
          return false;
        }
      }
      //影像服务
      if (this.publishType == 2) {
        if (this.publishForm.minLevel >= this.publishForm.maxLevel) {
          this.$Message.info('最大分层等级不能小于最小分层等级');
          return false;
        }
      }
      //地名地址服务
      if (this.publishType == 3) {
        if (!this.publishForm.nameField) {
          this.$Message.info('请选择名称字段');
          return false;
        }
        if (!this.publishForm.typeField) {
          this.$Message.info('请选择类型字段');
          return false;
        }
      }
      return true;
    },
    // 点击发布按钮，发布服务，并将axios对象添加到任务队列
    async publish() {
      if (!this.validateData()) return;
      this.publishLoading = true;
      let params = {
        catalogId: this.node.catalogId,
        resourceId: this.node.resourceId,
        userId: this.$appUser.id,
        userName: this.$appUser.name,
        orgId: this.$appUser.orgid,
        orgName: this.$appUser.orgname,
        limits: 1,
        crs: this.publishForm.crs,
        serviceType: this.publishForm.serviceType.join(','),
        name: this.publishForm.name.trim(),
        title: this.publishForm.title.trim(),
        styles: this.publishForm.styles,
      };
      //切片服务
      if (this.publishForm.isVectorTile) {
        params.isVectorTile = this.publishForm.isVectorTile;
        params.maxLevel = this.publishForm.maxCacheLevel;
        params.levelNum = this.publishForm.maxCacheLevel - this.publishForm.minCacheLevel + 1;
      }
      //影像服务
      if (this.publishType == 2) {
        params.inputTransparentColor = this.publishForm.inputTransparentColor;
        params.outputTransparentColor = this.publishForm.outputTransparentColor;
        params.levelNum = this.publishForm.maxLevel - this.publishForm.minLevel + 1;
        params.maxLevel = this.publishForm.maxLevel;
        params.rasterPlotPlan = this.publishForm.rasterPlotPlan;
        params.rasterRplotType = this.publishForm.rasterRplotType;
      }
      //地名地址服务
      if (this.publishType == 3) {
        params.nameField = this.publishForm.nameField;
        params.typeField = this.publishForm.typeField;
      }
      if (this.publishForm.isVectorTile) {
        this.publicCacheService(params);
      } else {
        this.publicService(params);
      }
    },
    //发布矢量影像服务(非缓存)
    publicService(params) {
      api.db
        .publishService(params)
        .then(p => {
          this.publishLoading = false;
          this.$Message.success('服务发布成功！');
          // 刷新当前页面
          const currentNode = this.$store.state.app.currentDirectory;
          this.$store.dispatch(types.APP_NODES_FETCH, currentNode);
          // 关闭modal窗口
          this.visibleChange(false);
        })
        .catch(p => {
          this.publishLoading = false;
        });
    },
    //发布缓存服务
    publicCacheService(params) {
      api.db
        .publishServiceByTask(params)
        .then(p => {
          this.publishLoading = false;
          this.addPollTask(p.data);
          this.visibleChange(false);
        })
        .catch(p => {
          this.publishLoading = false;
          this.$Message.error('服务发布失败！');
        });
    },
    //新增轮询任务
    addPollTask(taskId) {
      let task = {
        taskId,
        method: 'getServiceByTask',
        callback: 'parseCacheTask',
        taskType: TASK_TYPE,
        taskName: this.node.name,
        taskTime: date.format(new Date(), 'YYYY-M-D HH:mm'),
      };
      this.$store.commit(types.ADD_POLL_TASK, task);
      this.$Notice.info({
        title: `${this.node.name}任务已提交`,
        desc: `生成矢量切片任务已进入后台队列，可在任务列表中查看进度！`,
      });
    },
    //缓存切片任务完成
    completePollTask(data) {
      if (data.taskType == TASK_TYPE) {
        // 刷新当前页面
        this.$nextTick(p => {
          const currentNode = this.$store.state.app.currentDirectory;
          this.$store.dispatch(types.APP_NODES_FETCH, currentNode);
        });
      }
    },
    // 处理服务名称
    async handleServiceName(name) {
      if (/[\u4e00-\u9fa5]/.test(name)) {
        const response = await api.db.findChar(name);
        name = response.data;
      }
      if (!/^[a-zA-Z]/.test(name)) {
        name = `s${name}`;
      }
      return name;
    },
    // crs远程查询
    async remoteMethod(query) {
      this.crsLoading = true;
      const response = await api.db.findSrs({
        objCondition: {
          authSrId: query, // 坐标系统id
        },
        pageIndex: 1, // 分页索引
        pageSize: 10, // 分页大小
      });
      this.$nextTick(() => {
        this.crsOptions = response.data.dataSource;
        this.crsLoading = false;
      });
    },
    //文件上传
    getUploadFile(file) {
      let isValid = true;
      let fileName = file.name.match(/(.*)\.sld$/)[1];
      if (fileName.length > 64) {
        this.$Message.error('样式名称不能超过64字符！');
        isValid = false;
      }
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(fileName)) {
        this.$Message.error('样式名称可以是字母、数字、下划线，必须以字母开头！');
        isValid = false;
      }
      if (isValid) {
        this.styleUpload(file);
        this.$refs.upload.clearFiles();
        return false;
      } else {
        this.$refs.upload.clearFiles();
        return true;
      }
    },
    // 样式文件临时上传
    async styleUpload(file) {
      const alias = file.name.match(/(.*)\.sld$/)[1];
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'data',
        JSON.stringify({
          name: alias,
          alias,
          description: '',
          classify: '',
          typeId: '20102',
          TypeName: 'sld',
          catalogId: this.current.childId,
          userId: this.$appUser.id,
          userName: this.$appUser.name,
          orgId: this.$appUser.orgid,
          orgName: this.$appUser.orgname,
        })
      );
      const response = await api.db.addStyle({}, formData);
      if (response.data.message) {
        this.$Message.error(`上传样式失败，${response.data.message}`);
        return;
      }
      this.$Message.success('样式上传成功！');
      await this.getStyle(this.node);
      const style = this.styleOptions.find(item => item.id === response.data);
      if (style) {
        this.publishForm.styles = style.id;
      } else {
        this.$Message.warning('样式类别与资源类别不一致');
      }
    },
  },
};
</script>

<template>
  <Modal
    :value="value"
    :mask-closable="false"
    class="publish-modal"
    title="服务发布"
    @on-visible-change="visibleChange">
    <div slot="footer">
      <Button
        type="primary"
        size="large"
        long
        @click="publish">发布</Button>
    </div>
    <Form
      ref="form"
      :model="publishForm"
      :label-width="80">
      <FormItem
        label="服务标题：">
        <Input v-model="publishForm.title"></Input>
      </FormItem>
      <FormItem
        label="空间参考：">
        <Select
          v-model="publishForm.crs"
          :remote-method="remoteMethod"
          :loading="crsLoading"
          filterable
          remote>
          <Option
            v-for="option in crsOptions"
            :label="`${option.authName}:${option.authSrId}`"
            :value="option.authSrId"
            :key="option.id">
            <span class="crs-name">{{ `${option.authName}:${option.authSrId}` }}</span>
            <span class="crs-info">{{ option.srName }}</span>
          </Option>
        </Select>
      </FormItem>
      <FormItem
        label="渲染样式：">
        <Select
          v-model="publishForm.styles"
          filterable>
          <Option
            v-for="option in styleOptions"
            :label="option.alias"
            :value="option.id"
            :key="option.id">
            <span class="style-name">{{ option.alias }}</span>
            <span class="style-info">{{ new Date(option.updateTime).toLocaleDateString() }}</span>
          </Option>
        </Select>
        <Upload
          ref="upload"
          :before-upload="getUploadFile"
          :show-upload-list="false"
          accept=".sld"
          action="#">
          <SvgIcon
            icon-class="upload"
            size="18"
            color="#318CF0">
          </SvgIcon>
        </Upload>
      </FormItem>
      <FormItem
        v-show="publishType==3"
        label="名称字段：">
        <Select
          v-model="publishForm.nameField">
          <Option
            v-for="(item,index) in fieldsInfo"
            :label="item"
            :value="item"
            :key="index">
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-show="publishType==3"
        label="类型字段：">
        <Select
          v-model="publishForm.typeField">
          <Option
            v-for="(item,index) in fieldsInfo"
            :label="item"
            :value="item"
            :key="index">
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-show="publishType==1"
        label="矢量切片：">
        <Checkbox
          v-model="publishForm.isVectorTile"
          @on-change="vectorChange">是否切片</Checkbox>
      </FormItem>
      <FormItem
        v-show="publishType==1&&publishForm.isVectorTile"
        label="切片级别：">
        <label>最小</label>
        <Select
          v-model="publishForm.minCacheLevel"
          class="inline-item">
          <Option
            v-for="(item,index) in levels"
            :label="item"
            :value="item"
            :key="index">
            {{ item }}
          </Option>
        </Select>
        <label>最大</label>
        <Select
          v-model="publishForm.maxCacheLevel"
          class="inline-item">
          <Option
            v-for="(item,index) in levels"
            :label="item"
            :value="item"
            :key="index">
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务名称：">
        <Input v-model="publishForm.name"></Input>
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务类型：">
        <CheckboxGroup v-model="publishForm.serviceType">
          <Checkbox
            v-for="item in serviceTypes"
            :label="item.value"
            :key="item.key"
            disabled>{{ item.key }}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem
        v-show="showMore&&publishType==2"
        label="分层级别：">
        <label>最小</label>
        <Select
          v-model="publishForm.minLevel"
          class="inline-item">
          <Option
            v-for="(item,index) in levels"
            :label="item"
            :value="item"
            :key="index">
            {{ item }}
          </Option>
        </Select>
        <label>最大</label>
        <Select
          v-model="publishForm.maxLevel"
          class="inline-item">
          <Option
            v-for="(item,index) in levels"
            :label="item"
            :value="item"
            :key="index">
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-show="showMore&&publishType==2"
        label="裁剪方式：">
        <Select
          v-model="publishForm.rasterRplotType">
          <Option
            v-for="(item,index) in plotTypes"
            :label="item"
            :value="item"
            :key="index">
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-show="showMore&&publishType==2"
        label="裁剪方案：">
        <Select
          v-model="publishForm.rasterPlotPlan">
          <Option
            v-for="(item,index) in plotPlans"
            :label="item"
            :value="item"
            :key="index">
            {{ item }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-show="showMore&&publishType==2"
        label="透明色：">
        <label>输入</label>
        <Input
          v-model="publishForm.inputTransparentColor"
          class="inline-item"></Input>
        <label>输出</label>
        <Input
          v-model="publishForm.outputTransparentColor"
          class="inline-item"></Input>
      </FormItem>
      <FormItem
        v-show="showMore"
        label="服务描述：">
        <Input
          v-model="publishForm.description"
          :autosize="{minRows: 2,maxRows: 5}"
          type="textarea"
          placeholder="请输入服务描述信息..."></Input>
      </FormItem>
    </Form>
    <!-- 控制是否显示服务发布详细信息 -->
    <div
      class="show-more"
      @click="showMore = !showMore">
      <Icon :type="showMore ? 'chevron-up' : 'chevron-down'"></Icon>
    </div>
    <Spin
      v-if="publishLoading"
      fix>
      <Icon
        type="load-c"
        size="18"
        class="circle-spin-icon-load"></Icon>
    <div>正在发布服务...</div></Spin>
  </Modal>
</template>

<style lang="less" scoped>
.k-form-item {
  margin-bottom: 15px;
  /deep/ &-content {
    display: flex;
    .k-svgicon {
      padding: 2px 10px 0 10px;
      cursor: pointer;
    }
  }
}

.crs-info,
.style-info {
  float: right;
  color: #bbbec4;
}

.show-more {
  height: 16px;
  margin-bottom: -16px;
  text-align: center;
  .k-icon {
    transition: all 0.3s;
    &:hover {
      cursor: pointer;
      transform: scale(1.5);
    }
  }
}

.inline-item {
  width: 160px;
  margin: 0 10px;
}

.publish-modal {
  /deep/ .k-modal {
    top: 70px;
  }
}
</style>
