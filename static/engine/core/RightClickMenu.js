export class RightClickMenu {
	constructor() {
		Mouse.onRightClick = position => {
			Html.addToScreen(
				Html.floating(Html.div('right-click-menu', [
					Html.p('add smt idk', 'right-click-element'),
					Html.p('add smt idk', 'right-click-element'),
					Html.button('add smt idk', () => {
						console.log("ckicked!")
					}),
				]), position))
		}
	}

	update() {
	}

	draw(draw, guiDraw) {
	}
}
