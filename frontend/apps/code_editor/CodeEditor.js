export class CodeEditor {

	constructor() {
		const onInput = (i) => {
			console.log(i)
		}
		const html = Dom.add(Html.codeEditor())

		const code = html.code
		const numberContent = document.getElementById("numberContent")

		let lines = [
			'const message = "Hello world";',
		]

		const selectedLines = new Set()

		let dragging = false
		let dragStart = null

		function getContent() {
			return lines.join("\n")
		}

		function emitInput() {
			onInput?.(getContent())
		}

		function getLine(input) {
			return input.parentElement
		}

		function getLineIndex(input) {
			return [...code.children].indexOf(getLine(input))
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
			} else {
				range.selectNodeContents(input)
				range.collapse(true)
			}

			range.collapse(true)

			selection.removeAllRanges()
			selection.addRange(range)

			input.focus()
		}

		function createLine(index) {
			const line = document.createElement("div")
			line.className = "line"

			if (selectedLines.has(index)) {
				line.classList.add("selected-line")
			}

			const input = document.createElement("div")
			input.className = "input"
			input.contentEditable = "true"
			input.spellcheck = false
			input.textContent = lines[index]

			line.appendChild(input)

			return line
		}

		function render() {
			code.innerHTML = ""

			for (let i = 0; i < lines.length; i++) {
				code.appendChild(createLine(i))
			}

			numberContent.innerHTML = ""

			for (let i = 0; i < lines.length; i++) {
				const number = document.createElement("div")

				number.className = "line-number"
				number.dataset.index = i
				number.textContent = i + 1

				if (selectedLines.has(i)) {
					number.classList.add("selected")
				}

				numberContent.appendChild(number)
			}
		}

		function updateSelection() {
			code.querySelectorAll(".line").forEach((line, i) => {
				line.classList.toggle(
					"selected-line",
					selectedLines.has(i)
				)
			})

			numberContent.querySelectorAll(".line-number").forEach((number, i) => {
				number.classList.toggle(
					"selected",
					selectedLines.has(i)
				)
			})
		}

		function selectRange(a, b) {
			selectedLines.clear()

			const start = Math.min(a, b)
			const end = Math.max(a, b)

			for (let i = start; i <= end; i++) {
				selectedLines.add(i)
			}

			updateSelection()
		}

		code.addEventListener("scroll", () => {
			numberContent.style.transform =
				`translateY(${-code.scrollTop}px)`
		})

		numberContent.addEventListener("mousedown", event => {
			const number = event.target.closest(".line-number")

			if (!number) {
				return
			}

			event.preventDefault()

			const index = Number(number.dataset.index)

			if (event.shiftKey && selectedLines.size) {
				selectRange(
					[...selectedLines].at(-1),
					index
				)
				return
			}

			if (event.ctrlKey || event.metaKey) {
				selectedLines.has(index)
					? selectedLines.delete(index)
					: selectedLines.add(index)

				updateSelection()
				return
			}

			selectedLines.clear()
			selectedLines.add(index)

			updateSelection()

			dragging = true
			dragStart = index
		})

		numberContent.addEventListener("mousemove", event => {
			if (!dragging) {
				return
			}

			const number = event.target.closest(".line-number")

			if (!number) {
				return
			}

			selectRange(
				dragStart,
				Number(number.dataset.index)
			)
		})

		document.addEventListener("mouseup", () => {
			dragging = false
			dragStart = null
		})

		code.addEventListener("mousedown", event => {
			if (event.target.closest(".input")) {
				selectedLines.clear()
				updateSelection()
			}
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

			if (event.key === "Enter") {
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

				lines.splice(
					index + 1,
					0,
					indentation + extra + after
				)

				render()

				setCursor(
					code.children[index + 1].querySelector(".input"),
					indentation.length + extra.length
				)

				emitInput()

				return
			}

			if (event.key === "Backspace") {
				if (cursor !== 0 || index === 0) {
					return
				}

				event.preventDefault()

				const previous = lines[index - 1]

				lines[index - 1] =
					previous + lines[index]

				lines.splice(index, 1)

				render()

				setCursor(
					code.children[index - 1].querySelector(".input"),
					previous.length
				)

				emitInput()

				return
			}

			if (event.key === "Delete") {
				if (
					cursor < lines[index].length ||
					index === lines.length - 1
				) {
					return
				}

				event.preventDefault()

				const length = lines[index].length

				lines[index] += lines[index + 1]
				lines.splice(index + 1, 1)

				render()

				setCursor(
					code.children[index].querySelector(".input"),
					length
				)

				emitInput()

				return
			}

			if (
				event.key === "ArrowUp" ||
				event.key === "ArrowDown"
			) {
				const direction =
					event.key === "ArrowUp" ? -1 : 1

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

			if (event.key === "Tab") {
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

			if (parts.length === 1) {
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

			lines.splice(
				index,
				1,
				before + parts[0],
				...parts.slice(1, -1),
				parts.at(-1) + after
			)

			render()

			const finalIndex =
				index + parts.length - 1

			setCursor(
				code.children[finalIndex].querySelector(".input"),
				parts.at(-1).length
			)

			emitInput()
		})

		render()

		setCursor(
			code.children[0].querySelector(".input"),
			0
		)
	}

	update() {

	}
}
