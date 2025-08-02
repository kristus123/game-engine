export class ReadSign {
	constructor(position) {

		this.localObjects = new LocalObjects([
			OnChange(() => G.player.within(300, position), close => {
				if (close) {
					Html.center([Html.div('big', [
						Html.h1('I\'m a goat'),
						Html.button('are you happy?', () => {
							Html.clearCenter()
							Html.center([Html.div('big', [
								Html.h1('that\'s good'),
								Html.p('what\'s your name?'),
								Html.input('Name', value => {
									Html.clearCenter()
									Html.center([Html.div('big', [
										Html.h1('nice to meet you'),
										Html.h1(value),
									])])
								}),
							])])
						}),
					])])
				}
				else {
					Html.clearCenter()
				}
			})
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
