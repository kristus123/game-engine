export class Listener {
  constructor() {
    this.callbacks = []
  }

  register(cb) {
    this.callbacks.push(cb)
  }

  run(value) {
    for (const c of this.callbacks) {
      c(value)
    }
  }
}

