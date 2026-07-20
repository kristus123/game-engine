import { AllImports } from "#root/AllImports.js"
const { Regex } = AllImports

function tabCount(str) {
	return (str.match(/\t/g) || []).length
}

export function ImproveSwitchCase(lines, i) {
	if (Regex.simple(lines[i], "switch * {")) {
		lines[i] = lines[i].replace(/switch\s+(.*?)\s*\{/, "switch ($1) {")
	}
	else if (Regex.simple(lines[i], "case * {")) {
		lines[i] = lines[i].replace(/case\s+(.*?)\s*\{/, "case $1: {")
	}
	else if (Regex.simple(lines[i], "default {")) {
		lines[i] = lines[i].replace(/default\s*\{/, "default: {")
	}

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