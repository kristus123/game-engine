export class KeyboardEvents {
  constructor() {
    this.keyDownHandlers = {};
    this.keyUpHandlers = {};

    // Attach a global keydown event listener
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Attach a global keyup event listener
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  addKeyDownListener(key, execute) {
    this.keyDownHandlers[key] = execute;
  }

  addKeyUpListener(key, execute) {
    this.keyUpHandlers[key] = execute;
  }

  handleKeyDown(event) {
    const key = event.key;
    if (this.keyDownHandlers[key]) {
      this.keyDownHandlers[key]();
    }
  }

  handleKeyUp(event) {
    const key = event.key;
    if (this.keyUpHandlers[key]) {
      this.keyUpHandlers[key]();
    }
  }
}
