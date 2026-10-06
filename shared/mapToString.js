export function mapToString(value, recurse = null) {
	if (!recurse) {
		const seen = new WeakMap()
		let nextReference = 1

		function visit(child) {
			if (child !== null && (typeof child == "object" || typeof child == "function")) {
				if (seen.has(child)) {
					return `Reference(#${seen.get(child)})`
				}

				seen.set(child, nextReference++)
				return `#${seen.get(child)} ${mapToString(child, visit)}`
			}

			return mapToString(child, visit)
		}

		return visit(value)
	}

	if (value === undefined) {
		return "undefined"
	}

	if (value === null) {
		return "null"
	}

	if (typeof value == "string") {
		return JSON.stringify(value)
	}

	if (typeof value == "number") {
		if (Number.isNaN(value)) {
			return "NaN"
		}
		if (value == Infinity) {
			return "Infinity"
		}
		if (value == -Infinity) {
			return "-Infinity"
		}
		if (Object.is(value, -0)) {
			return "-0"
		}
		return String(value)
	}

	if (typeof value == "boolean") {
		return String(value)
	}

	if (typeof value == "bigint") {
		return `${value}n`
	}

	if (typeof value == "symbol") {
		const key = Symbol.keyFor(value)
		return key === undefined
			? `Symbol(${value.description ?? ""})`
			: `Symbol.for(${JSON.stringify(key)})`
	}

	if (typeof value == "function") {
		if (/^class\s/.test(Function.prototype.toString.call(value))) {
			const properties = mapOwnProperties(value, recurse, new Set(["length", "name", "prototype", "caller", "arguments"]))
			return `Class(${value.name || "anonymous"}){${properties}}`
		}

		return `Function(${value.name || "anonymous"}/${value.length})`
	}

	if (value instanceof WeakMap || value instanceof WeakSet || (typeof WeakRef == "function" && value instanceof WeakRef)) {
		throw new TypeError(`UNSURE_HOW_TO_MAP_TO_STRING: ${value.constructor?.name ?? "weak collection"}`)
	}

	if (value instanceof Date) {
		return `Date(${Number.isNaN(value.getTime()) ? "Invalid Date" : value.toISOString()})`
	}

	if (value instanceof RegExp) {
		return `RegExp(${JSON.stringify(value.source)}, ${JSON.stringify(value.flags)}, lastIndex=${value.lastIndex})`
	}

	if (value instanceof Error) {
		const cause = Object.hasOwn(value, "cause") ? `, cause=${recurse(value.cause)}` : ""
		const extras = mapOwnProperties(value, recurse, new Set(["name", "message", "stack", "cause"]))
		return `${value.name}(${JSON.stringify(value.message)}${cause}${extras ? `, ${extras}` : ""})`
	}

	if (value instanceof Map) {
		return `Map{${[...value].map(([key, item]) => `${recurse(key)} => ${recurse(item)}`).join(", ")}}`
	}

	if (value instanceof Set) {
		return `Set{${[...value].map(recurse).join(", ")}}`
	}

	if (value instanceof Promise) {
		throw new TypeError("UNSURE_HOW_TO_MAP_TO_STRING: Promise")
	}

	if (ArrayBuffer.isView(value)) {
		if (value instanceof DataView) {
			return `DataView[${Array.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)).join(", ")}]`
		}

		return `${value.constructor.name}[${Array.from(value, recurse).join(", ")}]`
	}

	if (value instanceof ArrayBuffer) {
		return `ArrayBuffer[${Array.from(new Uint8Array(value)).join(", ")}]`
	}

	if (typeof SharedArrayBuffer == "function" && value instanceof SharedArrayBuffer) {
		return `SharedArrayBuffer[${Array.from(new Uint8Array(value)).join(", ")}]`
	}

	if (typeof URL == "function" && value instanceof URL) {
		return `URL(${JSON.stringify(value.href)})`
	}

	if (typeof URLSearchParams == "function" && value instanceof URLSearchParams) {
		return `URLSearchParams(${JSON.stringify(value.toString())})`
	}

	if (Array.isArray(value)) {
		const items = Array.from({ length: value.length }, (_, index) => {
			return Object.hasOwn(value, index) ? recurse(value[index]) : "<empty>"
		})
		const extras = mapOwnProperties(value, recurse, new Set(["length", ...Array.from({ length: value.length }, (_, index) => String(index))]))
		return `[${items.join(", ")}]${extras ? `{${extras}}` : ""}`
	}

	if (typeof Node == "function" && value instanceof Node) {
		if (value instanceof Element) {
			const id = value.id ? `#${value.id}` : ""
			const className = typeof value.className == "string" && value.className ? `.${value.className.trim().replaceAll(/\s+/g, ".")}` : ""
			const text = value.textContent?.trim().slice(0, 100) ?? ""
			return `DOM<${value.tagName.toLowerCase()}${id}${className}>(${JSON.stringify(text)})`
		}

		return `DOM<${value.constructor?.name ?? "Node"}>(${JSON.stringify(value.textContent?.trim().slice(0, 100) ?? "")})`
	}

	if (typeof value == "object") {
		const prototype = Object.getPrototypeOf(value)
		const constructor = prototype && Object.getOwnPropertyDescriptor(prototype, "constructor")?.value
		const name = typeof constructor == "function" && constructor.name ? constructor.name : "Object"
		const properties = mapOwnProperties(value, recurse)
		return `${name}${prototype === null ? "<null prototype>" : ""}{${properties}}`
	}

	throw new TypeError(`UNSURE_HOW_TO_MAP_TO_STRING: ${typeof value}`)
}

function mapOwnProperties(value, recurse, excluded = new Set()) {
	const entries = Reflect.ownKeys(value)
		.filter(key => !excluded.has(key))
		.map(key => {
			const keyString = typeof key == "symbol"
				? `[${String(key)}]`
				: JSON.stringify(key)
			const descriptor = Object.getOwnPropertyDescriptor(value, key)

			if (!descriptor) {
				return [keyString, "<missing>"]
			}

			if (Object.hasOwn(descriptor, "value")) {
				return [keyString, recurse(descriptor.value)]
			}

			const getter = descriptor.get ? "get" : ""
			const setter = descriptor.set ? "set" : ""
			return [keyString, `<${getter}${getter && setter ? "/" : ""}${setter}>`]
		})
		.sort(([first], [second]) => first < second ? -1 : first > second ? 1 : 0)

	return entries.map(([key, item]) => `${key}: ${item}`).join(", ")
}
