export class CodeEditor {

	constructor() {
		const html = Dom.add(Html.codeEditor())

		const code = html.code

		const numberContent = document.getElementById("numberContent")

		let lines = [
			'const message = "Hello world";',
		]

		const selectedLines = new Set()

		let isDraggingLines = false
		let dragStartLine = null
		let dragCurrentLine = null

		const keywords = new Set([
			"const",
			"let",
			"var",
			"function",
			"return",
			"if",
			"else",
			"for",
			"while",
			"do",
			"new",
			"class",
			"extends",
			"import",
			"from",
			"export",
			"default",
			"async",
			"await",
			"throw",
			"try",
			"catch",
			"finally",
			"switch",
			"case",
			"break",
			"continue",
			"typeof",
			"instanceof",
			"in",
			"of"
		])

		const literals = new Set([
			"true",
			"false",
			"null",
			"undefined"
		])

		function escapeHTML(text) {
			return text
				.replaceAll("&", "&amp;")
				.replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;")
		}

		function highlight(text) {
			if (!text) {
				return ""
			}

			let result = ""
			let i = 0

			while (i < text.length) {
				if (
					text[i] === "/" &&
					text[i + 1] === "/"
				) {
					result += `<span class="comment">${escapeHTML(text.slice(i))}</span>`
					break
				}

				if (
					text[i] === '"' ||
					text[i] === "'" ||
					text[i] === "`"
				) {
					const quote = text[i]
					const start = i

					i++

					while (i < text.length) {
						if (text[i] === "\\") {
							i += 2
							continue
						}

						if (text[i] === quote) {
							i++
							break
						}

						i++
					}

					result += `<span class="string">${escapeHTML(text.slice(start, i))}</span>`
					continue
				}

				if (/[0-9]/.test(text[i])) {
					const start = i

					while (
						i < text.length &&
						/[0-9._]/.test(text[i])
					) {
						i++
					}

					result += `<span class="number">${escapeHTML(text.slice(start, i))}</span>`
					continue
				}

				if (/[A-Za-z_$]/.test(text[i])) {
					const start = i

					while (
						i < text.length &&
						/[\w$]/.test(text[i])
					) {
						i++
					}

					const word = text.slice(start, i)

					if (keywords.has(word)) {
						result += `<span class="keyword">${word}</span>`
					} else if (literals.has(word)) {
						result += `<span class="boolean">${word}</span>`
					} else if (text[i] === "(") {
						result += `<span class="function">${word}</span>`
					} else {
						result += escapeHTML(word)
					}

					continue
				}

				result += escapeHTML(text[i])
				i++
			}

			return result
		}

		function createLine(index) {
			const line = document.createElement("div")
			line.className = "line"

			if (selectedLines.has(index)) {
				line.classList.add("selected-line")
			}

			const highlightElement = document.createElement("div")
			highlightElement.className = "highlight"
			highlightElement.innerHTML = highlight(lines[index])

			const input = document.createElement("div")
			input.className = "input"
			input.contentEditable = "true"
			input.spellcheck = false
			input.textContent = lines[index]

			line.appendChild(highlightElement)
			line.appendChild(input)

			return line
		}

		function renderAll() {
			code.innerHTML = ""

			for (let i = 0; i < lines.length; i++) {
				code.appendChild(createLine(i))
			}

			updateLineNumbers()
		}

		function updateLineNumbers() {
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

		code.addEventListener("scroll", () => {
			numberContent.style.transform =
				`translateY(${-code.scrollTop}px)`
		})

		function updateSelectionVisuals() {
			code
				.querySelectorAll(".line")
				.forEach((line, index) => {
					line.classList.toggle(
						"selected-line",
						selectedLines.has(index)
					)
				})

			numberContent
				.querySelectorAll(".line-number")
				.forEach((number, index) => {
					number.classList.toggle(
						"selected",
						selectedLines.has(index)
					)
				})
		}

		function selectLineRange(start, end) {
			const first = Math.min(start, end)
			const last = Math.max(start, end)

			selectedLines.clear()

			for (let i = first; i <= last; i++) {
				selectedLines.add(i)
			}

			updateSelectionVisuals()
		}

		numberContent.addEventListener("mousedown", event => {
			const number = event.target.closest(".line-number")

			if (!number) {
				return
			}

			event.preventDefault()

			const index = Number(number.dataset.index)

			if (
				event.shiftKey &&
				selectedLines.size > 0
			) {
				const selected = [...selectedLines]
				const last = selected[selected.length - 1]

				selectLineRange(last, index)
				return
			}

			if (
				event.ctrlKey ||
				event.metaKey
			) {
				if (selectedLines.has(index)) {
					selectedLines.delete(index)
				} else {
					selectedLines.add(index)
				}

				updateSelectionVisuals()
				return
			}

			selectedLines.clear()
			selectedLines.add(index)

			updateSelectionVisuals()

			isDraggingLines = true
			dragStartLine = index
			dragCurrentLine = index
		})

		numberContent.addEventListener("mousemove", event => {
			if (!isDraggingLines) {
				return
			}

			const number = event.target.closest(".line-number")

			if (!number) {
				return
			}

			const index = Number(number.dataset.index)

			if (index === dragCurrentLine) {
				return
			}

			dragCurrentLine = index

			selectLineRange(
				dragStartLine,
				dragCurrentLine
			)
		})

		document.addEventListener("mouseup", () => {
			isDraggingLines = false
			dragStartLine = null
			dragCurrentLine = null
		})

		code.addEventListener("mousedown", event => {
			if (event.target.closest(".input")) {
				selectedLines.clear()
				updateSelectionVisuals()
			}
		})

		function getLine(input) {
			return input.closest(".line")
		}

		function getLineIndex(line) {
			return Array.from(code.children).indexOf(line)
		}

		function getCursorOffset(input) {
			const selection = window.getSelection()

			if (!selection.rangeCount) {
				return 0
			}

			const range = selection.getRangeAt(0)
			const pre = document.createRange()

			pre.selectNodeContents(input)

			pre.setEnd(
				range.startContainer,
				range.startOffset
			)

			return pre.toString().length
		}

		function setCursor(input, offset) {
			offset = Math.max(
				0,
				Math.min(
					offset,
					input.textContent.length
				)
			)

			const selection = window.getSelection()
			const range = document.createRange()

			if (input.firstChild) {
				range.setStart(
					input.firstChild,
					offset
				)
			} else {
				range.selectNodeContents(input)
				range.collapse(true)
			}

			range.collapse(true)

			selection.removeAllRanges()
			selection.addRange(range)

			input.focus()
		}

		function updateLine(index, cursor = null) {
			const line = code.children[index]

			if (!line) {
				return
			}

			const input = line.querySelector(".input")
			const highlightElement = line.querySelector(".highlight")

			lines[index] = input.textContent

			highlightElement.innerHTML =
				highlight(lines[index])

			if (cursor !== null) {
				setCursor(input, cursor)
			}
		}

		code.addEventListener("input", event => {
			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const line = getLine(input)
			const index = getLineIndex(line)
			const cursor = getCursorOffset(input)

			updateLine(index, cursor)
		})

		code.addEventListener("keydown", event => {
			if (event.key !== "Enter") {
				return
			}

			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			event.preventDefault()

			const line = getLine(input)
			const index = getLineIndex(line)
			const cursor = getCursorOffset(input)
			const current = lines[index]

			const before = current.slice(0, cursor)
			const after = current.slice(cursor)

			const indentation = before.match(/^\s*/)[0]

			const extra = before
				.trimEnd()
				.endsWith("{")
				? "    "
				: ""

			lines[index] = before

			lines.splice(
				index + 1,
				0,
				indentation + extra + after
			)

			const updatedSelection = new Set()

			for (const selected of selectedLines) {
				updatedSelection.add(
					selected <= index
						? selected
						: selected + 1
				)
			}

			selectedLines.clear()

			for (const selected of updatedSelection) {
				selectedLines.add(selected)
			}

			renderAll()

			setCursor(
				code.children[index + 1]
					.querySelector(".input"),
				indentation.length + extra.length
			)
		})

		code.addEventListener("keydown", event => {
			if (event.key !== "Backspace") {
				return
			}

			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const line = getLine(input)
			const index = getLineIndex(line)
			const cursor = getCursorOffset(input)
			const selection = window.getSelection()

			if (
				selection &&
				!selection.isCollapsed
			) {
				return
			}

			if (cursor > 0) {
				return
			}

			if (index === 0) {
				event.preventDefault()
				return
			}

			event.preventDefault()

			const previous = lines[index - 1]
			const current = lines[index]
			const newCursor = previous.length

			lines[index - 1] = previous + current

			lines.splice(index, 1)

			renderAll()

			setCursor(
				code.children[index - 1]
					.querySelector(".input"),
				newCursor
			)
		})

		code.addEventListener("keydown", event => {
			if (event.key !== "Delete") {
				return
			}

			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const line = getLine(input)
			const index = getLineIndex(line)
			const cursor = getCursorOffset(input)
			const selection = window.getSelection()

			if (
				selection &&
				!selection.isCollapsed
			) {
				return
			}

			if (cursor < lines[index].length) {
				return
			}

			if (index >= lines.length - 1) {
				event.preventDefault()
				return
			}

			event.preventDefault()

			const currentLength = lines[index].length

			lines[index] += lines[index + 1]

			lines.splice(index + 1, 1)

			renderAll()

			setCursor(
				code.children[index]
					.querySelector(".input"),
				currentLength
			)
		})

		code.addEventListener("keydown", event => {
			if (
				event.key !== "ArrowUp" &&
				event.key !== "ArrowDown"
			) {
				return
			}

			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const line = getLine(input)
			const index = getLineIndex(line)
			const cursor = getCursorOffset(input)

			const direction =
				event.key === "ArrowUp"
					? -1
					: 1

			const targetIndex = index + direction

			if (
				targetIndex < 0 ||
				targetIndex >= lines.length
			) {
				return
			}

			event.preventDefault()

			const target =
				code.children[targetIndex]
					.querySelector(".input")

			const targetCursor = Math.min(
				cursor,
				lines[targetIndex].length
			)

			setCursor(target, targetCursor)
		})

		code.addEventListener("keydown", event => {
			if (event.key !== "Tab") {
				return
			}

			event.preventDefault()
			event.stopPropagation()

			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const line = getLine(input)
			const index = getLineIndex(line)
			const cursor = getCursorOffset(input)
			const current = lines[index]

			if (event.shiftKey) {
				const before = current.slice(0, cursor)

				let remove = 0

				for (let i = 0; i < 4; i++) {
					if (
						before[
							before.length - 1 - i
						] === " "
					) {
						remove++
					} else {
						break
					}
				}

				if (remove === 0) {
					return
				}

				lines[index] =
					current.slice(0, cursor - remove) +
					current.slice(cursor)

				input.textContent = lines[index]

				updateLine(
					index,
					cursor - remove
				)

				return
			}

			const selection = window.getSelection()

			if (!selection.rangeCount) {
				return
			}

			const range = selection.getRangeAt(0)

			range.deleteContents()

			const textNode =
				document.createTextNode("    ")

			range.insertNode(textNode)

			range.setStartAfter(textNode)
			range.collapse(true)

			selection.removeAllRanges()
			selection.addRange(range)

			lines[index] = input.textContent

			const highlightElement =
				line.querySelector(".highlight")

			highlightElement.innerHTML =
				highlight(lines[index])
		})

		code.addEventListener("paste", event => {
			event.preventDefault()

			const input = event.target.closest(".input")

			if (!input) {
				return
			}

			const line = getLine(input)
			const index = getLineIndex(line)
			const cursor = getCursorOffset(input)

			const pasted =
				event.clipboardData
					.getData("text/plain")
					.replace(/\r\n/g, "\n")
					.replace(/\r/g, "\n")

			const parts = pasted.split("\n")

			if (parts.length === 1) {
				lines[index] =
					lines[index].slice(0, cursor) +
					parts[0] +
					lines[index].slice(cursor)

				updateLine(
					index,
					cursor + parts[0].length
				)

				return
			}

			const before = lines[index].slice(0, cursor)
			const after = lines[index].slice(cursor)

			const newLines = [
				before + parts[0],
				...parts.slice(1, -1),
				parts[parts.length - 1] + after
			]

			lines.splice(
				index,
				1,
				...newLines
			)

			renderAll()

			const finalIndex =
				index + newLines.length - 1

			setCursor(
				code.children[finalIndex]
					.querySelector(".input"),
				parts[parts.length - 1].length
			)
		})

		renderAll()

		setCursor(
			code.children[0]
				.querySelector(".input"),
			0
		)
				
			}
			
			update() {
				
			}
}
