export function IntroQuest(player, oldSami) {
	return Quest([





		({ markDone }) => {
			const d = Dialogue(oldSami.position, [
				{ text: "Come here <span style='color:red'>sexy ass</span> young man", sleepEnd: 1000 },
			], () => {
				markDone()
			})
			return {
				update: () => {
					d.update()
					oldSami.forcePushTo(player, 50)
				},
			}
		},





		({ markDone }) => {
			const d = Dialogue(player.position, [
				{ text: `
						how are you <span style='color:yellow; font-size:40px;'>MAN YO</span>
					`, sleepEnd: 2000 },
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
			const box = F.talkBubble()
			box.text.textContent = "i need to find x"

			return {
				update: () => {
					box.worldFloat(player.position)
				},
			}
		},





	], () => {
	})
}
