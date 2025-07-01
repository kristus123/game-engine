import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { Text } from '/static/engine/mechanics/dialogue/Text.js'; 

const p = Html.p('default', 'lower-center-ui pokemon-text')
Html.addToScreen(p)
Html.hide(p)

export class BottomText {

	static show(text, removeAfterMs=null) {

		Html.changeText(p, text)
		Html.show(p)

		if (removeAfterMs) {
			setTimeout(() => {
				Html.hide(p)
			}, removeAfterMs)
		}
	}

	static hide() {
		Html.hide(p)
	}
}
