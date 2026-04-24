class EventSystem {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(data) {
    this.observers.forEach(o => o.update(data));
  }
}

module.exports = new EventSystem();