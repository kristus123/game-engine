export class FirstChat {
	constructor(position, mouse) {

		const p = position.copy()
		p.width = 700
		p.height = 100

		this.dialogue = new Dialogue("Hope you are ready to clean some piss boy'", [
			{
				key: "yes", 
				keypress: "1", 
				text:"Yes, I really look forward to it Sir!",
				next: new Dialogue("That's the spirit. Make our nation clean and proud", [
					{
						key: "yes", 
						keypress: "1", text:"YES SIR!!!!!!!!", 
						next: new Dialogue("yaaaaargh", [
							{key: "yes", keypress: "1", text:"Easier said than done"},
						], p, mouse)
					},
				], p, mouse),
			},
			{
				key: "no", 
				keypress: "2", 
				text:"Well, it wasn't my first choice of education exactly...",
				next: new Dialogue("Well, you should have studied harder", [
					{
						key: "yes", 
						keypress: "1", 
						text:"i know...", 
						next: new Dialogue("Go out and START CLEANING BOY'", [], p, mouse)
					},
				], p, mouse)
			},
		], p, mouse)
	}

	update() {
	}

	draw(ctx) {
		const next = this.dialogue.draw(ctx)

		if (next) {
			next.draw(ctx)
		}
	}
}
