export class FirstChat {
	constructor(position, mouse) {

		const p = position.copy()
		p.width = 700
		p.height = 100

		this.dialogue = new Dialogue("Hope you are ready to clean some piss boy'", [
			{
				key: "yes", 
				keypress: "1", 
				text:"Yes. I really look forward to it Sir",
			},
			{
				key: "no", 
				keypress: "2", 
				text:"Well, it wasn't my first choice of education exactly...",
			},
		], p, mouse)

		this.yes = new Dialogue("That's the spirit. Make our nation clean and proud", [
					{key: "yes", keypress: "1", text:"YES SIR!!!!!!!!"},
				], p, mouse)

		this.no = new Dialogue("Then people shouldn't piss so much in space", [
					{key: "yes", keypress: "1", text:"Easier said than done"},
				], p, mouse)
	}

	update() {
	}

	draw(ctx) {
		if (this.dialogue.yes) {
			this.yes.draw(ctx)
		}
		else if (this.dialogue.no) {
			this.no.draw(ctx)
		}
		else {
			this.dialogue.draw(ctx)
		}
	}
	
}
