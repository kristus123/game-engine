export class QuestList {

	static add(text) {
		const q = document.getElementById('quest_list')
		q.appendChild(Html.div(text))
	}

    static show(text = "Loading..."){
        document.getElementById("quest_list").style.display = "flex";
    }

    static close(){
        document.getElementById("quest_list").style.display = "none"
    }
}
