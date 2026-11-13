const pictureQuizQuestions = [
	{
		category: "Animals",
		prompt: "Can you find the reindeer?",
		picture: BabyGamePictures.sound,
		choices: [["Reindeer", BabyGamePictures.reindeer], ["Fish", BabyGamePictures.fish], ["Bear", BabyGamePictures.bear]],
		answer: "Reindeer",
		feedback: "Well done! That is a reindeer.",
	},
	{
		category: "Nature",
		prompt: "Which picture shows a mountain?",
		picture: BabyGamePictures.sound,
		choices: [["Tree", BabyGamePictures.tree], ["Mountain", BabyGamePictures.mountain], ["Flower", BabyGamePictures.flower]],
		answer: "Mountain",
		feedback: "Yes! That is a mountain.",
	},
	{
		category: "Colours",
		prompt: "Can you find blue?",
		picture: BabyGamePictures.sun,
		choices: [["Red", BabyGamePictures.red], ["Blue", BabyGamePictures.blue], ["Yellow", BabyGamePictures.yellow]],
		answer: "Blue",
		feedback: "You found blue!",
	},
	{
		category: "Numbers",
		prompt: "How many stars can you see?",
		picture: BabyGamePictures.star.repeat(3),
		choices: [["Two", BabyGamePictures.number(2)], ["Three", BabyGamePictures.number(3)], ["Four", BabyGamePictures.number(4)]],
		answer: "Three",
		feedback: "That's right! One, two, three stars.",
	},
	{
		category: "Everyday life",
		prompt: "What do you wear on your feet?",
		picture: BabyGamePictures.sound,
		choices: [["Hat", BabyGamePictures.hat], ["Boots", BabyGamePictures.boots], ["Mittens", BabyGamePictures.mittens]],
		answer: "Boots",
		feedback: "Yes! You wear boots on your feet.",
	},
	{
		category: "Silly fox",
		prompt: "Fox says: This is a reindeer! Is Fox right?",
		picture: BabyGamePictures.fox + BabyGamePictures.fish,
		choices: [["Yes", BabyGamePictures.yes], ["No", BabyGamePictures.no]],
		answer: "No",
		feedback: "You caught me! It is a fish, not a reindeer!",
	},
]

function speakPictureQuiz(html, text) {
	const request = ++html.fields.speechRequest
	Tts(text).catch(() => {
		if html.isConnected && request == html.fields.speechRequest {
			html.soundstatus.textContent = "Sound is unavailable on this device. You can still play."
		}
	})
}

function answerPictureQuiz(html, answer) {
	const fields = html.fields
	if fields.answered {
		return
	}

	const question = pictureQuizQuestions[fields.question]
	if answer != question.answer {
		html.feedback.textContent = "Try again! Listen and take another look."
		speakPictureQuiz(html, "Try again! " + question.prompt)
		return
	}

	fields.answered = true
	html.progress.value = fields.question + 1
	html.feedback.textContent = question.feedback
	html.choices.forEach(button => {
		button.disabled = true
	})
	html.next.hidden = false
	html.next.textContent = fields.question == pictureQuizQuestions.length - 1 ? "Finish" : "Next"
	speakPictureQuiz(html, question.feedback)
}

function showPictureQuiz(html) {
	const fields = html.fields
	const question = pictureQuizQuestions[fields.question]
	fields.answered = false
	html.choices.replaceChildren()
	html.next.hidden = true
	html.replay.hidden = true
	html.step.textContent = `${fields.question + 1} / ${pictureQuizQuestions.length}`
	html.category.textContent = question.category
	html.picture.innerHTML = question.picture
	html.prompt.textContent = question.prompt
	html.feedback.textContent = "Choose an answer. You can listen as often as you like."

	for const [label, picture] of question.choices.shuffle() {
		const choice = H.button(label, () => answerPictureQuiz(html, label))
		choice.data.answer = label
		choice.innerHTML = `<span class="quiz-choice-picture">${picture}</span><span>${label}</span>`
		html.choices.append(choice)
	}
}

function resetPictureQuiz(html) {
	html.fields.speechRequest++
	window.speechSynthesis?.cancel()
	html.fields.question = 0
	html.progress.value = 0
	html.soundstatus.textContent = ""
	showPictureQuiz(html)
}

export default {
	page: {
		persistOnClose: false,
		layout: "mini-game-layout",
	},
	fields: () => ({ question: 0, answered: false, speechRequest: 0 }),
	onFirstDomAdd: ({ html }) => resetPictureQuiz(html),
	onDomRemove: () => {
		window.speechSynthesis?.cancel()
	},
	methods: {
		listen: html => {
			const question = pictureQuizQuestions[html.fields.question]
			speakPictureQuiz(html, question ? question.prompt : "Well done! You finished the quiz!")
		},
		next: html => {
			if !html.fields.answered {
				return
			}

			html.fields.question++
			if html.fields.question < pictureQuizQuestions.length {
				showPictureQuiz(html)
				return
			}

			html.choices.replaceChildren()
			html.picture.innerHTML = BabyGamePictures.star
			html.category.textContent = "Well done!"
			html.prompt.textContent = "You finished the quiz!"
			html.feedback.textContent = "Six questions, six discoveries. Let's play again!"
			html.next.hidden = true
			html.replay.hidden = false
			speakPictureQuiz(html, "Well done! You finished the quiz!")
		},
		restart: html => resetPictureQuiz(html),
	},
}
