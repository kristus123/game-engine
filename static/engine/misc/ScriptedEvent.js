export class ScriptedEvent {
	constructor(step) {
		this.step = step

	}

	update() {

	}

	draw(ctx) {
		this.step(ctx)
	}

}
