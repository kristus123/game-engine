export class CodeEditor {

	constructor() {
		const html = Dom.add(Html.codeEditor())

		const code = html.code
		const numberContent = document.getElementById("numberContent")

		const lines = [
			"const message = \"Hello world\";",
		]

		function emitInput() {
			console.log(lines.join("\n"))
		}

		function getLineIndex(input) {
			return [...code.children].indexOf(input.parentElement)
		}

		function getCursor(input) {
			const selection = window.getSelection()

			if (!selection.rangeCount) {
				return 0
			}

			const range = selection.getRangeAt(0)
			const pre = document.createRange()

			pre.selectNodeContents(input)
			pre.setEnd(range.startContainer, range.startOffset)

			return pre.toString().length
		}

		function setCursor(input, offset) {
			const range = document.createRange()
			const selection = window.getSelection()

			offset = Math.max(
				0,
				Math.min(offset, input.textContent.length)
			)

			if (input.firstChild) {
				range.setStart(input.firstChild, offset)
			}
			else {
				range.selectNodeContents(input)
				range.collapse(true)
			}

			range.collapse(true)

			selection.removeAllRanges()
			selection.addRange(range)

			input.focus()
		}

		function createLine(text, index) {
			const line = document.createElement("div")
			line.className = "line"

			const input = document.createElement("div")
			input.className = "input"
			input.contentEditable = "true"
			input.spellcheck = false
			input.textContent = text

			line.appendChild(input)

			const number = document.createElement("div")
			number.className = "line-number"
			number.dataset.index = index
			number.textContent = index + 1

			numberContent.appendChild(number)
			code.appendChild(line)

			return input
		}

		function updateLineNumbers() {
			numberContent.querySelectorAll(".line-number").forEach((number, index) => {
				number.dataset.index = index
				number.textContent = index + 1
			})
		}

		function insertLine(index, text) {
			lines.splice(index, 0, text)

			const line = document.createElement("div")
			line.className = "line"

			const input = document.createElement("div")
			input.className = "input"
			input.contentEditable = "true"
			input.spellcheck = false
			input.textContent = text

			line.appendChild(input)

			const number = document.createElement("div")
			number.className = "line-number"
			number.dataset.index = index
			number.textContent = index + 1

			const referenceLine = code.children[index]

			if (referenceLine) {
				code.insertBefore(line, referenceLine)
			}
			else {
				code.appendChild(line)
			}

			const referenceNumber = numberContent.children[index]

			if (referenceNumber) {
				numberContent.insertBefore(number, referenceNumber)
			}
			else {
				numberContent.appendChild(number)
			}

			updateLineNumbers()

			return input
		}

		function removeLine(index) {
			lines.splice(index, 1)

			code.children[index].remove()
			numberContent.children[index].remove()

			updateLineNumbers()
		}

		code.addEventListener("scroll", () => {
			numberContent.style.transform =
				`translateY(${-code.scrollTop}px)`
		})

		code.addEventListener("input", event => {
			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const index = getLineIndex(input)

			lines[index] = input.textContent

			emitInput()
		})

		code.addEventListener("keydown", event => {
			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const index = getLineIndex(input)
			const cursor = getCursor(input)

			if (event.key == "Enter") {
				event.preventDefault()

				const before = lines[index].slice(0, cursor)
				const after = lines[index].slice(cursor)

				const indentation =
					before.match(/^\s*/)[0]

				const extra =
					before.trimEnd().endsWith("{")
						? "    "
						: ""

				lines[index] = before
				input.textContent = before

				const newInput = insertLine(
					index + 1,
					indentation + extra + after
				)

				setCursor(
					newInput,
					indentation.length + extra.length
				)

				emitInput()

				return
			}

			if (event.key == "Backspace") {
				if (cursor != 0 || index == 0) {
					return
				}

				event.preventDefault()

				const previousInput =
					code.children[index - 1].querySelector(".input")

				const previous = lines[index - 1]

				lines[index - 1] =
					previous + lines[index]

				previousInput.textContent =
					lines[index - 1]

				removeLine(index)

				setCursor(
					previousInput,
					previous.length
				)

				emitInput()

				return
			}

			if (event.key == "Delete") {
				if (
					cursor < lines[index].length ||
					index == lines.length - 1
				) {
					return
				}

				event.preventDefault()

				const length = lines[index].length

				lines[index] += lines[index + 1]
				input.textContent = lines[index]

				removeLine(index + 1)

				setCursor(input, length)

				emitInput()

				return
			}

			if (
				event.key == "ArrowUp" ||
				event.key == "ArrowDown"
			) {
				const direction =
					event.key == "ArrowUp" ? -1 : 1

				const targetIndex = index + direction

				if (
					targetIndex < 0 ||
					targetIndex >= lines.length
				) {
					return
				}

				event.preventDefault()

				setCursor(
					code.children[targetIndex].querySelector(".input"),
					Math.min(
						cursor,
						lines[targetIndex].length
					)
				)

				return
			}

			if (event.key == "Tab") {
				event.preventDefault()

				if (event.shiftKey) {
					const before = lines[index].slice(0, cursor)

					const remove = Math.min(
						4,
						(before.match(/ *$/) || [""])[0].length
					)

					if (!remove) {
						return
					}

					lines[index] =
						lines[index].slice(0, cursor - remove) +
						lines[index].slice(cursor)

					input.textContent = lines[index]

					setCursor(input, cursor - remove)

					emitInput()

					return
				}

				const selection = window.getSelection()

				if (!selection.rangeCount) {
					return
				}

				const range = selection.getRangeAt(0)
				const text = document.createTextNode("    ")

				range.deleteContents()
				range.insertNode(text)
				range.setStartAfter(text)
				range.collapse(true)

				selection.removeAllRanges()
				selection.addRange(range)

				lines[index] = input.textContent

				emitInput()

				return
			}
		})

		code.addEventListener("paste", event => {
			event.preventDefault()

			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const index = getLineIndex(input)
			const cursor = getCursor(input)

			const pasted = event.clipboardData
				.getData("text/plain")
				.replace(/\r\n/g, "\n")
				.replace(/\r/g, "\n")

			const parts = pasted.split("\n")

			if (parts.length == 1) {
				lines[index] =
					lines[index].slice(0, cursor) +
					parts[0] +
					lines[index].slice(cursor)

				input.textContent = lines[index]

				setCursor(
					input,
					cursor + parts[0].length
				)

				emitInput()

				return
			}

			const before = lines[index].slice(0, cursor)
			const after = lines[index].slice(cursor)

			lines[index] = before + parts[0]
			input.textContent = lines[index]

			for (let i = 1; i < parts.length; i++) {
				const text =
					i == parts.length - 1
						? parts[i] + after
						: parts[i]

				insertLine(index + i, text)
			}

			const finalIndex =
				index + parts.length - 1

			const finalInput =
				code.children[finalIndex].querySelector(".input")

			setCursor(
				finalInput,
				parts.at(-1).length
			)

			emitInput()
		})

		createLine(lines[0], 0)

		setCursor(code.children[0].querySelector(".input"), 0)
	}

	update() {

	}
}
