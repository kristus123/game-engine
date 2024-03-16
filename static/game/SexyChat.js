export class SexyChat {
	constructor(position, mouse) {
		const p = position.copy()
		p.width = 700
		p.height = 100


		const yes = {
			key: null,
			text: 'Yes. Who are you?',
			conversation: {
				question: 'I am Choopy-choo-choo-chan. Nice to meet you!', 
				replies: [
					{
						key: null,
						text: 'Don\'t worry', 
						conversation: {
							question:'Great. Now, get to work!', 
							replies: []
						}, 
					},
				],
			},
		}

		const no = {
			key: null,
			text: 'No. I am a lone wolf',
			conversation: {
				question: 'Aaw. I would hope we could become more than strangers. CHOO-CHOO hihi', 
				replies: [
					{
						key: null,
						text: 'Don\'t worry', 
						conversation: {
							question:'Great. Now, get to work!', 
							replies: []
						}, 
					},
				],
			},
		}

		this.dialogue = new Dialogue({
			question: 'Hello there. you might be wondering who i am', 
			replies: [
				yes, 
				no,
			]
		}, p, mouse)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.dialogue.draw(draw, guiDraw)
	}
}