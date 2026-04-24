// observers/EventEmitter.js
// Observer Pattern Implementation

class EventSystem {
  constructor() {
    this.listeners = {};
  }

  subscribe(event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  unsubscribe(event, listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  notify(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => listener(data));
  }
}

// Singleton event system
const eventSystem = new EventSystem();

module.exports = eventSystem;
