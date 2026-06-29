export const GatheringTasks = {
	TalkToOldSami: (world) => Task("Talk to Old Sami", {
		start: (markDone) => {
			world.dialogue = Dialogue([
				{ position: world.oldSami, text: "its about time i tell you the tale of our people", sleepEnd: 2500 },
				{ position: world.oldSami, text: "many people have heard of us", sleepEnd: 2500 },
				{ position: world.oldSami, text: "but they dont know much", sleepEnd: 2500 },
				{ position: world.oldSami, text: "it is extra important for us to carry on with traditions", sleepEnd: 3000 },
				{ position: world.oldSami, text: "we are the sami people", sleepEnd: 2500 }
			], () => {
				world.dialogue = null
				markDone()
			})

			return {
				update: () => {
					world.player.resetVelocity()
					if (world.dialogue) {
						world.dialogue.update()
					}
				}
			}
		}
	}),

	FindBerries: (world) => Task("Find Berries", {
		start: (markDone) => {
			world.dialogue = Dialogue([
				{ position: world.oldSami, text: "Before we talk further, could you gather some cloudberries from the bushes?", sleepEnd: 3000 }
			], () => {
				world.dialogue = null
			})

			world.bushes.forEach(b => {
				b.harvested = false
				b.loopTag("berries")
			})

			return {
				update: () => {
					if (world.dialogue) {
						world.dialogue.update()
						world.player.resetVelocity()
						return
					}

					world.bushes.forEach(b => {
						if (!b.harvested && world.player.distance(b) < 80) {
							world.player.msg.set([H.p("Press <key>E</key> to pick berries")])
							world.player.msg.show()

							if (Keyboard.e) {
								b.harvested = true
								b.loopTag("idle")
								world.player.sprite.playTag("magic") // gather animation
								Mix.fx.play(Sound.click)
								world.quest.berriesCollected++
								world.player.msg.hide()
							}
						}
					})

					let nearAnyBush = world.bushes.some(b => !b.harvested && world.player.distance(b) < 80)
					if (!nearAnyBush) {
						world.player.msg.hide()
					}

					if (world.quest.berriesCollected >= 3) {
						if (world.player.distance(world.oldSami) < 100) {
							world.player.msg.hide()
							world.player.resetVelocity()

							world.dialogue = Dialogue([
								{ position: world.oldSami, text: "Ah, cloudberries! The gold of the Arctic. Thank you.", sleepEnd: 2500 },
								{ position: world.oldSami, text: "Now, let us go inside the lavvu to keep warm.", sleepEnd: 2500 }
							], () => {
								world.dialogue = null
								markDone()
							})
						}
					}
				}
			}
		}
	})
}
