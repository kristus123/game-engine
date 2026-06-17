function _improvedStickValue(num) {
	const d = Math.round(num * 100) / 100

	const deadzone = 0.4
	return d.abs >= deadzone ? d : 0
}

let gpIndex = null;

export class Gp {
	static init() {

		window.addEventListener("gamepadconnected", (e) => {
		  gpIndex = e.gamepad.index;
		  console.log("Gamepad connected:", e.gamepad.id);
		});

		window.addEventListener("gamepaddisconnected", () => {
		  gpIndex = null;
		  console.log("Gamepad disconnected");
		});

	}

	static update() {
		  const gp = navigator.getGamepads()[gpIndex];

		  if (gp) {
			  const pressedButtons = gp.buttons
				.map((btn, i) => (btn.pressed ? PlaystationMapper(i) : null))
				.filter(v => v !== null);

			  console.clear();
			  console.log("Pressed buttons:", pressedButtons);

			  console.log("Axes:", gp.axes.map(a => a.toFixed(2)));
		  }
	}
}
