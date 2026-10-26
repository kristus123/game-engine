import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { TranspileContent } from "../transpiler/TranspileContent.js"

async function fixture(definition) {
	const file = new URL("../../frontend/ui/html/RegisterCustomWebComponent.js", import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
		.replace("export async function", "async function")
		.replace("await import(js)", "await loadModule(js)")
	let ElementClass
	class Element {
		childNodes = []
		attributes = []
		isConnected = false
		classList = { add() {} }
		replaceChildren() {}
		querySelectorAll() {
			return []
		}

		walk() {}
		remove() {
			this.isConnected = false
		}
	}
	const dependencies = {
		loadModule: async () => ({ default: definition }),
		document: { createElement: () => ({ content: { append() {}, cloneNode() {
			return {}
		} } }) },
		DOMParser: class {
			parseFromString() {
				return { body: { children: [] } }
			}
		},
		HTMLElement: Element,
		customElements: { define: (name, component) => ElementClass = component },
		CustomElementHelper: { createSetState: () => () => {}, exposeFields() {} },
		PromiseQueue: () => {
			let pending = Promise.resolve()
			return { add: callback => pending = pending.then(callback) }
		},
		IfCondition: { validate: Boolean },
		A: {
			method: value => typeof value == "function",
			promise: value => value != null && typeof value.then == "function",
			string: value => typeof value == "string",
			value: value => value != null,
		},
		Assert: {
			notNull: value => assert.notEqual(value, null),
			string: value => assert.equal(typeof value, "string"),
			value: value => assert.ok(value),
			object: value => assert.equal(Object.getPrototypeOf(value), Object.prototype),
			false: (value, message) => assert.ok(!value, message),
		},
	}
	const register = new Function(...Object.keys(dependencies), source + "\nreturn RegisterCustomWebComponent")(...Object.values(dependencies))
	await register("fields-example", "", definition ? "example.js" : null)
	return () => new ElementClass()
}

async function connect(element) {
	element.isConnected = true
	await element.connectedCallback()
}

async function disconnect(element) {
	element.isConnected = false
	await element.disconnectedCallback()
}

test("fields are available before connection and promises are independent per instance", async () => {
	let calls = 0
	const create = await fixture({
		fields: () => {
			calls += 1
			const chosen = Promise.withResolvers()
			return { chosen: chosen.promise, resolveChosen: chosen.resolve }
		},
	})
	assert.equal(calls, 0)
	const first = create()
	const second = create()
	assert.equal(calls, 2)
	assert.equal(first.isConnected, false)
	assert.equal(first.chosen, first.fields.chosen)
	assert.notEqual(first.chosen, second.chosen)
	first.resolveChosen("Eira")
	second.fields.resolveChosen("Liv")
	assert.equal(await first.chosen, "Eira")
	assert.equal(await second.chosen, "Liv")
	await connect(first)
	const fields = first.fields
	await disconnect(first)
	await connect(first)
	assert.equal(first.fields, fields)
	assert.equal(calls, 2)
})

test("DOM hooks receive their host and retain its original fields on reconnection", async () => {
	const events = []
	const create = await fixture({
		fields: () => ({ value: {} }),
		onDomAdd: async html => events.push(["add", html, html.fields]),
		onDomRemove: async html => events.push(["remove", html, html.fields]),
	})
	const element = create()
	const fields = element.fields
	assert.deepEqual(events, [])
	await connect(element)
	await disconnect(element)
	await connect(element)
	assert.deepEqual(events, [["add", element, fields], ["remove", element, fields], ["add", element, fields]])
})

test("object-style callbacks are bound to their component instance", async () => {
	const calls = []
	const create = await fixture({
		state: element => {
			calls.push(["state", element])
			return "ready"
		},
		methods: { save: (element, value) => calls.push(["method", element, value]) },
		onPageOpen: (element, value) => calls.push(["page", element, value]),
		onHoverShow: { info: (element, detail) => calls.push(["hover", element, detail]) },
	})
	const element = create()
	await connect(element)
	const options = await element.whenReady()
	options.methods.save("value")
	options.onPageOpen("open")
	options.onHoverShow.info("detail")
	assert.deepEqual(calls, [
		["state", element],
		["method", element, "value"],
		["page", element, "open"],
		["hover", element, "detail"],
	])
})

test("onFirstDomAdd runs once before onDomAdd while onDomAdd runs for every connection", async () => {
	const events = []
	const create = await fixture({
		onFirstDomAdd: async html => events.push(["first", html]),
		onDomAdd: async html => events.push(["add", html]),
		onDomRemove: async html => events.push(["remove", html]),
	})
	const element = create()
	assert.deepEqual(events, [])
	await connect(element)
	await disconnect(element)
	await connect(element)
	assert.deepEqual(events, [
		["first", element],
		["add", element],
		["remove", element],
		["add", element],
	])
})

test("field aliases preserve existing element properties and expose collisions through fields", async () => {
	const create = await fixture({ fields: () => ({ remove: "custom value", fields: "nested value" }) })
	const element = create()
	assert.equal(typeof element.remove, "function")
	assert.equal(element.fields.remove, "custom value")
	assert.equal(element.fields.fields, "nested value")
})

test("existing async setup functions run on connection and can still return fields", async () => {
	let calls = 0
	const create = await fixture(async ({ html, setState }) => {
		calls += 1
		assert.equal(html.isConnected, true)
		assert.equal(typeof setState, "function")
		return { fields: { value: calls } }
	})
	const element = create()
	assert.equal(calls, 0)
	assert.equal(element.fields, undefined)
	await connect(element)
	assert.equal(element.value, 1)
	assert.equal((await element.whenReady()).fields, element.fields)
	await disconnect(element)
	await connect(element)
	assert.equal(calls, 1)
})

test("legacy createFields factories remain available before async setup", async () => {
	const setup = async () => ({})
	setup.createFields = () => ({ value: {} })
	const create = await fixture(setup)
	const element = create()
	const fields = element.fields
	assert.equal(element.value, fields.value)
	await connect(element)
	assert.equal(element.fields, fields)
})

test("template-only components construct and connect without a paired module", async () => {
	const create = await fixture()
	const element = create()
	await connect(element)
	assert.deepEqual(await element.whenReady(), {})
})

test("async field factories fail clearly instead of exposing incomplete fields", async () => {
	const create = await fixture({ fields: async () => ({ value: 1 }) })
	assert.throws(create, /fields must be created synchronously/)
})
