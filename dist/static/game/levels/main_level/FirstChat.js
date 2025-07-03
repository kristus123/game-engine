import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { RunOnce } from '/static/engine/code_tools/on/RunOnce.js'; 
import { Call } from '/static/engine/code_tools/tools/Call.js'; 
import { Dialogue } from '/static/engine/mechanics/dialogue/Dialogue.js'; 
import { D } from '/static/game/world/D.js'; 

export class FirstChat {
	constructor(position) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		const p = position.copy()
		p.width = 700
		p.height = 100

		const howDoIPlay = {
			key: 'play',
			text: 'Wait, how do i move around?',
			conversation: {
				question: 'Press \'e\' to dash and press \'e\' to enter the piss cleaning vehicle, the rest should be obvious',
				replies: [],
			},
		}

		const yes = {
			key: 'yes',
			text: 'yes i look forward to it',
			conversation: {
				question: 'Thats good to hear. hopefully you will not do anything stupid',
				replies: [
					{
						key: 'ok',
						text: 'Don\'t worry',
						conversation: {
							question: 'Great. Now, get to work!',
							replies: [howDoIPlay]
						},
					},
				],
			},
		}

		this.dialogue = new Dialogue({
			question: 'Finally. The delivery has arrived. Are you ready to clean some piss boy?',
			replies: [
				yes,
				howDoIPlay,
			]
		}, p)
	}

	update() {
		RunOnce(this.dialogue.ok, () => {
			Call(this.onFinish)
		})
	}

	draw(draw, guiDraw) {
		this.dialogue.draw(draw, guiDraw)
	}
}
