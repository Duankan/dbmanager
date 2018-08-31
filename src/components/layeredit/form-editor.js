import Vue from 'vue';
import { Form, FormItem, Input, InputNumber, Button } from '@ktw/kcore';

/**
 * 表单编辑器
 */
class FormEditor {
  /**
   * Schema保留字段
   */
  static ReservedFileds = ['the_geom', 'geom', 'gid', 'x1', 'y1', 'x2', 'y2', 'bbox'];

  /**
   * 获取新增数据表单
   * @param {any} schemas 图层schema
   * @param {any} opts 设置选项
   */
  static createAddForm(schemas, opts) {
    let model = {};
    schemas.forEach(p => {
      model[p.name] = this.setValue(p, null);
    });
    let onEvent = (eventName, args) => {
      if (opts.onEvent) {
        opts.onEvent(eventName, args);
      }
    };
    let vm = new Vue({
      render: h => {
        let formItems = [];
        for (let key in model) {
          let field = model[key];
          if (!field.editable) continue;
          let editor = '';
          if (field.inputType == 'InputNumber') {
            editor = (
              <InputNumber
                value={field.value}
                onOn-change={e => {
                  field.value = e;
                }}
                size="small"
              />
            );
          } else {
            editor = (
              <Input
                value={field.value}
                onOn-change={e => {
                  field.value = e.target.value;
                }}
                size="small"
              />
            );
          }
          let item = <FormItem label={key}>{editor}</FormItem>;
          formItems.push(item);
        }
        return (
          <div class="form-editor-wrapper">
            <div class="form-editor-header">新增图形</div>
            <Form model={model} ref="formEditor" label-position="left" label-width={80} inline>
              {formItems}
              <FormItem class="form-editor-buttons">
                <Button
                  type="primary"
                  onClick={e => {
                    onEvent('save', model);
                  }}
                >
                  保存
                </Button>
                <Button
                  type="error"
                  onClick={e => {
                    onEvent('reset', model);
                  }}
                >
                  删除
                </Button>
              </FormItem>
            </Form>
          </div>
        );
      },
    });
    vm.$mount();
    return {
      instance: vm,
      el: vm.$el,
      model: vm.$refs.formEditor.model,
      remove: () => {
        vm.$el.remove();
        vm.$destroy();
      },
    };
  }

  /**
   * 获取编辑数据表单
   * @param {any} schemas 图层schema
   * @param {any} data 表单绑定数据
   * @param {any} opts 设置选项
   */
  static createEditForm(schemas, data, opts) {
    let model = {};
    Object.keys(data).forEach(p => {
      let schema = schemas.find(m => m.name == p);
      model[p] = this.setValue(schema, data[p]);
    });
    let onEvent = (eventName, args) => {
      if (opts.onEvent) {
        opts.onEvent(eventName, args);
      }
    };
    let vm = new Vue({
      render: h => {
        let formItems = [];
        for (let key in model) {
          if (key.toLowerCase() == 'bbox') continue;
          let field = model[key];
          let editor = '';
          if (field.inputType == 'InputNumber') {
            editor = (
              <InputNumber
                value={field.value}
                disabled={!field.editable}
                onOn-change={e => {
                  field.value = e;
                }}
                size="small"
              />
            );
          } else {
            editor = (
              <Input
                value={field.value}
                disabled={!field.editable}
                onOn-change={e => {
                  field.value = e.target.value;
                }}
                size="small"
              />
            );
          }
          let item = <FormItem label={key}>{editor}</FormItem>;
          formItems.push(item);
        }
        return (
          <div class="form-editor-wrapper">
            <div class="form-editor-header">编辑图形</div>
            <Form model={model} ref="formEditor" label-position="left" label-width={80} inline>
              {formItems}
              <FormItem class="form-editor-buttons">
                <Button
                  type="primary"
                  onClick={e => {
                    onEvent('save', model);
                  }}
                >
                  保存
                </Button>
                <Button
                  type="error"
                  onClick={e => {
                    onEvent('delete', model);
                  }}
                >
                  删除
                </Button>
              </FormItem>
            </Form>
          </div>
        );
      },
    });
    vm.$mount();
    return {
      instance: vm,
      el: vm.$el,
      model: vm.$refs.formEditor.model,
      remove: () => {
        vm.$el.remove();
        vm.$destroy();
      },
    };
  }

  /**
   * 获取字段默认设置
   * @param {any} schema 字段schema
   * @param {any} value 字段值
   */
  static setValue(schema, value) {
    schema = schema || { name: null, type: 'string' };
    let editable = schema.name && this.ReservedFileds.indexOf(schema.name.toLowerCase()) < 0;
    let field = {
      inputType: 'Input',
      editable,
      value: null,
    };
    switch (schema.type.toLowerCase()) {
      case 'long':
      case 'double':
        field.inputType = 'InputNumber';
        field.value = value || 0;
        break;
      case 'string':
        field.value = value || '';
        break;
      default:
        break;
    }
    return field;
  }
}

export default FormEditor;
