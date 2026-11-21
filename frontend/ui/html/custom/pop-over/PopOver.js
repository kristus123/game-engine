export class PopOver {
	constructor(html, condition) {

		this.objects = Objects([
			OnChange(condition, show => {
				if show {
					html.show()
				}
				else {
					html.hide()
				}
			}),
		])
	}

	update() {
		this.objects.update()
	}
}
