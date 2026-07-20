import { AllImports } from "#root/AllImports.js"
const { Regex } = AllImports

function tabCount(str) {
	return (str.match(/\t/g) || []).length
}

export function ImproveSwitchCase(lines, i) {
	// if (Regex.simple(lines[i], "case *:") || Regex.simple(lines[i], "default:")) {
	// 	for (let ii = 1 ; true ; ii++) {
	// 		if (tabCount(lines[i]) == tabCount(lines[i+ii])) {
	// 			lines[i+ii] = "break // transpiler" + "\n" + lines[i+ii]
	// 			break
	// 		}
	// 	}
	// }

	if (Regex.simple(lines[i], "switch * {")) {

		const s = Regex.editIfMatch(lines[i], "switch * {", "switch (*) {")

		lines[i] = "\t".repeat(tabCount(lines[i])) + s

		let defaultBlockPresent = false
		let endLineNumber = false
		for (let ii = 1 ; true ; ii++) {
			if (lines[i+ii].trim().startsWith("default")) {
				defaultBlockPresent = true
				console.log("defaultBlockPresent true")
			}

			if (tabCount(lines[i]) != tabCount(lines[i+ii])) {
				console.log(lines[i+ii])
			}
			else {
				if (!defaultBlockPresent) {
					const tt = "\t".repeat(tabCount(lines[i+ii]+1))
					lines[i+ii] = ""
						+ "\n" + tt + "\tdefault: { throw new Error(\"include a default block or catch all potential things\") }" + "\n"
						+ tt + "}"
				}

				break
			}
		}

	}

	if (Regex.simple(lines[i], "case * {")) {
		console.log("match")

		if (!Regex.simple(lines[i], "case *: {")) {
			const s = Regex.editIfMatch(lines[i], "case * {", "case *: {")
			lines[i] = "\t".repeat(tabCount(lines[i])) + s
		}

		for (let ii = 1 ; true ; ii++) {
			if (tabCount(lines[i]) != tabCount(lines[i+ii])) {
			}
			else {
				lines[i+ii] = "\t".repeat(tabCount(lines[i])+1) + "break // auto added by transpiler" + "\n" + lines[i+ii]
				break
			}
		}

	}

}