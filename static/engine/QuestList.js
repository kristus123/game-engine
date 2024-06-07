export class QuestList {

	static add(text) {
		const q = document.getElementById('quest_list')
		const p = Html.p(text)
		q.appendChild(p)

		return {
			completed: () => p.classList.add("crossed")
		}
	}

	static clear() {
		const div = document.getElementById('quest_list')
		div.innerHTML = ''
	}

    static show(){
        document.getElementById("quest_list").style.display = "flex";
    }

    static close(){
        document.getElementById("quest_list").style.display = "none"
    }
}
