import Vue from 'vue';
import { filterSchema2 } from '@/utils/helps';
import { Form, FormItem, Input, InputNumber, Button } from '@ktw/kcore';

/**
 * 表单编辑器
 */
class FormEditor {
  /**
   * 获取新增数据表单
   * @param {any} schemas 图层schema
   * @param {any} opts 设置选项
   */
  static createAddForm(schemas, opts) {
    let model = {};
    let editSchemas = filterSchema2(schemas);
    editSchemas.forEach(p => {
      model[p.name] = this.defaultSettings(p);
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
          let editor = '';
          let field = model[key];
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
                  type="ghost"
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
  static createEditForm(schemas, data, opts) {}

  /**
   * 获取字段默认设置
   * @param {any} schema 字段schema
   */
  static defaultSettings(schema) {
    let settings = {
      inputType: 'Input',
      value: null,
    };
    switch (schema.type.toUpperCase()) {
      case 'LONG':
      case 'DOUBLE':
        settings.inputType = 'InputNumber';
        settings.value = 0;
        break;
      case 'STRING':
        settings.value = '';
        break;
      default:
        break;
    }
    return settings;
  }
}

export default FormEditor;
