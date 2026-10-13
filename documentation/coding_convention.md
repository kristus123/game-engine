# Coding convention

- Imports are added automatically so you don't need to import stuff, also it will crash if you include imports inside of `client/`
- In every file, you can export one thing, and that one thing should have the same name as the file
- don't use `export default`
    - simply because that is how we have done it so far
    - exception: web components use matching hyphenated `.html` and `.js` filenames; their JavaScript exports `export default async ({ html }) => { ... }`, with template IDs available on `html`
- Frontend and backend JavaScript use `if condition {`, `else if condition {`, `switch value {`, and parenthesis-free loops such as `for let i = 0; i < count; i++ {`, `for const item of items {`, `for const key in object {`, and `for await const chunk of stream {`. Keep each control-flow header on one line, ending with its opening `{` (optionally followed by a line comment), so the transpiler can restore standard JavaScript syntax. Shared JavaScript and files with `// disable-transpiling` use normal parentheses.
- `scripts/lint.sh` uses `dev/LintProject.js` to lint custom control-flow and case blocks as standard JavaScript in memory, then restores project syntax before writing fixes. It uses installed tools and caches unchanged source files and complete check results under `.cache/lint/`, skipping tool startup on unchanged runs. Source/configuration changes invalidate the relevant caches; cached errors are still displayed and return a nonzero exit status. Use `node dev/ConvertControlFlowSyntax.js --check` to report standard control-flow headers that need conversion without changing files.
- Switch blocks can use `case value {` and `default {`; the transpiler adds the colon and closing `break`.
- Run `node --test dev/tests/ControlFlowSyntaxChecks.js` to check control-flow conversion, loop errors, parameter detection, execution, and ESLint round trips.
- ´./scripts/lint.sh´ will take care of most of the coding convention
