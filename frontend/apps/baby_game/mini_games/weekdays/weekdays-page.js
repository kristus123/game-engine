const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const weekdayPictures = [BabyGamePictures.sun, BabyGamePictures.tree, BabyGamePictures.tent, BabyGamePictures.mountain, BabyGamePictures.reindeer, BabyGamePictures.fish, BabyGamePictures.moon]

function speakWeekdays(html, text) {
	const request = ++html.fields.speechRequest
	Tts(text).catch(() => {
		if html.isConnected && request == html.fields.speechRequest {
			html.soundstatus.textContent = "Sound is unavailable on this device. You can still play."
		}
	})
}

function checkWeekdays(html) {
	if html.fields.completed {
		return
	}

	const order = html.days.map(card => card.data.day)
	if !order.same(weekdayNames) {
		html.feedback.textContent = "Keep going! You can listen to the week for a hint."
		return
	}

	html.fields.completed = true
	html.days.removeAttribute("sortable")
	html.feedback.textContent = "You did it! All seven days are in order!"
	html.replay.hidden = false
	speakWeekdays(html, "Well done! All seven days are in order!")
}

function startWeekdays(html) {
	html.fields.speechRequest++
	window.speechSynthesis?.cancel()
	html.fields.completed = false
	html.days.removeAttribute("sortable")
	html.days.replaceChildren()
	html.replay.hidden = true
	html.feedback.textContent = "Monday comes first. Which day comes next?"
	html.soundstatus.textContent = ""

	for const index of [0, 1, 2, 3, 4, 5, 6].shuffle() {
		const day = weekdayNames[index]
		const card = document.createElement("button")
		card.type = "button"
		card.data.day = day
		card.setAttribute("draggable", "")
		card.style.setProperty("--day-colour", ["#d99735", "#4d8763", "#ac624a", "#6575a7", "#976399", "#3d8b98", "#555a91"][index])
		card.innerHTML = `<span class="day-picture">${weekdayPictures[index]}</span><span>${day}</span>`
		card.addEventListener("pointerdown", () => speakWeekdays(html, day))
		card.addEventListener("click", event => {
			if event.detail == 0 {
				speakWeekdays(html, day)
			}
		})
		html.days.append(card)
	}

	html.scrollarea.scrollLeft = 0
	html.days.setAttribute("sortable", "")
}

export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},
	fields: () => ({ completed: false, speechRequest: 0 }),
	onFirstDomAdd: ({ html }) => {
		html.days.sortableChildMoved = () => checkWeekdays(html)
		startWeekdays(html)
	},
	onDomRemove: ({ html }) => {
		html.days.sortableChildMoved = null
		html.days.removeAttribute("sortable")
		window.speechSynthesis?.cancel()
	},
	methods: {
		listen: html => speakWeekdays(html, weekdayNames.join(". ") + "."),
		restart: html => startWeekdays(html),
	},
}
