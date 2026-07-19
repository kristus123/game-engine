import { AllImports } from "#root/AllImports.js"
const { Regex } = AllImports

function tabCount(str) {
	return (str.match(/\t/g) || []).length
}

export function ImproveIf(lines, i) {
	if (Regex.simple(lines[i], "if * {")) {
		const s = Regex.editIfMatch(lines[i],
			"if * {",
			"if (*) {")

		const tabs = "\t".repeat(tabCount(lines[i]))
		lines[i] = tabs + s
	}
}
