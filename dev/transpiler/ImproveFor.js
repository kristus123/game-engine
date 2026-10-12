import { ConvertControlFlowSyntax } from "../ConvertControlFlowSyntax.js"

export function ImproveFor(lines, i) {
	if (!/^\s*for\b/.test(lines[i])) {
		return
	}

	const source = ConvertControlFlowSyntax.line(lines[i])
	const header = source.match(/^(\s*)(for(?:\s+await)?)\s+(.+?)\s*\{(\s*(?:\/\/.*)?)$/)
	const parenthesized = lines[i].match(/^\s*for(?:\s+await)?\s*\(/)
	const unclosed = parenthesized != null && ConvertControlFlowSyntax.matchingParenthesis(lines[i], parenthesized[0].lastIndexOf("(")) == -1
	if (header == null || unclosed) {
		throw new Error(lines[i] + " <--- Expected '{' Here. Only Single Line For Headers Are Allowed!")
	}

	const [, indent,
		keyword,
		condition,
		comment] = header
	lines[i] = `${indent}${keyword} (${condition}) {${comment}`
}
