import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { OnChange } from '/static/engine/code_tools/on/OnChange.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Keyboard } from '/static/engine/controller/keyboard/Keyboard.js'; 
import { Sleep } from '/static/engine/core/Sleep.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Grid } from '/static/engine/graphics/Grid.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { HtmlProgressBar } from '/static/engine/graphics/ui/html/HtmlProgressBar.js'; 
import { Dialogue } from '/static/engine/mechanics/dialogue/Dialogue.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 
import { Grass } from '/static/game/world/Grass.js'; 
import { Npc } from '/static/game/world/Npc.js'; 
import { Player } from '/static/game/world/player/Player.js'; 

export class World {
	constructor() {



		G.player = new Player(new Position(150, 0))
		Controller.control(G.player)
		Camera.followInstantly(G.player)

		G.friend = new Npc(new Position(0, -400))

		G.poops = new LocalObjects()

		G.flowers = new LocalObjects(Random.positions(0, 800, 0, 800, 20)
			.map(p => {
				const s = G.Sprite.flower(p)
				s.idle.show(0)
				return s
			}))

		this.grass = new LocalObjects()
		const grid = new Grid()
		Mouse.onClick = p => {
			const snapped = grid.snappedPosition(p)
			const g =  G.Sprite.wheat(snapped).grow.show(9)
			this.grass.add(g)
		}

		this.world = G.Sprite.world(new Position(-1000, -1000))

		this.localObjects = new LocalObjects([
			this.world,
			this.grass,

			...new Grid().positions.map(p => new Grass(p)),

			new Quest([
				() => new class {
					constructor() {
						G.friend.sprite.prepareSleep.play(() => {
							G.friend.sprite.sleep.loop()
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
						return G.player.touches(G.friend) && Keyboard.e
					}

					update() {
					}

					draw(draw, guiDraw) {
						if (G.player.touches(G.friend)) {
							draw.text(G.friend, 'press "e" to talk')
						}
					}
				},

				() => new class {
					constructor() {
						G.friend.sprite.talk.loop()
					}

					completed() {
						return true
					}

				},


				() => new Dialogue([
					new TextTyper(G.friend, 'hi there!'),
					new TextTyper(G.player, 'what should i do?'),
					new TextTyper(G.friend, 'try to poop by pressing "p"'),
					new TextTyper(G.friend, 'poop 4 times!'),
				]),

				() => new class {

					constructor() {

						G.friend.sprite.prepareSleep.play(() => {
							G.friend.sprite.sleep.loop()
						})

						HtmlProgressBar.create()
						this.d = new Dialogue([
							new TextTyper(G.friend, G.poops.length.toString()),
						])

						this.localObjects = new LocalObjects([
							new OnChange(() => G.poops.length, () => {
								HtmlProgressBar.change(25)
								this.d = new Dialogue([
									new TextTyper(G.friend, G.poops.length.toString()),
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
					new TextTyper(G.friend, 'good job!'),
					new TextTyper(G.friend, 'now place the poop in the poop area'),
				]),


				() => new class {
					constructor() {
						this.deliveryZone = new Position(400, 200, 100, 100)
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
					new TextTyper(G.friend, 'good job!'),
					new TextTyper(G.friend, 'now we have a bunch of poop!'),
					new TextTyper(G.friend, 'try to poop on the flowers to make them grow strong!'),
				]),
			]),


			G.friend,
			G.poops,
			G.flowers,
			G.player,
			G.Sprite.goat(new Position(-310,10)).happy.loop(),
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
