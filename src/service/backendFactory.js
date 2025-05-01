import BackendlessService from './backendlessService';
export default class BackendFactory {
  static getInstance() {
    if (!BackendFactory.instance) {
      BackendFactory.instance = new BackendlessService();
    }
    return BackendFactory.instance;
  }
}
