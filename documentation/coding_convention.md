# Coding convention

- Imports are added automatically so you don't need to import stuff, also it will crash if you include imports inside of `client/`
- In every file, you can export one thing, and that one thing should have the same name as the file
- don't use `export default`
    - simply because that is how we have done it so far
- Frontend and backend JavaScript use `if condition {`, `else if condition {`, and `switch value {`. Keep each control-flow header on one line so the transpiler can restore standard JavaScript syntax. Shared JavaScript and files with `// disable-transpiling` use normal parentheses.
- `scripts/lint.sh` runs `node dev/ConvertControlFlowSyntax.js` after its standard formatters to convert one-line `if (...) {`, `else if (...) {`, and `switch (...) {` headers in frontend/backend source. Use `node dev/ConvertControlFlowSyntax.js --check` to report files without changing them.
- Switch blocks can use `case value {` and `default {`; the transpiler adds the colon and closing `break`.
- ´./scripts/lint.sh´ will take care of most of the coding convention
