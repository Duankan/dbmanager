class FunManager {
  setQueryOptions(options) {
    this._queryOptions = options;
  }
  getQueryOptions(options) {
    if (this._queryOptions) {
      return this._queryOptions;
    } else {
      return [];
    }
  }
}
export default new FunManager();
