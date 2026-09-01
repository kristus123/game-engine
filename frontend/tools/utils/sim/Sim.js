async function retry(fn, attempts = 5, delay = 100) {
	let error

	for (let i = 0; i < attempts; i++) {
		try {
			return await fn()
		}
		catch (e) {
			error = e

			if (i < attempts - 1) {
				console.log(i)
				await new Promise(resolve => setTimeout(resolve, delay * 2))
			}
		}
	}

	throw error
}

export class Sim {
	static delay = 500
	static attempts = 5
	static retryDelay = 100

	static resolve(value) {
		return typeof value == "function" ? value() : value
	}

	static assertClickable(el) { // no-null-check
		if (!(el instanceof HTMLElement)) {
			throw new Error("Invalid element")
		}

		if (!el.isConnected) {
			throw new Error("Element is not in the DOM")
		}

		const style = getComputedStyle(el)
		const rect = el.getBoundingClientRect()

		if (style.display == "none" || style.visibility == "hidden" || style.pointerEvents == "none" || rect.width == 0 || rect.height == 0) {
			throw new Error("Element is not clickable")
		}

		if (el.disabled) {
			throw new Error("Element is disabled")
		}

		const points = [
			[rect.left + rect.width / 2, rect.top + rect.height / 2],
			[rect.left + rect.width * 0.25, rect.top + rect.height * 0.25],
			[rect.left + rect.width * 0.75, rect.top + rect.height * 0.25],
			[rect.left + rect.width * 0.25, rect.top + rect.height * 0.75],
			[rect.left + rect.width * 0.75, rect.top + rect.height * 0.75],
		]

		const clickable = points.some(([x, y]) => {
			const target = document.elementFromPoint(x, y)
			return target == el || el.contains(target)
		})

		if (!clickable) {
			throw new Error("Element is completely blocked")
		}
	}

	static async click(value) {
		return retry(async () => {
			const el = this.resolve(value)

			this.assertClickable(el)

			await new Promise(resolve => setTimeout(resolve, this.delay))

			el.click()
		}, this.attempts, this.retryDelay)
	}

	static async type(value, text) {
		return retry(async () => {
			const el = this.resolve(value)

			this.assertClickable(el)

			if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement)) {
				throw new Error("Element is not an input")
			}

			el.focus()

			for (const char of text) {
				await new Promise(resolve => setTimeout(resolve, this.delay / 4))

				el.value += char

				el.dispatchEvent(new InputEvent("input", {
					bubbles: true,
					inputType: "insertText",
					data: char,
				}))
			}

			el.dispatchEvent(new Event("change", {
				bubbles: true,
			}))
		}, this.attempts, this.retryDelay)
	}
}
