export function HtmlObserverThing() {
	const process = (e) => {
		if (e.hasAttribute("offset-x")) {
			e.style.setProperty("--offset-x", e.getAttribute("offset-x"))
		}

		if (e.hasAttribute("offset-y")) {
			e.style.setProperty("--offset-y", e.getAttribute("offset-y"))
		}
	}

	const observer = new MutationObserver(mutations => {
		const nodes = []
		for (const mutation of mutations) {
			for (const n of mutation.addedNodes) {
				nodes.push(n)
			}
		}

		for (const node of nodes) {
			process(node)
			for (const subNode of node.querySelectorAll("[offset-x], [offset-y]")) {
				process(subNode)
			}
		}
	})

	observer.observe(document.body, { childList: true, subtree: true })
}
