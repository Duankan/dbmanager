<script>
import config from 'config';
import { validateName } from '@/utils/validate';
const resourceType = [
  {
    value: 'sld',
    label: 'sld',
  },
];
export default {
  name: 'AddStyle',
  props: {
    classify: {
      type: Array,
      default: () => [],
    },
    isComputedStyle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 表单数据
      styleCondition: {
        name: '',
        TypeName: 'sld',
        classify: ' ',
        description: '',
      },
      // 表单验证
      ruleValidate: {
        name: [
          {
            required: false,
            validator: validateName,
            nullable: true,
            trigger: 'change',
          },
          { type: 'string', max: 64, message: '名称不能超过64字符', trigger: 'change' },
        ],
        TypeName: [{ required: true, message: '选择资源类型！', trigger: 'change' }],
        classify: [{ required: true, message: '选择样式类型！', trigger: 'change' }],
      },
      resourceType,
      fileID: '',
      uploadFile: [],
      upLoadList: [],
      action: `${config.project.baseUrl}/resource/resource/addstyle`,
      isUpload: false,
      isUploadSuccess: false,
      setUploadTitle: '样式文件上传成功',
      errorData: [],
    };
  },
  computed: {
    styleClassify() {
      const classify = this.classify.filter(item => item.label !== '其他类型');
      return classify;
    },
    current() {
      return this.$store.state.app.currentDirectory;
    },
    getFileData() {
      if (this.upLoadList.length === 0 && this.uploadFile.length !== 0) {
        return this.uploadFile;
      } else {
        return this.upLoadList;
      }
    },
  },
  watch: {
    styleCondition: {
      handler() {
        this.uploadFile.forEach(item => {
          if (item.keyID === this.fileID) {
            item.fileOptions = this.setParams();
          }
        });
      },
      deep: true,
    },
    isComputedStyle(newVal) {
      if (!newVal) {
        this.styleCondition = {
          name: '',
          TypeName: 'sld',
          classify: ' ',
          description: '',
        };
      }
    },
  },
  mounted() {
    this.upLoadList = this.$refs.upload.fileList;
  },
  methods: {
    // 文件上传前
    beforeUpload(file) {
      let keyID = Math.random()
        .toString()
        .substr(2);
      file['keyID'] = keyID;
      file['class'] = 'default';
      file['fileOptions'] = this.setParams(); // 保存文件信息
      this.uploadFile.push(file); // 所有上传文件展示信息
      this.firstLoad();
      return false;
    },
    //上传前校验
    doUpload() {
      this.$refs.addstyle.validate(valid => {
        if (valid) {
          this.upload();
        } else {
          this.$Message.error('输入校验不通过，请更正！');
        }
      });
    },
    // 样式文件上传
    upload() {
      this.errorData = [];
      if (this.uploadFile.length !== 0) {
        if (this.$refs['addstyle']) this.$refs['addstyle'].resetFields();
        this.isUpload = true;
        for (let i = 0; i < this.uploadFile.length; i++) {
          let item = this.uploadFile[i];
          if (item.fileOptions.name === '') {
            const name = item.name.split('.')[0];
            item.fileOptions.name = item.fileOptions.alias = name;
          }
          this.$refs.upload.post(item, { data: JSON.stringify(item.fileOptions) });
        }
      }
    },
    // 设置参数
    setParams() {
      const styleParams = {
        alias: this.styleCondition.name,
        ...this.styleCondition,
        typeId: '20102',
        catalogId: this.current.childId,
        userId: this.$appUser.id,
        userName: this.$appUser.name,
        orgId: this.$appUser.orgid,
        orgName: this.$appUser.orgname,
      };
      return styleParams;
    },
    // 更新表单数据
    setFileData(file) {
      for (let item in this.styleCondition) {
        this.styleCondition[item] = file[item];
      }
    },
    // 上传成功
    handleSuccess(res, file) {
      this.num = 0;
      if ((this.num = this.uploadFile.length)) {
        this.isUploadSuccess = true;
      }
      if (res.statusCode === 200) {
        this.$Message.success(`文件${file.name}上传成功!`);
      } else {
        this.setUploadTitle = '样式文件上传失败';
        this.errorData.push({
          name: file.name,
          message: res.message,
        });
        this.$Message.error({
          render: h => {
            return (
              <div>
                <p>{`文件${file.name}上传失败!`}</p>
                <p>{`失败原因：${res.message}`}</p>
              </div>
            );
          },
        });
      }
      this.num++;
    },
    // 移除上传文件
    handleRemove(fileData) {
      this.uploadFile = this.uploadFile.filter(item => item.keyID != fileData.keyID);
      if (this.uploadFile.length !== 0) this.handleEdit(this.uploadFile[0].keyID);
    },
    //手动切换编辑
    doHandleEdit(keyID) {
      if (this.fileID == keyID) return;
      this.$refs.addstyle.validate(valid => {
        if (valid) {
          this.handleEdit(keyID);
        } else {
          this.$Message.error('输入校验不通过，请更正！');
        }
      });
    },
    // 编辑上传文件信息
    async handleEdit(keyID) {
      this.fileID = keyID;
      let data = [];
      this.uploadFile.forEach(item => {
        if (item.keyID === keyID) {
          item.class = 'active';
          data = item;
        } else {
          item.class = 'default';
        }
      });
      this.uploadFile = [...this.uploadFile];
      this.setFileData(data.fileOptions);
    },
    // 重置
    handleReset() {
      if (this.$refs['addstyle']) this.$refs['addstyle'].resetFields();
      this.uploadFile = [];
      this.upLoadList = [];
    },
    // 继续上传
    continueUpload() {
      this.isUploadSuccess = false;
      this.uploadFile = this.uploadFile.filter(item => {
        const isFalse = this.upLoadList.filter(
          list => item.name === list.name && list.response.statusCode !== 200
        );
        if (isFalse.length !== 0) {
          return true;
        } else {
          return false;
        }
      });
      if (this.uploadFile.length !== 0) {
        this.firstLoad();
      }
      this.upLoadList = this.$refs.upload.fileList = [];
      this.isUpload = false;
    },
    // 退出上传
    closeUpload() {
      this.handleReset();
      this.isUploadSuccess = false;
      this.isUpload = false;
      this.upLoadList = this.$refs.upload.fileList = [];
      this.$emit('on-close-style', false);
    },
    // 初始化处理
    firstLoad() {
      this.uploadFile[0].class = 'active';
      this.fileID = this.uploadFile[0].keyID;
      this.setFileData(this.uploadFile[0].fileOptions);
    },
  },
};
</script>

