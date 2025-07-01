import { G } from '/static/engine/G.js'; 
import { OnChange } from '/static/engine/code_tools/OnChange.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Keyboard } from '/static/engine/controller/keyboard/Keyboard.js'; 
import { Sleep } from '/static/engine/core/Sleep.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { HtmlProgressBar } from '/static/engine/graphics/ui/html/HtmlProgressBar.js'; 
import { Dialogue } from '/static/engine/mechanics/dialogue/Dialogue.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Worker } from '/static/game/enemies/Worker.js'; 
import { D } from '/static/game/world/D.js'; 
import { Npc } from '/static/game/world/Npc.js'; 
import { Player } from '/static/game/world/player/Player.js'; 

export class World {
	constructor() {


		const main = this

		G.player = new Player(new Position(150, 0))
		Controller.control(G.player)
		Camera.followInstantly(G.player)

		G.storeWorker = new Npc(new Position(0, -400))

		G.poops = new LocalObjects()

		G.flowers = new LocalObjects(Random.positions(0, 800, 0, 800, 20)
			.map(p => {
				const s = G.Sprite.flower(p)
				s.idle.show(0)
				return s
			}))


		this.world = G.Sprite.world(new Position(-1000, -1000))

		this.localObjects = new LocalObjects([
			this.world,
			new Quest([
				() => new class {
					constructor() {
						G.storeWorker.sprite.prepareSleep.play(() => {
							G.storeWorker.sprite.sleep.loop()
							this.completed = () => true
						})
					}

					completed() {
						return false
					}

				},




				() => new Dialogue([
					new TextTyper(G.player, 'i must go talk to my friend'),
				]),


				() => new class {
					completed() {
						return G.player.touches(G.storeWorker) && Keyboard.e
					}

					update() {
					}

					draw(draw, guiDraw) {
						if (G.player.touches(G.storeWorker)) {
							draw.text(G.storeWorker, 'press "e" to talk')
						}
					}
				},

				() => new class {
					constructor() {
						G.storeWorker.sprite.happy.play(() => {
							G.storeWorker.sprite.idle.loop()
						})
					}

					completed() {
						return true
					}

				},


				() => new Dialogue([
					new TextTyper(G.storeWorker, 'hi there!'),
					new TextTyper(G.player, 'what should i do?'),
					new TextTyper(G.storeWorker, 'try to poop by pressing "p"'),
					new TextTyper(G.storeWorker, '   '),
					new TextTyper(G.storeWorker, 'poop 4 times!'),
				]),

				() => new class {

					constructor() {

						G.storeWorker.sprite.sleep.loop()

						HtmlProgressBar.create()
						this.d = new Dialogue([
							new TextTyper(G.storeWorker, G.poops.length.toString()),
						])

						this.localObjects = new LocalObjects([
							new OnChange(() => G.poops.length, () => {
								HtmlProgressBar.change(25)
								this.d = new Dialogue([
									new TextTyper(G.storeWorker, G.poops.length.toString()),
								])
							})
						])
					}

					completed() {
						return G.poops.length >= 4
					}

					update() {
						this.d.update()
						this.localObjects.update()
					}

					draw(draw, guiDraw) {
						this.d.draw(draw, guiDraw)
						this.localObjects.draw(draw, guiDraw)
					}
				},


				() => new class {
					completed() {
						HtmlProgressBar.remove()
						return true
					}

				},


				() => new Dialogue([
					new TextTyper(G.storeWorker, 'good job!'),
					new TextTyper(G.storeWorker, 'now place the poop in the poop area'),
				]),


				() => new class {
					constructor() {
						this.deliveryZone = new Position(400, 200, 100, 100)

						this.localObjects = new LocalObjects([
							new OnChange(() => G.poops.length, poops => {

							}),
						])
					}

					completed() {
						this.count = 0
						for (const p of G.poops) {
							if (p.touches(this.deliveryZone)) {
								this.count += 1
							}
						}

						return this.count == 4
					}

					draw(draw, guiDraw) {
						draw.text(this.deliveryZone.over(200), `${this.count}/4`)
						draw.orange(this.deliveryZone)
					}
				},

				() => new Dialogue([
					new TextTyper(G.storeWorker, 'good job!'),
					new TextTyper(G.storeWorker, 'now we have a bunch of poop!'),
					new TextTyper(G.storeWorker, 'try to poop on the flowers to make them grow strong!'),
				]),
			]),


			G.storeWorker,
			G.poops,
			G.flowers,
			G.player,


		])
	}

	update() {
		this.localObjects.update()

		for (const f of G.flowers) {

			if (G.player.touches(f)) {
				f.idle.show(1)
			}
			else {
				f.idle.show(0)
			}

			for (const p of G.poops) {
				if (p.touches(f)) {
					f.idle.show(2)
				}
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		// for (const s of this.world.slices) {
		// 		draw.rectangle(s.position)
		// }
	}
}
