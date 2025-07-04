import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { Button } from '/static/engine/graphics/ui/Button.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { MultiTextTyper } from '/static/engine/mechanics/dialogue/MultiTextTyper.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { D } from '/static/game/world/D.js'; 

export class Person extends DynamicGameObject {
	constructor(position, player) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.player = player; 

		this.position.width = 170
		this.position.height = 300

		this.picture = new Picture(this.position, '/static/assets/person.png')

		this.localObjects = new LocalObjects()

		this.text = new MultiTextTyper(this.position.over(), [
			'HJEY!!!',
		], () => {
			this.localObjects.add(new Button(this.position.over(), 'what is it?', b => {
				Html.remove(b)
				this.text = new MultiTextTyper(this.position.over(), [
					'i have some cum',
				], () => {
					this.localObjects.add(new Button(this.position.over(), 'wow really?', b => {
						Html.remove(b)
						this.text = new MultiTextTyper(this.position.over(), [
							'yes sir!',
						])
					}))
				})
			}))
		})
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)

		if (this.within(300, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
		}
		else {
			draw.text(this.position.over(), '!!!')
		}
	}
}
