export class CustomElementHelper {

	static createSetState(element) {
		return newState => {
			Assert.value(newState)
			element.walk(child => {
				const showIf = child.getAttribute("show-if-state")
				if showIf {
					child.toggleAttribute("hidden", showIf != newState)
				}
			})
			return newState
		}
	}

	static exposeFields(element) {
		element.walk(child => {
			element[child.tag] = child // this one currently not removed by removeFields
			if child.hasAttribute("id") {
				const id = child.getAttribute("id")
				if id in element && element[id] != child {
					throw new Error(`Cannot expose id "${id}" on <${element.tag}>: the property already exists`)
				}
				element[id] = child
			}
		})
	}

	static removeFields(element) {
		// Only removes matching descendant ID fields; tag shortcuts, stale references, and module-added fields remain.
		element.walk(child => {
			const id = child.getAttribute("id")
			if id && element[id] == child {
				delete element[id]
			}
		})
	}

}
