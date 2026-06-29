export const SeasonsTasks = {
	GoInsideLavvu: (world) => Task("Go inside Lavvu", {
		start: (markDone) => {
			return {
				update: () => {
					// 1. Move old Sami towards the lavvu entrance at (1000, 370)
					if (world.oldSami.moveTowards(WorldPosition(1000, 370), 120)) {
						world.oldSami.removeItself()
					}

					// 2. Prompt player when close to the entrance
					if (Distance.within(100, world.player.position, WorldPosition(1000, 370))) {
						world.player.msg.set([H.p("Press <key>E</key> to enter the lavvu")])
						world.player.msg.show()

						if (Keyboard.e) {
							world.player.msg.hide()
							// Ensure old Sami is removed if he hasn't reached yet
							world.oldSami.removeItself()
							world.player.removeItself()

							// Start Sami theme song
							Mix.master.volume = 0.6
							Mix.master.play(Sound.theme)

							markDone()
						}
					}
					else {
						world.player.msg.hide()
					}
				}
			}
		}
	}),

	ExperienceSeasons: (world) => Task("Experience the Seasons", {
		start: (markDone) => {
			world.quest.season = Season.winter
			world.quest.skyOpacity = 0
			world.seasonTimer = StopWatch().start()

			// Generate winter color maps and apply them to map and bushes
			world.bushes.forEach(b => {
				const bushMap = Season.makeWinterColorMap(b)
				b.changeColor(bushMap)
			})
			const worldMapColorMap = Season.makeWinterColorMap(world.worldMap)
			world.worldMap.changeColor(worldMapColorMap)

			Shadow.opacity = 1.0

			world.dialogue = Dialogue([
				{ position: world.oldSami, text: "Winter brings the deep snow, and the reindeer travel south...", sleepEnd: 3500 }
			], () => {
				world.dialogue = null
			})

			return {
				update: () => {
					world.player.resetVelocity()

					// Keep sky opacity at 0 to hide sky bar
					world.quest.skyOpacity = 0

					if (Shadow.opacity > 0.45) {
						Shadow.opacity -= 0.8 * DeltaTime.value
					}
					else {
						Shadow.opacity = 0.45
					}

					if (world.dialogue) {
						world.dialogue.update()
					}

					if (world.seasonTimer.time > 12000) {
						world.seasonTimer.restart()

						if (world.quest.season == Season.winter) {
							world.quest.season = Season.summer
							// Reset winter color changes to green summer
							world.bushes.forEach(b => b.reset())
							world.worldMap.reset()

							world.dialogue = Dialogue([
								{ position: world.oldSami, text: "Summer warms our land under the midnight sun...", sleepEnd: 3500 }
							], () => {
								world.dialogue = null
							})
						}
						else if (world.quest.season == Season.summer) {
							world.quest.season = Season.rain
							world.dialogue = Dialogue([
								{ position: world.oldSami, text: "And the autumn rain tells us it is time to return to the fire.", sleepEnd: 3500 }
							], () => {
								world.dialogue = null
							})
						}
						else {
							markDone()
						}
					}
				}
			}
		}
	}),

	EndTitle: (world) => Task("End Title", {
		start: (markDone) => {
			world.endUI = Dom.overlay(H.div("", [
				H.p("SAMI SPIRIT").css("font-size: 80px; font-weight: bold; margin-bottom: 20px; font-family: Courier New, monospace; color: white;"),
				H.p("* WORKING TITLE").css("font-size: 30px; font-family: Courier New, monospace; color: white;")
			]).css("display: flex; flex-direction: column; justify-content: center; align-items: center; background: black; color: white; z-index: 10000; width: 100vw; height: 100vh;"))

			return {
				update: () => {
					world.player.resetVelocity()
				}
			}
		}
	})
}
