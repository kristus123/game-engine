import { mapToString } from "./mapToString.js"

export function TurnResultToStringValue(result) {
	const seen = new WeakMap()
	let nextReference = 1

	function recurse(value) {
		if (value !== null && (typeof value == "object" || typeof value == "function")) {
			if (seen.has(value)) {
				return `Reference(#${seen.get(value)})`
			}

			seen.set(value, nextReference++)
			return `#${seen.get(value)} ${mapToString(value, recurse)}`
		}

		return mapToString(value, recurse)
	}

	try {
		return recurse(result)
	}
	catch (error) {
		if (error.message?.includes("UNSURE_HOW_TO_MAP_TO_STRING")) {
			throw error
		}

		throw new TypeError(`UNSURE_HOW_TO_MAP_TO_STRING: ${error.message}`, { cause: error })
	}
}