<template>
  <div class="db-add-style">
    <div>
      <Upload
        ref="upload"
        :before-upload="beforeUpload"
        :action="action"
        :on-success="handleSuccess"
        :show-upload-list="false"
        accept=".sld"
        multiple
        type="drag">
        <div class="style-upload">
          <SvgIcon
            icon-class="upload"
            size="52"
            color="#318CF0">
          </SvgIcon>
          <p>点击或拖拽上传样式文件，可上传一个或多个文件</p>
        </div>
      </Upload>
      <div
        v-for="(item,index) in getFileData"
        :key="index"
        :class="item.class"
        class="upload-list">
        {{ item.name }}
        <template v-if="!isUpload">
          <div class="upload-list-cover">
            <Icon
              type="edit"
              size="16"
              @click.native="doHandleEdit(item.keyID)"></Icon>
            <Icon
              type="ios-trash-outline"
              size="16"
              @click.native="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-if="item.status !== 'finished'">
          <Progress
            v-if="item.showProgress"
            :percent="item.percentage"
            hide-info>
          </Progress>
        </template>
      </div>
    </div>
    <Form
      v-if="!isUpload && uploadFile.length!==0"
      ref="addstyle"
      :model="styleCondition"
      :rules="ruleValidate"
      :label-width="90">
      <FormItem
        label="样式名称："
        prop="name">
        <Input
          v-model="styleCondition.name"
          placeholder="可以不填，默认为文件名称"
          clearable
        ></Input>
      </FormItem>
      <FormItem
        label="资源类型："
        prop="TypeName">
        <Select
          v-model="styleCondition.TypeName"
          transfer>
          <Option
            v-for="(item,index) in resourceType"
            :value="item.value"
            :key="index">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem
        label="样式分类："
        prop="classify">
        <Select
          v-model="styleCondition.classify"
          transfer>
          <Option
            v-for="item in styleClassify"
            :value="item.value"
            :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem
        label="描述："
        prop="desc">
        <Input
          v-model="styleCondition.description"
          :autosize="{ minRows: 2, maxRows: 5 }"
          type="textarea"
          placeholder="请输入描述"
          maxlength="256"></Input>
      </FormItem>
    </Form>
    <div
      class="style-button">
      <Button
        :disabled="isUpload"
        type="primary"
        long
        @click="doUpload">确定
      </Button>
      <Button
        :disabled="isUpload"
        type="ghost"
        long
        @click="handleReset">重置
      </Button>
    </div>
    <Modal
      v-model="isUploadSuccess"
      :title="setUploadTitle"
      ok-text= "返回继续上传"
      cancel-text= "关闭"
      @on-ok="continueUpload"
      @on-cancel="closeUpload">
      <div
        v-for="(item, index) in errorData"
        :key="index"
        class="upload-err">
        <span> <span>{{ item.name }}</span>上传失败：</span>
        <span>{{ item.message }}</span>
      </div>
      <p>是否继续上传样式文件？</p>
    </Modal>
  </div>
</template>

<style lang="less" scoped>
.db-add-style {
  .k-form {
    margin-top: 5px;
  }
  /deep/.k-form-item {
    margin-bottom: 20px;
  }
  .style-upload {
    padding: 20px 0;
  }

  .style-upload {
    padding: 3px;
    margin-right: 5px;
    cursor: pointer;
  }

  .k-upload {
    margin-bottom: 10px;
  }
  .style-button {
    text-align: right;

    .k-btn {
      margin-bottom: 10px;
    }
  }

  & span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  & span:hover {
    color: #318cf0;
    cursor: pointer;
  }

  p:last-child {
    color: #ccc;
  }

  .upload-list {
    display: inline-block;
    padding: 0 5px;
    min-width: 60px;
    width: auto;
    height: 35px;
    text-align: center;
    line-height: 35px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #efefef;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }

  .default {
    border: 1px solid transparent;
  }
  .active {
    border: 1px dashed #318cf0;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .upload-list:hover .upload-list-cover {
    display: block;
  }
  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .k-progress {
    position: absolute;
    top: 12px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

/deep/.k-modal-wrap,
/deep/.k-modal-mask {
  z-index: 1003;
}

.upload-err {
  height: 20px;
  line-height: 20px;
  margin-bottom: 10px;
  font-size: 12px;

  :first-child {
    span {
      margin-right: 2px;
      margin-left: 2px;
      color: #e20000;
    }
  }

  :last-child {
    color: #e20000;
  }
}
</style>
