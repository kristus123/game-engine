export class QuestList {

	static add(text) {
		Html.addToScreen(Html.div('ui left', [
			Html.p(text),
		]))

		// return {
		// 	completed: () => p.classList.add('crossed'),
		// 	text: t => p.innerHTML = t,
		// }
	}

	static clear() {
		Html.removeChildElementsInId('quest_list')
	}
}
