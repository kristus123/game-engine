export function HtmlObserverThing(onNewNodeAdded) {
	const walk = (node) => {
		if (node instanceof HTMLElement) {
			onNewNodeAdded(node)
		}

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
