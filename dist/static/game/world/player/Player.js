import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Chicken } from '/static/engine/chicken_stuff/Chicken.js'; 
import { OnChange } from '/static/engine/code_tools/on/OnChange.js'; 
import { OnTrue } from '/static/engine/code_tools/on/OnTrue.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { KeyDown } from '/static/engine/controller/keyboard/KeyDown.js'; 
import { Keyboard } from '/static/engine/controller/keyboard/Keyboard.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { ChickenFood } from '/static/game/ChickenFood.js'; 
import { D } from '/static/game/world/D.js'; 
import { Init } from '/static/game/world/Init.js'; 
import { Throw } from '/static/game/world/Throw.js'; 

export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 200)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			Init(this, {
				sprite: G.Sprite.player(this.position, 1),
			}),
			new Throw(() => new ChickenFood(this.position.copy())),

			G.splash,

			new OnChange(() => this.holding, h => {
				if (h) {
					this.sprite.happy.loop()
				}
				else {
					this.sprite.idle.loop()
				}
			}),

			new OnTrue(() => Keyboard.up, () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}

				this.sprite.up.loop()
			}),

			new OnTrue(() => Keyboard.down, () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}
				this.sprite.down.loop()
			}),

			new OnTrue(() => Keyboard.left, () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}
				this.sprite.left.loop()
			}),

			new OnTrue(() => Keyboard.right, () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}
				this.sprite.right.loop()
			}),

			new OnTrue(() => Keyboard.noButtonsPressed(), () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}
				this.sprite.idle.loop()
			}),
		])

		KeyDown('e', () => {
			if (this.holding) {
				this.holding = null
			}
			else {
				const p = this.touchesAny(G.poops)
				if (p) {
					this.holding = p
					console.log('hei')
				}
			}
		})

		KeyDown('p', () => {
			Controller.disabled = true
			this.velocity.reset()
			this.sprite.poop.play(() => {
				Controller.disabled = false

				const poop = new Square(this.position.copy(40, 80), 20)
				poop.color = 'brown'

				G.poops.add(poop)
				G.splash.random(poop, 'brown')
				Html.fadeaway('poop', this.position.copy().up(200).left(400))
			})
		})

	}

	update() {
		this.localObjects.update()

		if (this.holding) {
			this.holding.position.xy(this.position.offset(50))
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.holding) {
			draw.text(this.holding.position.offset(100), '"E" to drop')
		}
		else {
			const p = this.touchesAny(G.poops)
			if (p) {
				draw.text(p.position.offset(0), '"E" to pick up')
			}

		}
	}
}
