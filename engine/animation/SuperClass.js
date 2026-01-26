export class SuperClass {
  constructor() {
    const proto = Object.getPrototypeOf(this)
    for (const k of Object.getOwnPropertyNames(proto)) {
      const v = this[k]
      if (typeof v === "function") this[k] = v.bind(this)
    }
  }

  static _autoBindStatics() {
    if (this.hasOwnProperty("__bound")) return
    for (const k of Object.getOwnPropertyNames(this)) {
      const v = this[k]
      if (typeof v === "function") this[k] = v.bind(this)
    }
    this.__bound = true
  }

  static {
    this._autoBindStatics()
  }
}

