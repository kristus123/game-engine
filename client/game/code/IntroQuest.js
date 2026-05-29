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

	], () => {
	})
}
