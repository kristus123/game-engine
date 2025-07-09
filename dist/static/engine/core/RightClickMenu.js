import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 

const menu = Html.addToScreen(Html.div('right-click-menu', []))
Html.hide(menu)

export class RightClickMenu {
	constructor() {


		Mouse.onRightClick = position => {

			Html.removeChildElements(menu)

			Html.append(menu, [
				this.x = Html.p('add smt idk', 'right-click-element'),
				Html.p('add smt idk', 'right-click-element'),
				Html.dropDown(Html.p('menu', 'right-click-element'), [Html.p('menu1', 'right-click-element'), Html.p('menu2', 'right-click-element')]),
				Html.button('add smt idk', () => {
					console.log('ckicked!')
					Html.hide(menu)
				}),
			])

			Html.floating(menu, position)

			Html.show(menu)
		}

		Mouse.onClick = position => {
			if (!Mouse.hovering(menu)) {
				Html.hide(menu)
				console.log('not hovering menu !!!')
			}
		}
	}

	update() {
		if (Mouse.hovering(menu)) {
			console.log(' hovering menu !!!')
		}
	}

	draw(draw, guiDraw) {
	}
}
