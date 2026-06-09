export function IntroQuest(player, oldSami, bush) {
	return Quest([

		({ markDone }) => {
			const d = Dialogue([
				{ position: oldSami, text: "Ohhh Hi Mark", sleepEnd: 1000 },
				{ position: oldSami, text: "happy?", sleepEnd: 1000 },
			], () => {
				markDone()
			})
			return {
				update: () => {
					d.update()
					oldSami.forcePushTo(player, 100)
				},
			}
		},

		({ markDone }) => {
			let berriesFound = false

			const d = Dialogue([
				{ position: oldSami, text: "Find some berries", sleepEnd: 1000 },
			], () => {
			})
			return {
				update: () => {
					d.update()

					if (player.touches(bush)) {
						markDone()
						bush.loopTag("idle")
					}
				},
			}
		},

		({ markDone }) => {
			const d = Dialogue([
				{ position: player, text: "I found them!", sleepEnd: 1000 },
			], () => {
				markDone()
			})
			return {
				update: () => {
					d.update()
				},
			}
		},


		({ markDone }) => {
			const d = Dialogue([
				{ position: oldSami, text: "good job", sleepEnd: 1000 },
			], () => {
			})
			return {
				update: () => {
					d.update()
				},
			}
		},

	], () => {
	})
}
