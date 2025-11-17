import { fork } from "child_process"

export class Runner {
  constructor(script) {
    this.script = script
    this.child = null
  }

  start() {
    if (this.child) return
    this.child = fork(this.script)
    this.child.on("exit", () => this.child = null)
  }

  stop() {
    if (!this.child) return
    this.child.kill()
    this.child = null
  }

  restart() {
    this.stop()
    this.start()
  }
}
