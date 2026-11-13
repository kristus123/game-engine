import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function fixture(game, soundAvailable = true) {
	const folder = "../../frontend/apps/baby_game/mini_games/"
	const path = new URL(folder + game, import.meta.url).pathname
	const source = TranspileContent(path, readFileSync(path, "utf8"), []).replace("export default", "return")
	const spoken = []
	const cancelled = []
	const pendingSpeech = []
	const shared = file => readFileSync(new URL("../../shared/" + file, import.meta.url), "utf8").replace("export class", "class")
	return runInNewContext(`
		${readFileSync(new URL(folder + "../BabyGamePictures.js", import.meta.url), "utf8").replace("export const", "const")}
		${shared("enhance/NativeEnhancer.js")}
		${shared("enhance/js/Enhance_js_Array.js")}
		new Enhance_js_Array()
		class Element {
			children = []
			data = {}
			attributes = new Set()
			style = { setProperty() {} }
			textContent = ""
			hidden = false
			value = 0
			isConnected = true
			setAttribute(name) { this.attributes.add(name) }
			removeAttribute(name) { this.attributes.delete(name) }
			hasAttribute(name) { return this.attributes.has(name) }
			addEventListener() {}
			append(child) { this.children.push(child) }
			replaceChildren() { this.children = [] }
			map(callback) { return this.children.map(callback) }
			forEach(callback) { this.children.forEach(callback) }
			click() { this.onClick?.() }
		}
		const document = { createElement: () => new Element() }
		const H = { button(text, onClick) {
			const button = new Element()
			button.textContent = text
			button.onClick = onClick
			return button
		} }
		const component = (() => { ${source} })()
		const html = new Element()
		html.fields = component.fields()
		for (const name of ["days", "scrollarea", "replay", "feedback", "soundstatus",
			"progress", "choices", "next", "step", "category", "picture", "prompt"]) html[name] = new Element()
		component.onFirstDomAdd({ html, fields: html.fields })
		;({ component, html, spoken, cancelled, pendingSpeech })
	`, {
		spoken,
		cancelled,
		pendingSpeech,
		Assert: { notNull: value => assert.notEqual(value, null), array: value => assert.ok(Array.isArray(value)) },
		IfCondition: { validate: Boolean },
		Tts: text => {
			spoken.push(text)
			if (soundAvailable == "deferred") {
				return new Promise((resolve, reject) => pendingSpeech.push({ resolve, reject }))
			}
			return soundAvailable ? Promise.resolve() : Promise.reject(new Error("No voice"))
		},
		window: { speechSynthesis: { cancel: () => cancelled.push(true) } },
	})
}

test("weekdays shuffle, allow another attempt, celebrate only the right order, and replay", () => {
	const { component, html, spoken, cancelled } = fixture("weekdays/weekdays-page.js")
	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
	assert.equal(html.days.children.length, 7)
	assert.notDeepEqual(Array.from(html.days.map(card => card.data.day)), days)
	assert.equal(html.days.hasAttribute("sortable"), true)
	html.days.sortableChildMoved()
	assert.equal(html.fields.completed, false)
	component.methods.listen(html)
	assert.equal(spoken.at(-1), days.join(". ") + ".")
	html.days.children.sort((a, b) => days.indexOf(a.data.day) - days.indexOf(b.data.day))
	html.days.sortableChildMoved()
	assert.equal(html.fields.completed, true)
	assert.equal(html.days.hasAttribute("sortable"), false)
	assert.equal(html.replay.hidden, false)
	component.methods.restart(html)
	assert.equal(html.fields.completed, false)
	assert.equal(html.replay.hidden, true)
	component.onDomRemove({ html, fields: html.fields })
	assert.equal(html.days.sortableChildMoved, null)
	assert.equal(html.days.hasAttribute("sortable"), false)
	assert.equal(cancelled.length, 3)
})

test("quiz retries wrong answers, counts each success once, completes all themes, and resets", () => {
	const { component, html } = fixture("picture_and_sound_quiz/picture-and-sound-quiz-page.js")
	const answer = label => html.choices.children.find(button => button.data.answer == label).click()
	answer("Fish")
	assert.equal(html.progress.value, 0)
	assert.equal(html.next.hidden, true)
	assert.match(html.feedback.textContent, /Try again/)
	for (const [index, label] of ["Reindeer", "Mountain", "Blue", "Three", "Boots", "No"].entries()) {
		answer(label)
		answer(label)
		assert.equal(html.progress.value, index + 1)
		assert.equal(html.next.hidden, false)
		assert.ok(html.choices.children.every(button => button.disabled))
		component.methods.next(html)
	}
	assert.match(html.prompt.textContent, /finished/)
	assert.equal(html.replay.hidden, false)
	assert.equal(html.choices.children.length, 0)
	component.methods.listen(html)
	component.methods.restart(html)
	assert.equal(html.progress.value, 0)
	assert.equal(html.fields.question, 0)
	assert.equal(html.category.textContent, "Animals")
	assert.equal(html.replay.hidden, true)
})

test("missing speech voices keep both games playable", async () => {
	for (const [game, status] of [
		["weekdays/weekdays-page.js", "soundstatus"],
		["picture_and_sound_quiz/picture-and-sound-quiz-page.js", "soundstatus"],
	]) {
		const { component, html } = fixture(game, false)
		component.methods.listen(html)
		await Promise.resolve()
		assert.match(html[status].textContent, /You can still play/)
	}
})

test("replacing speech or restarting a round ignores failures from the older utterance", async () => {
	for (const game of ["weekdays/weekdays-page.js", "picture_and_sound_quiz/picture-and-sound-quiz-page.js"]) {
		const { component, html, pendingSpeech } = fixture(game, "deferred")
		component.methods.listen(html)
		component.methods.listen(html)
		pendingSpeech[0].reject(new Error("interrupted"))
		await Promise.resolve()
		assert.equal(html.soundstatus.textContent, "")
		component.methods.restart(html)
		pendingSpeech[1].reject(new Error("canceled"))
		await Promise.resolve()
		assert.equal(html.soundstatus.textContent, "")
	}
})
