import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function fixture(options = {}) {
	const file = new URL("../../frontend/ui/page/Page.js", import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
	const events = []
	const created = []
	const runtimeAssert = {
		notNull: value => assert.notEqual(value, null),
		string: value => assert.equal(typeof value, "string"),
		object: value => assert.equal(typeof value, "object"),
		bool: value => assert.equal(typeof value, "boolean"),
		method: value => assert.equal(typeof value, "function"),
		true: (value, message) => assert.ok(value, message),
		false: (value, message) => assert.ok(!value, message),
		value: value => assert.ok(value),
	}
	let Page
	Page = runInNewContext(`
		Object.defineProperties(Object.prototype, {
			assertKeyPresent: { value(key) { Assert.true(Object.hasOwn(this, key)) } },
			assertKeyMissing: { value(key) { Assert.true(!Object.hasOwn(this, key)) } },
		})
		${source.replace("export class", "class")}
		Page
	`, {
		Assert: runtimeAssert,
		SuperClass: class {},
		IfCondition: { validate: Boolean },
		customElements: { get: name => name.endsWith("-page") },
		H: { create: tag => {
			const page = {
				tag,
				isConnected: false,
				whenReady: () => page.ready,
				remove: () => {
					page.isConnected = false
				},
			}
			created.push(page)
			return page
		} },
		Dom: { add: page => {
			page.isConnected = true
			page.ready ??= Promise.resolve().then(() => ({
				assertKeyPresent(key) {
					assert.ok(Object.hasOwn(this, key))
				},
				onOpen: async () => {
					events.push(page.tag + ":open")
				},
				onClose: async () => {
					events.push(page.tag + ":close")
				},
				onToggle: async state => {
					events.push(page.tag + ":" + state + ":toggle")
				},
				...options,
			}))
		} },
	})
	for (const tag of ["hub-page", "game-page"]) {
		Page.init(tag, { persistOnClose: tag == "hub-page", assertKeyPresent() {} })
	}
	return { Page, events, created }
}

test("page records retain callbacks and persistent elements across navigation", async () => {
	const { Page, events, created } = fixture()
	await assert.rejects(Page.close())
	await Page.open("hub-page")
	const hub = Page.active.page
	assert.equal(Page.activeTag, "hub-page")
	assert.equal(Page.active, Page.pages["hub-page"])
	assert.equal(Page.pages["hub-page"].page, hub)
	assert.equal(hub.onOpen, undefined)
	await assert.rejects(Page.open("hub-page"), /same twice/)
	await Page.open("game-page")
	await Page.open("hub-page")
	assert.equal(Page.active.page, hub)
	assert.equal(created.length, 2)
	assert.deepEqual(events, [
		"hub-page:open",
		"hub-page:open:toggle",
		"hub-page:close",
		"hub-page:close:toggle",
		"game-page:open",
		"game-page:open:toggle",
		"game-page:close",
		"game-page:close:toggle",
		"hub-page:open",
		"hub-page:open:toggle",
	])
})

test("closing a nonpersistent page releases its element and replay refreshes its callbacks", async () => {
	const { Page } = fixture()
	await Page.open("game-page")
	const first = Page.active.page
	const onOpen = Page.active.options.onOpen
	assert.equal(await Page.close(), undefined)
	assert.equal(Page.activeTag, null)
	assert.equal(first.isConnected, false)
	assert.equal(Page.pages["game-page"].page, null)
	assert.equal(Page.pages["game-page"].options, null)
	await assert.rejects(Page.close())
	await Page.open("game-page")
	assert.notEqual(Page.active.page, first)
	assert.notEqual(Page.active.options.onOpen, onOpen)
})

test("page registration rejects invalid metadata, duplicates and unregistered navigation", async () => {
	const { Page } = fixture()
	assert.throws(() => Page.init("missing-page", { assertKeyPresent(key) {
		assert.ok(Object.hasOwn(this, key))
	} }))
	assert.throws(() => Page.init("invalid-page", { persistOnClose: "yes", assertKeyPresent() {} }))
	assert.throws(() => Page.init("hub-page", { persistOnClose: true, assertKeyPresent() {} }))
	await Page.open("hub-page")
	await assert.rejects(Page.open("unknown-page"))
	assert.equal(Page.activeTag, "hub-page")
	await assert.rejects(Page.open("hub-card"))
})


test("setup errors propagate without cleanup", async () => {
	const failure = new Error("setup failed")
	const { Page, created } = fixture({
		get onOpen() {
			throw failure
		},
	})
	await assert.rejects(Page.open("game-page"), error => error == failure)
	assert.equal(created[1].isConnected, true)
	assert.equal(Page.activeTag, null)
})

test("registration caches only persistent elements before any setup", () => {
	const { Page, created, events } = fixture()
	assert.equal(Page.pages["game-page"].page, null)
	assert.equal(Page.pages["hub-page"].page, created[0])
	assert.equal(created.length, 1)
	assert.equal(created[0].isConnected, false)
	assert.equal(created[0].ready, undefined)
	assert.deepEqual(events, [])
})
