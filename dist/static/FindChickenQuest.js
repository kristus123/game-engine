import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Chicken } from '/static/engine/chicken_stuff/Chicken.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Button } from '/static/engine/graphics/ui/Button.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { MovableObjects } from '/static/engine/mechanics/MovableObjects.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { QuestList } from '/static/engine/mechanics/quest/QuestList.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export class FindChickenQuest {
	constructor(kid, player) {

				AssertNotNull(kid, "argument kid in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.kid = kid; 
		this.player = player; 


		const chicken = new Chicken(kid.position.offset(800).copy())

		this.localObjects = new LocalObjects([
			chicken,
			new MovableObjects(player, [chicken]),
			new Quest([
				() => new class {
					constructor() {
						this.completed = () => false

						this.button = new Button(kid.position.right(50), 'of course!', b => {
							Html.remove(b)
							QuestList.add('find his chicken')
							this.completed = () => true
						})
					}

					update() {
						this.button.update()
					}

					draw(draw, guiDraw) {
						if (kid.within(300, player)) {
							draw.text(kid.position.over(), 'can you help me? My chicken is missing')
						}
						else {
							draw.text(kid.position.over(), '!!!')
						}
					}
				},
				() => new class {
					completed() {
						if (chicken.within(200, kid) || chicken.touches(kid)) {
							chicken.velocity.reset()
							return true
						}
						else {
							return false
						}
					}

					draw(draw, guiDraw) {
						if (kid.within(300, chicken)) {
							draw.text(kid.position.over(), 'THANK YOU SO MUCH! i hope he\'s safe')
						}
						else {
							draw.text(kid.position.over(), '!!!')
						}
					}
				},
				() => new class {
					completed() {
						return false
					}

					draw(draw, guiDraw) {
						if (kid.within(300, chicken)) {
							draw.text(kid.position.over(), 'YOU FOUND HIM. THANK YOU!')
						}
						else if (chicken.notWithin(300, kid)) {
							draw.text(kid.position.over(), 'MY CHICKEN!! WHAT ARE YOU DOING???')
						}
					}
				},
			]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
