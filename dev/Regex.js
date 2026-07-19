export class Regex {

	static simple(str, pattern) {

		const regexPattern = pattern
			.split("*")
			.map(s => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
			.join(".*")

		return new RegExp("^" + regexPattern).test(str.trim())
	}

	static editIfMatch(text, pattern, replacement) {
		text = text.trim()

		const regex = new RegExp("^" + pattern.split("*")
			.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
			.join("(.*)") + "$")

		const match = text.match(regex)

		if (match) {
			return replacement.replace("*", match[1])
		}

		return text
	}

}
