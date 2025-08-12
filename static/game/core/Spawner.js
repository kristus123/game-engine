export class Spawner {
  constructor(create, interval, add) {
    this.create = create;                 
    this.interval = interval || 2000;    
    this.add = add || ((e) => tla(e));   
    this.timer = null;
    this.spawned = [];
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      const entity = this.create();
      if (entity) {
        this.add(entity);
        this.spawned.push(entity);
      }
    }, this.interval);
  }

  stop() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
  }

  setIntervalTime(ms) {
    this.interval = ms;
    if (this.timer) { this.stop(); this.start(); }
  }

  dispose() {
    this.stop();
    this.spawned.length = 0;
  }
}
