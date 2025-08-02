import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { BottomText } from '/static/engine/graphics/ui/BottomText.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { QuestList } from '/static/engine/mechanics/quest/QuestList.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class House extends StaticGameObject {
	constructor(player) {
		super(new Position(-1000, -300, 1000, 500))

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 


		const house = this

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/house.png'),
			new Quest([
				() => new class {
					constructor() {
						this.task = QuestList.add('Locate research facility')
						this.compass = new Compass([house])
					}

					update() {
					}

					draw(draw, guiDraw) {
						this.compass.draw(draw, guiDraw)
					}

					completed() {
						if (house.within(2000, player)) {
							this.task.completed()
							return true
						}
						else {
							return false
						}
					}
				},
				() => new class {
					constructor() {
						this.task = QuestList.add('Look for survivors')

						this.completed = () => false
						setTimeout(() => {
							BottomText.show('No survivors in sight')
							setTimeout(() => {
								BottomText.remove()
							}, 1000)

							this.task.completed()
							this.completed = () => true
						}, 1000)
					}
				}
			])
		])
	}

	update() {
		this.localObjects.update()

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

	}
}
