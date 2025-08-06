import { Init } from '/static/engine/Init.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Position } from '/static/engine/core/position/Position.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { BottomText } from '/static/engine/graphics/ui/BottomText.js'; 
import { DeliveryZone } from '/static/engine/mechanics/DeliveryZone.js'; 
import { Dialogue } from '/static/engine/mechanics/dialogue/Dialogue.js'; 
import { MultiTextTyper } from '/static/engine/mechanics/dialogue/MultiTextTyper.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { QuestList } from '/static/engine/mechanics/quest/QuestList.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Update } from '/static/game/Update.js'; 

export class TalkToShopKeeper {

	constructor(player) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 


		const square = new Square(new Position(-500, 0), 200)
		const picture = new Picture(square.position, '/static/assets/shopkeeper.png')
		square.draw = (draw, guiDraw) => {
			picture.draw(draw, guiDraw)
		}

		const hoe = new DynamicGameObject(new Position(-400, 0, 100, 300), 10, 10)
		const sprite = new Sprite(hoe.position.offset(0, 0, 300, 250), '/static/assets/woman_32x32.png', [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
		])
		hoe.draw = (draw, guiDraw) => {
			sprite.draw(draw, guiDraw)
		}

		this.localObjects = new LocalObjects([
			square,
			hoe,
			new Quest([
				// () => new class {
				// 	completed() {
				// 		return square.touches(player)
				// 	}
				// },

				// () => new class {
				// 	constructor() {
				// 		this.localObjects = new LocalObjects([
				// 			new MultiTextTyper(square.position.over(), [
				// 				'there you are bitch',
				// 				'we need you',
				// 			], () => {
				// 				this.completed = () => true

				// 				QuestList.add('find shit')
				// 			}),
				// 		])
				// 	}

				// 	update() {
				// 		this.localObjects.update()
				// 	}

				// 	draw(draw, guiDraw) {
				// 		this.localObjects.draw(draw, guiDraw)
				// 	}
				// },
				// () => new class {
				// 	constructor() {
				// 		this.clues = [
				// 			new Square(new Position(-773, -4), 100),
				// 		]

				// 		this.localObjects = new LocalObjects()
				// 	}

				// 	update() {
				// 		for (const c of this.clues) {
				// 			if (player.touches(c)) {
				// 				List.remove(this.clues, c)
				// 				BottomText.show('found a clue', 200)
				// 				QuestList.clear()
				// 				this.localObjects.add(new MultiTextTyper(player.position.over(), [
				// 					'strange',
				// 					'why is this here?',
				// 					'why does the pimp want me to smuggle his hoes to the city?',
				// 				],
				// 				() => {
				// 					this.completed = () => true
				// 				}))
				// 			}
				// 		}

				// 		this.localObjects.update()
				// 	}

				// 	draw(draw, guiDraw) {
				// 		for (const c of this.clues) {
				// 			c.draw(draw, guiDraw)
				// 		}

				// 		this.localObjects.draw(draw, guiDraw)
				// 	}
				// },
				() => new class {
					constructor() {
						this.localObjects = new LocalObjects([
							Init(this, {
								enemies: new LocalObjects([
									new Enemy(player.position.offset(100).copy()),
									new Enemy(player.position.offset(128).copy()),
								]),
								deliveryZone: new DeliveryZone(new Position(1188, -292, 100, 100), [hoe]),
							 }),
							new Dialogue([
								new MultiTextTyper(player.position.over(), [
									'I trust .',
								]),
								new MultiTextTyper(hoe.position.over(), [
									'I .',
								]),
							]),
							new Sword(player, this.enemies.objects),
							new PushEnemies(player, this.enemies.objects),
							Update(() => {
								if (!hoe.within(100, player)) {
									ForcePush(hoe).towards(player.position.center, 4)
								}
							}),
						])
					}

					completed() {
						return this.deliveryZone.completed()
					}

					update() {
						this.localObjects.update()
					}

					draw(draw, guiDraw) {
						this.localObjects.draw(draw, guiDraw)
					}
				}
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
