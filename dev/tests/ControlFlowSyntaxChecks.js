import assert from "node:assert/strict"
import { test } from "node:test"
import { ESLint } from "eslint"
import { ConvertControlFlowSyntax } from "../ConvertControlFlowSyntax.js"
import { Parameters } from "../Parameters.js"
import { ImproveFor } from "../transpiler/ImproveFor.js"
import { TranspileContent } from "../transpiler/TranspileContent.js"

export function ControlFlowSyntaxChecks() {
	test("loop headers convert for both runtime and lint, preserving expressions and comments", () => {
		const headers = [
			"for let i = 0; i < limit; i++ {",
			"for ;; {",
			"for const item of items {",
			"for const key in object {",
			"for const [key, value] of Object.entries(object) {",
			"for const { name, value } of items {",
			"for const { name = choose({ value: 1 }) } of items {",
			"for const item of items.filter((value) => value.includes(\") {\")) {",
			"for const item of (await source).items {",
			"for await const chunk of stream { // received chunk",
		]
		for (const header of headers) {
			const custom = `\t${header}`
			const standard = ConvertControlFlowSyntax.forLint(custom)
			assert.equal(ConvertControlFlowSyntax.line(standard), custom)
			assert.equal(ConvertControlFlowSyntax.fromLint(standard), custom)
			for (const input of [custom, standard]) {
				const lines = [input]
				ImproveFor(lines, 0)
				assert.equal(lines[0], standard)
			}
		}
		assert.equal(ConvertControlFlowSyntax.line("for(let i = 0; i < 3; i++) {"), "for let i = 0; i < 3; i++ {")
	})

	test("loop headers require an opening brace on the same line", () => {
		for (const header of [
			"for const item of items",
			"for (const item of items)",
			"for (let i = 0;",
			"for (const c of make(10, () => ({",
			"for await const chunk of stream",
			"for (const item of items) run(item)",
			"for const item of items { run(item) }",
		]) {
			assert.throws(() => ImproveFor([header], 0), /Expected '\{' Here\. Only Single Line For Headers Are Allowed!/)
		}
		for (const line of ["// for const item of items", "const format = 'for something'", "format(value) {"]) {
			const lines = [line]
			ImproveFor(lines, 0)
			assert.equal(lines[0], line)
		}
	})

	test("calls within loop headers never become function parameters", () => {
		for (const header of [
			"for const item of values() {",
			"for await const item of values(argument) {",
			"for let i = 0; check(i); advance(i) {",
			"for(const item of values(argument)) {",
		]) {
			assert.equal(Parameters.extractIfPresent(header), null)
		}
		assert.deepEqual(Parameters.extractIfPresent("run(value) {"), { methodName: "run", parameters: ["value"] })
	})

	test("custom loops execute through the full transpiler alongside if and switch blocks", async () => {
		const source = [
			"export async function LoopExample() {",
			"\tconst result = []",
			"\tfor let i = 0; i < 3; i++ {",
			"\t\tif i > 0 {",
			"\t\t\tresult.push(i)",
			"\t\t}",
			"\t}",
			"\tfor const { value } of [{ value: 4 }] {",
			"\t\tresult.push(value)",
			"\t}",
			"\tfor const key in { name: true } {",
			"\t\tresult.push(key)",
			"\t}",
			"\tfor await const value of [Promise.resolve(5)] {",
			"\t\tresult.push(value)",
			"\t}",
			"\tswitch result.length {",
			"\t\tcase 5 {",
			"\t\t\tresult.push(6)",
			"\t\t}",
			"\t\tdefault {",
			"\t\t\tthrow new Error(\"Unexpected result\")",
			"\t\t}",
			"\t}",
			"\treturn result",
			"}",
		].join("\n")
		const generated = TranspileContent("LoopExample.js", source, [])
		assert.equal(generated.includes("Assert.notNull"), false)
		const condition = { validate(value) {
			assert.equal(typeof value, "boolean")
			return value
		} }
		const execute = new Function("IfCondition", generated.replace("export ", "") + "\nreturn LoopExample()")
		assert.deepEqual(await execute(condition), [1, 2, 4, "name", 5, 6])
		const disabled = "// disable-transpiling\nfor (const item of items) run(item)"
		assert.equal(TranspileContent("Disabled.js", disabled, []), disabled)
	})

	test("ESLint fixes custom loop bodies and restores parenthesis-free headers", async () => {
		const eslint = new ESLint({ fix: true })
		const source = [
			"export async function LintLoops(items, stream) {",
			"\tfor const { value } of items { // comment",
			"\t\tconsole.log(value);",
			"\t}",
			"\tfor const [a, b, c] of items {",
			"\t\tconsole.log(a, b, c);",
			"\t}",
			"\tfor await const chunk of stream {",
			"\t\tconsole.log(chunk);",
			"\t}",
			"}",
		].join("\n")
		const [result] = await eslint.lintText(ConvertControlFlowSyntax.forLint(source), { filePath: "frontend/LintLoops.js" })
		assert.equal(result.errorCount, 0, JSON.stringify(result.messages))
		const restored = ConvertControlFlowSyntax.fromLint(result.output)
		assert.equal(restored, source.replaceAll(";", ""))
		const [malformed] = await eslint.lintText(ConvertControlFlowSyntax.forLint("for const item of items\n\tconsole.log(item)"), { filePath: "frontend/LintLoops.js" })
		assert.equal(malformed.fatalErrorCount, 1)
	})
}

ControlFlowSyntaxChecks()
