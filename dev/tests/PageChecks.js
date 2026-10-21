import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function fixture(options = {}) {
	const file = new URL("../../frontend/ui/page/Page.js", import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
	const layoutFile = new URL("../../frontend/apps/viking_game/aoe/Layout.js", import.meta.url)
	const layoutSource = TranspileContent(layoutFile.pathname, readFileSync(layoutFile, "utf8"), [])
	const events = []
	const created = []
	const connections = []
	const runtimeAssert = {
		notNull: value => assert.notEqual(value, null),
		string: value => assert.equal(typeof value, "string"),
		object: value => assert.equal(typeof value, "object"),
		bool: value => assert.equal(typeof value, "boolean"),
		method: value => assert.equal(typeof value, "function"),
		true: (value, message) => assert.ok(value, message),
		false: (value, message) => assert.ok(!value, message),
		value: value => {
			assert.ok(value)
			return value
		},
	}
	const disconnect = node => {
		if (node.parentNode) {
			const siblings = node.parentNode.childNodes
			siblings.splice(siblings.indexOf(node), 1)
			node.parentNode = null
		}
		setConnected(node, false)
	}
	const setConnected = (node, connected) => {
		if (node.isConnected != connected) {
			node.isConnected = connected
			connections.push([node.tag, connected])
		}
		if (connected && node.nodeType == 1) {
			node.ready ??= Promise.resolve().then(() => ({
				onPageOpen: async () => events.push(node.tag + ":open"),
				onPageClose: async () => events.push(node.tag + ":close"),
				onToggle: async state => events.push(node.tag + ":" + state + ":toggle"),
				...options,
			}))
		}
		for (const child of node.childNodes) {
			setConnected(child, connected)
		}
	}
	const createNode = (tag, nodeType = 1) => {
		const node = {
			tag,
			nodeType,
			isConnected: false,
			parentNode: null,
			childNodes: [],
			get children() {
				return node.childNodes.filter(child => child.nodeType == 1)
			},
			whenReady: () => node.ready,
			contains: child => node.childNodes.some(descendant => descendant == child || descendant.contains(child)),
			append: child => {
				disconnect(child)
				node.childNodes.push(child)
				child.parentNode = node
				setConnected(child, node.isConnected)
			},
			before: child => {
				const parent = node.parentNode
				assert.ok(parent, "the page slot must have a parent")
				disconnect(child)
				parent.childNodes.splice(parent.childNodes.indexOf(node), 0, child)
				child.parentNode = parent
				setConnected(child, parent.isConnected)
			},
			remove: () => disconnect(node),
		}
		return node
	}
	const { Page, Layout } = runInNewContext(`
		Object.defineProperties(Object.prototype, {
			assertKeyPresent: { value(key) { Assert.true(Object.hasOwn(this, key)) } },
			assertKeyMissing: { value(key) { Assert.true(!Object.hasOwn(this, key)) } },
		})
		${layoutSource.replace("export class", "class")}
		${source.replace("export class", "class")}
		({ Page, Layout })
	`, {
		Assert: runtimeAssert,
		SuperClass: class {},
		IfCondition: { validate: Boolean },
		customElements: { get: () => class {} },
		document: { createComment: () => createNode("#comment", 8) },
		H: { create: tag => {
			const page = createNode(tag)
			created.push(page)
			return page
		} },
		Dom: { add: page => setConnected(page, true) },
	})
	for (const tag of ["hub-page", "game-page"]) {
		Page.init(tag, { persistOnClose: tag == "hub-page", assertKeyPresent() {} })
	}
	return { Page, Layout, events, created, connections, createNode }
}

test("page records retain callbacks and persistent elements across navigation", async () => {
	const { Page, events, created } = fixture()
	await assert.rejects(Page.close())
	await Page.open("hub-page")
	const hub = Page.active.page
	assert.equal(Page.activeTag, "hub-page")
	assert.equal(Page.active, Page.pages["hub-page"])
	assert.equal(Page.pages["hub-page"].page, hub)
	assert.equal(hub.onPageOpen, undefined)
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
	const onPageOpen = Page.active.options.onPageOpen
	assert.equal(await Page.close(), undefined)
	assert.equal(Page.activeTag, null)
	assert.equal(first.isConnected, false)
	assert.equal(Page.pages["game-page"].page, null)
	assert.equal(Page.pages["game-page"].options, null)
	await assert.rejects(Page.close())
	await Page.open("game-page")
	assert.notEqual(Page.active.page, first)
	assert.notEqual(Page.active.options.onPageOpen, onPageOpen)
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
		get onPageOpen() {
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

test("pages can be mounted inside a persistent layout", async () => {
	const { Page, created } = fixture()
	Page.init("laid-page", { persistOnClose: true, layout: "pretty-layout", assertKeyPresent() {} })
	await Page.open("laid-page")

	const layout = Page.active.layoutElement
	assert.equal(layout.tag, "pretty-layout")
	assert.deepEqual(layout.children, [Page.active.page])
	assert.equal(layout.isConnected, true)

	await Page.close()
	assert.equal(layout.isConnected, false)
	assert.equal(Page.pages["laid-page"].page.tag, "laid-page")
	assert.equal(Page.pages["laid-page"].layoutElement, layout)
	assert.equal(created.length, 3)

	await Page.open("laid-page")
	assert.deepEqual(layout.children, [Page.active.page])
})

test("pages sharing a layout keep it connected and replace only its projected page", async () => {
	const { Page, Layout, connections, createNode } = fixture()
	for (const tag of ["map-page", "story-page"]) {
		Page.init(tag, { persistOnClose: true, layout: "pretty-layout", assertKeyPresent() {} })
	}
	await Page.open("map-page")
	const layout = Layout.pretty
	const slot = Layout.pageSlots["pretty-layout"]
	const map = Page.active.page
	const outlet = createNode("middle")
	layout.append(outlet)
	outlet.append(map)
	outlet.append(slot)
	assert.equal(Page.pages["story-page"].layoutElement, layout)

	await Page.open("story-page")
	assert.equal(Page.active.page.parentNode, slot.parentNode)
	assert.deepEqual(outlet.children, [Page.active.page])
	assert.deepEqual(layout.children, [outlet])
	assert.equal(map.parentNode, null)
	assert.equal(map.isConnected, false)
	assert.equal(layout.isConnected, true)

	await Page.open("map-page")
	assert.equal(Page.active.page, map)
	assert.equal(map.parentNode, slot.parentNode)
	assert.deepEqual(outlet.children, [map])
	assert.deepEqual(connections.filter(([tag]) => tag == "pretty-layout"), [["pretty-layout", true]])
})

test("a shared layout retains its slot across unrelated pages, fresh pages and explicit closing", async () => {
	const { Page, Layout } = fixture()
	Page.init("map-page", { persistOnClose: true, layout: "pretty-layout", assertKeyPresent() {} })
	Page.init("fresh-page", { persistOnClose: false, layout: "pretty-layout", assertKeyPresent() {} })
	Page.init("other-page", { persistOnClose: true, layout: "other-layout", assertKeyPresent() {} })
	await Page.open("fresh-page")
	const first = Page.active.page
	const layout = Layout.pretty
	const slot = Layout.pageSlots["pretty-layout"]

	await Page.open("map-page")
	assert.equal(layout.isConnected, true)
	assert.equal(first.parentNode, null)
	assert.equal(Page.pages["fresh-page"].page, null)
	await Page.open("other-page")
	assert.equal(layout.isConnected, false)
	assert.equal(Layout.other.isConnected, true)
	await Page.open("hub-page")
	assert.equal(Layout.other.isConnected, false)
	await Page.open("fresh-page")
	assert.equal(Layout.pretty, layout)
	assert.notEqual(Page.active.page, first)
	assert.equal(Page.active.page.parentNode, slot.parentNode)
	assert.deepEqual(layout.children, [Page.active.page])

	await Page.close()
	assert.equal(layout.isConnected, false)
	assert.deepEqual(layout.children, [])
	assert.equal(slot.parentNode, layout)
	await Page.open("map-page")
	assert.equal(Layout.pretty, layout)
	assert.equal(Page.active.page.parentNode, slot.parentNode)
	assert.deepEqual(layout.children, [Page.active.page])
})

test("navigation serializes rapid page changes", async () => {
	const { Page } = fixture()
	await Promise.all([
		Page.open("game-page"),
		Page.open("hub-page"),
	])

	assert.equal(Page.activeTag, "hub-page")
})
