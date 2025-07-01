import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 

export class QuestList {

	static add(text) {
		const p = Html.p(text)
		Html.addToScreen(Html.div('ui left', [
			p,
		]))

		return {
			completed: () => p.classList.add('crossed'),
			text: t => p.innerHTML = t,
		}
	}

	static clear() {
		Html.removeChildElementsInId('quest_list')
	}
}
