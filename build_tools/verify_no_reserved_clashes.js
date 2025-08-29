const jsFiles = require('./js_files')


const reserved = [
  // Keywords
  "break","case","catch","class","const","continue","debugger","default",
  "delete","do","else","export","extends","finally","for","function","if",
  "import","in","instanceof","new","return","super","switch","this","throw",
  "try","typeof","var","void","while","with","yield",

  // Future reserved + strict
  "enum","await","implements","interface","let","package","private",
  "protected","public","static",

  // Literals
  "null","true","false",

  // Global objects (ECMA-262 Annex B + current ES spec)
  "globalThis","Infinity","NaN","undefined",
  "eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent",
  "encodeURI","encodeURIComponent","escape","unescape",

  // Fundamental objects
  "Object","Function","Boolean","Symbol","Error","AggregateError","EvalError",
  "InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError",

  // Numbers and dates
  "Number","BigInt","Math","Date",

  // Text processing
  "String","RegExp",

  // Indexed collections
  "Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array",
  "Int32Array","Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array",

  // Keyed collections
  "Map","Set","WeakMap","WeakSet",

  // Structured data
  "ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON",

  // Control abstraction objects
  "Promise","Generator","GeneratorFunction","AsyncFunction","AsyncGenerator",
  "AsyncGeneratorFunction",

  // Reflection
  "Reflect","Proxy",

  // Internationalization
  "Intl","Intl.Collator","Intl.DateTimeFormat","Intl.ListFormat","Intl.NumberFormat",
  "Intl.PluralRules","Intl.RelativeTimeFormat","Intl.Locale","Intl.DisplayNames",
  "Intl.Segmenter",

  // Web-compatible globals (commonly present in browsers)
  "console","performance","queueMicrotask","setTimeout","clearTimeout",
  "setInterval","clearInterval","structuredClone"

].map(w => w.toLowerCase()) // better safe and strict than sorry and loosey goosey

for (const file of jsFiles) {
	let name = file.split('/').pop().replace('.js', '')

	name = name.toLowerCase() // strict !

	if (reserved.includes(name)) {
		throw new Error(`${file} can not be named as such, because it clashes with reserved js keywords`)
	}
}
