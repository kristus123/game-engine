import { AllImports } from "#root/AllImports.js"
const { Regex } = AllImports

function tabCount(str) {
	return (str.match(/\t/g) || []).length
}

export function ImproveSwitchCase(lines, i) {
	if (Regex.simple(lines[i], "case *:") || Regex.simple(lines[i], "default:")) {
		const tabs = tabCount(lines[i])

		for (let ii = 1 ; true ; ii++) {
			if (tabs == tabCount(lines[i+ii])) {
				lines[i+ii] = "break // transpiler" + "\n" + lines[i+ii]
				break
			}
		}
	}
}
