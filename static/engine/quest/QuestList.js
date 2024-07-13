export class QuestList {

	static add(text) {
		const questList = document.getElementById('quest_list')

		const p = Html.p(text)
		questList.appendChild(p)

		return {
			completed: () => p.classList.add('crossed'),
			text: t => p.innerHTML = t,
		}
	}

	static clear() {
		Html.removeChildElementsInId('quest_list')
	}

	static show() {
		document.getElementById('quest_list').style.display = 'flex'
	}

	static hide() {
		Html.removeChildElementsInId('quest_list')

		document.getElementById('quest_list').style.display = 'none'
	}
}
