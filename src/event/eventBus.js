const eventName = {
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  SYNC_ORDER: 'SYNC_ORDER',
  // Events to trigger ui refresh
  CHANGED_PRODUCT: 'CHANGED_PRODUCT',
  CHANGED_CATEGORY: 'CHANGED_CATEGORY',
};
class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    const listener = this.listeners[event].find(
      (listener) => listener === callback
    );
    if (!listener) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
      );
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(data));
    }
  }
}

const eventBus = new EventBus();
export { eventBus, eventName };

/*Use:
  //Publishing Events:
   eventBus.emit('buttonClicked', { message: 'Button was clicked!' });
  //Subscribing to Events
  useEffect(() => {
    const handleButtonClick = (data) => {
      setMessage(data.message);
    };

    eventBus.on('buttonClicked', handleButtonClick);

    return () => {
      eventBus.off('buttonClicked', handleButtonClick);
    };
  }, []);
  */
