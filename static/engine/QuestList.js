export class QuestList {

	static add(text) {

		const element = document.getElementById('quest_list');
		element.innerHTML = '';

		const q = document.getElementById('quest_list')
		q.appendChild(Html.div(text))
	}

	static clear() {
	}

    static show(text = "Loading..."){
        document.getElementById("quest_list").style.display = "flex";
    }

    static close(){
        document.getElementById("quest_list").style.display = "none"
    }
}
