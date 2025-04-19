const ModelRegistry = {
  models: [],

  register(model) {
    this.models.push(model);
  },

  getModels() {
    return this.models;
  },
};
export default ModelRegistry;
