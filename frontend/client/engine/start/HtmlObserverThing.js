export function HtmlObserverThing() {
	const process = (node) => {
		if (!(node instanceof HTMLElement)) {
			return
		}

		// do something
	}

	const walk = (node) => {
		process(node)

		for (const child of node.children) {
			walk(child)
		}
	}

	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				walk(node)
			}
		}
	})

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	})

	return {
		disconnect: () => observer.disconnect(),
	}
}
