export class Regex {

	static simple(str, pattern) {

		const regexPattern = pattern
			.split("*")
			.map(s => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
			.join(".*")

		return new RegExp("^" + regexPattern).test(str.trim())
	}
}
