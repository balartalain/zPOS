const ServiceRegistry = {
  services: [],

  register(service) {
    this.services.push(service);
  },

  getServices() {
    return this.services;
  },
  get(name) {
    return this.services.find((s) => s.getName() === name);
  },
};
export default ServiceRegistry;
