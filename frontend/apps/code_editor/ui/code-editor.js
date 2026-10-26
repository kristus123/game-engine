function renderCode(html, text) {
	html.lines.clearChildren()

	for const [i, line] of text.split("\n").entries() {
		html.lines.add(H.create("code-line", {
			slots: {
				line: i+1,
				text: line,
			},
		}))
	}
}

function getCode(html) {
	let code = ""

		for const line of html.lines.children {
		code += line.getId("code").textContent + "\n"
	}

	return code
}

export default {
	onFirstDomAdd: (html) => {
		renderCode(html, TestFile)
		console.log(getCode(html))
	},
	methods: {
		micButton: async (html) => {
			if Mic.idle {
				Mic.start()
				html.mic.content = "Stop"
			}
			else {
				const blob = await Mic.stop()
				console.log(await blob)
				const text = await Transcribe(blob.toWav())

				console.log(getCode(html))
				const newCode = await Gpt(`
						- You are a helpful and intelligent voice-driven code editor
						- You are only editing a single file
						- you only respond with code, but without the triple tick markdown syntax.
						- I will use "git diff", so keep changes small.

						prompt:
							${text}

						code:
							${getCode(html)}
					`) // .dedent() is buggy so currently not using it

				renderCode(html, newCode)
				html.mic.content = "Start"
			}
		},
	},
}
