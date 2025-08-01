import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { OnChange } from '/static/engine/code_tools/on/OnChange.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export class ReadSign {
	constructor(position) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			new OnChange(() => G.player.within(300, position), close => {
				if (close) {
					Html.center([Html.div('big', [
						Html.h1('I\'m a goat'),
						Html.button('are you happy?', () => {
							Html.clearCenter()
							Html.center([Html.div('big', [
								Html.h1('that\'s good'),
								Html.p('what\'s your name?'),
								Html.input('Name', value => {
									Html.clearCenter()
									Html.center([Html.div('big', [
										Html.h1('nice to meet you'),
										Html.h1(value),
									])])
								}),
							])])

						}),
					])])
				}
				else {
					Html.clearCenter()
				}
			})
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
