export class ThirdChat {
	constructor(position, mouse) {

		const p = position.copy()
		p.width = 700
		p.height = 100

		this.dialogue = new Dialogue(Conversation('Good job you have deliver the load!', [
			Reply('What do i do now?', Conversation('Take some rest', [])),
		]), p, mouse)
	}

	update() { }

	draw(draw, guiDraw) {
		this.dialogue.draw(draw, guiDraw)
	}
}
