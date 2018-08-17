import { geo2Wkt } from '@/utils/helps';

/**
 * 编辑实体
 */
class EditEntity {
  constructor() {
    //编辑属性
    this.property = null;
    //编辑图形
    this.geometry = null;
  }

  /**
   * 设置编辑实体
   * @param {Object} property 属性对象
   * @param {Object} geometry 图形对象
   */
  setEntity(property, geometry) {
    this.property = property;
    this.geometry = geometry;
  }

  /**
   * 设置属性
   * @param {Object} property 属性对象
   */
  setProperty(property) {
    this.property = property;
  }

  /**
   * 设置图形
   * @param {Object} geometry 图形对象
   */
  setGeometry(geometry) {
    this.geometry = geometry;
  }

  /**
   * 重置对象
   */
  reset() {
    this.property = null;
    this.geometry = null;
  }

  /**
   * 实体对象转换
   */
  convertEntity() {
    let wkt = null;
    if (this.geometry) {
      wkt = geo2Wkt(this.geometry);
    }
    let fields = {};
    if (this.property) {
      for (let key in this.property) {
        fields[key] = this.property[key].value;
      }
    }
    return { fields, wkt };
  }

  /**
   * 插入记录
   */
  async insert() {
    let entity = this.convertEntity();
    debugger;
  }

  /**
   * 更新记录
   */
  async update() {}

  /**
   * 删除记录
   */
  async delete() {}
}

export default EditEntity;
