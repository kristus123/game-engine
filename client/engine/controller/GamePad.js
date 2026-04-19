export class GamePad {
  static index = 0;
  static gamepad = null;
  static buttons = [];
  static axes = [];
  static connected = false;

  static {
    window.addEventListener("gamepadconnected", (e) => {
		console.log(e.gamepad.index)
      console.log("Gamepad connected:", e.gamepad);
      if (e.gamepad.index === this.index) {
        this.connected = true;
      }
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      console.log("Gamepad disconnected:", e.gamepad);
      if (e.gamepad.index === this.index) {
        this.connected = false;
        this.gamepad = null;
        this.buttons = [];
        this.axes = [];
      }
    });
  }

  static setIndex(i) {
    this.index = i;
  }

  static update() {
    const pads = navigator.getGamepads();
    const gp = pads[this.index];

    if (!gp) {
      this.gamepad = null;
      return false;
    }

    this.gamepad = gp;
    this.connected = true;

    this.buttons = gp.buttons.map(b => b.pressed);
    this.axes = gp.axes.slice();

    return true;
  }

  static isPressed(buttonIndex) {
    return !!this.buttons[buttonIndex];
  }

  static getAxis(axisIndex) {
    return this.axes[axisIndex] || 0;
  }

  static leftStick() {
    return {
      x: this.getAxis(0),
      y: this.getAxis(1)
    };
  }

  static rightStick() {
    return {
      x: this.getAxis(2),
      y: this.getAxis(3)
    };
  }
}
