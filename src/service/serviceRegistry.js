const ServiceRegistry = {
  services: [],

  register(service) {
    this.services.push(service);
  },

  getServices() {
    return this.services;
  },
};
export default ServiceRegistry;
