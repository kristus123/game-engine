export class NewMicListener {

  static listener = this.createListener()

  static onConnect(callback) {
    this.listener.onConnect(callback)
  }

  static onDisconnect(callback) {
    this.listener.onDisconnect(callback)
  }

  static async init() {
    if (!MicPermission.granted) {
      throw new Error("x")
    }

    await this.listener.init()
  }

  static createListener() {
    return new NewDeviceListener(async () => AllMics.get())
  }

}