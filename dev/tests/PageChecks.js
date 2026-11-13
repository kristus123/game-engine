import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import { TranspileContent } from "../transpiler/TranspileContent.js"

function fixture(options = {}, initialUrl = "http://localhost:5050/") {
	const file = new URL("../../frontend/ui/page/Page.js", import.meta.url)
	const source = TranspileContent(file.pathname, readFileSync(file, "utf8"), [])
	const layoutFile = new URL("../../frontend/ui/layout/Layout.js", import.meta.url)
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
			classList: { add() {} },
			get children() {
				return node.childNodes.filter(child => child.nodeType == 1)
			},
			whenReady: () => node.ready,
			whenLifecycleReady: () => Promise.resolve(),
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
	const listeners = {}
	const browser = { location: { href: initialUrl }, addEventListener: (name, callback) => {
		listeners[name] = callback
	} }
	const entries = [{ state: null, url: initialUrl }]
	let cursor = 0
	const travel = delta => {
		if (cursor + delta < 0 || cursor + delta >= entries.length) {
			return
		}
		cursor += delta
		browser.location.href = entries[cursor].url
		queueMicrotask(() => listeners.popstate?.({ state: entries[cursor].state }))
	}
	browser.history = {
		get state() {
			return entries[cursor].state
		},
		get length() {
			return entries.length
		},
		pushState: (state, _title, url) => {
			entries.splice(cursor + 1)
			entries.push({ state: structuredClone(state), url: String(url) })
			cursor++
			browser.location.href = String(url)
		},
		replaceState: (state, _title, url) => {
			entries[cursor] = { state: structuredClone(state), url: String(url) }
			browser.location.href = String(url)
		},
		back: () => travel(-1),
		forward: () => travel(1),
	}
	const { Page, Layout } = runInNewContext(`
		Object.defineProperties(Object.prototype, {
			assertKeyPresent: { value(key) { Assert.true(Object.hasOwn(this, key)) } },
			assertKeyMissing: { value(key) { Assert.true(!Object.hasOwn(this, key)) } },
		})
		Object.defineProperties(Array.prototype, {
			empty: { get() { return this.length == 0 } },
			last: { get() { Assert.true(this.length > 0); return this.at(-1) } },
		})
		${layoutSource.replace("export class", "class")}
		${source.replace("export class", "class")}
		({ Page, Layout })
	`, {
		window: browser,
		URL,
		Assert: runtimeAssert,
		SuperClass: class {},
		IfCondition: { validate: value => {
			assert.notEqual(typeof value, "function", "control flow must not receive callbacks")
			return Boolean(value)
		} },
		customElements: { get: () => class {} },
		document: {
			createComment: () => createNode("#comment", 8),
			createElement: tag => createNode(tag),
		},
		H: { create: tag => {
			const page = createNode(tag)
			created.push(page)
			return page
		} },
		Dom: { add: element => setConnected(element, true) },
		UserInput: { disable() {}, enable() {} },
	})
	for (const tag of ["hub-page", "game-page"]) {
		Page.init(tag, { persistOnClose: tag == "hub-page", assertKeyPresent() {} })
	}
	return { Page, Layout, events, created, connections, createNode, browser }
}

test("page records retain callbacks and persistent elements across navigation", async () => {
	const { Page, events, created } = fixture()
	await assert.rejects(Page.close())
	await Page.open("hub-page")
	const hub = Page.active.page
	assert.equal(Page.activeTag, "hub-page")
	assert.equal(Page.active, Page.pages["hub-page"])
	assert.equal(Page.pages["hub-page"].page, hub)
	await Page.open("hub-page")
	await Page.open("game-page")
	await Page.open("hub-page")
	assert.equal(Page.active.page, hub)
	assert.equal(created.length, 2)
	assert.deepEqual(events, [
		"hub-page:open:toggle",
		"hub-page:close:toggle",
		"hub-page:open:toggle",
		"hub-page:close:toggle",
		"game-page:open:toggle",
		"game-page:close:toggle",
		"hub-page:open:toggle",
	])
})

test("closing a nonpersistent page releases its element and replay refreshes its callbacks", async () => {
	const { Page } = fixture()
	await Page.open("game-page")
	const first = Page.active.page
	const firstOptions = Page.active.options
	await Page.open("game-page")
	const second = Page.active.page
	assert.notEqual(second, first)
	assert.notEqual(Page.active.options, firstOptions)
	assert.equal(first.isConnected, false)
	assert.deepEqual(Array.from(Page.visiblePages, page => page.tag), ["game-page"])
	assert.equal(await Page.close(), undefined)
	assert.equal(Page.activeTag, null)
	assert.equal(second.isConnected, false)
	assert.equal(Page.pages["game-page"].page, null)
	assert.equal(Page.pages["game-page"].options, null)
	await assert.rejects(Page.close())
	await Page.open("game-page")
	assert.notEqual(Page.active.page, second)
	assert.notEqual(Page.active.options, firstOptions)
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
		get onToggle() {
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
	assert.equal(Page.visiblePages.last.layoutElement, layout)
	assert.deepEqual(layout.children, [Page.active.page])
	assert.equal(layout.isConnected, true)

	await Page.close()
	assert.equal(layout.isConnected, false)
	assert.equal(Page.visiblePages.empty, true)
	assert.equal(Page.pages["laid-page"].page.tag, "laid-page")
	assert.equal(Page.pages["laid-page"].layoutElement, layout)
	assert.equal(created.length, 3)

	await Page.open("laid-page")
	assert.equal(Page.visiblePages.last.layoutElement, layout)
	assert.deepEqual(layout.children, [Page.active.page])
})

test("a retained layout is removed when a page uses another layout", async () => {
	const { Page } = fixture()
	Page.init("laid-page", { persistOnClose: true, layout: "pretty-layout", assertKeyPresent() {} })
	await Page.open("laid-page")
	const layout = Page.visiblePages.last.layoutElement

	await Page.close({ keepLayout: true })
	assert.equal(Page.visiblePages.empty, true)
	assert.equal(layout.isConnected, true)

	await Page.open("hub-page")
	assert.equal(layout.isConnected, false)
})

test("pages sharing a layout keep it connected and replace only its projected page", async () => {
	const { Page, Layout, connections, createNode } = fixture()
	for (const tag of ["map-page", "story-page"]) {
		Page.init(tag, { persistOnClose: true, layout: "pretty-layout", assertKeyPresent() {} })
	}
	await Page.open("map-page")
	const layout = Layout.pretty
	assert.equal(Page.visiblePages.last.layoutElement, layout)
	const slot = Layout.pageSlots["pretty-layout"]
	const map = Page.active.page
	const outlet = createNode("middle")
	layout.append(outlet)
	outlet.append(map)
	outlet.append(slot)
	assert.equal(Page.pages["story-page"].layoutElement, layout)

	await Page.open("story-page")
	assert.equal(Page.visiblePages.last.layoutElement, layout)
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
	assert.equal(Page.visiblePages.last.layoutElement, Layout.other)
	assert.equal(Layout.other.isConnected, true)
	await Page.open("hub-page")
	assert.equal(Layout.other.isConnected, false)
	assert.equal(Page.visiblePages.last.layoutElement, null)
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

test("custom overlays keep the current page connected and close back to it", async () => {
	const { Page, events } = fixture()
	Page.init("overlay-page", { persistOnClose: false, assertKeyPresent() {} })
	await Page.open("hub-page")
	const background = Page.active.page
	assert.deepEqual(Array.from(Page.visiblePages, page => page.tag), ["hub-page"])

	await Page.openAsModalFixed("overlay-page")
	assert.equal(Page.activeTag, "overlay-page")
	assert.deepEqual(Array.from(Page.visiblePages, page => page.tag), ["hub-page", "overlay-page"])
	assert.equal(background.isConnected, true)
	assert.equal(Page.active.page.isConnected, true)

	await Page.close()
	assert.equal(Page.activeTag, "hub-page")
	assert.equal(Page.active.page, background)
	assert.equal(background.isConnected, true)
	assert.equal(Page.pages["overlay-page"].page, null)
	assert.deepEqual(events.slice(-2), ["overlay-page:open:toggle", "overlay-page:close:toggle"])
})

test("custom overlays stack, and normal navigation dismisses them before switching pages", async () => {
	const { Page } = fixture()
	Page.init("overlay-page", { persistOnClose: false, assertKeyPresent() {} })
	Page.init("top-overlay-page", { persistOnClose: true, assertKeyPresent() {} })
	await Page.open("hub-page")
	const background = Page.active.page

	await Page.openAsModalFixed("overlay-page")
	await Page.openAsModalFixed("top-overlay-page")
	assert.equal(Page.activeTag, "top-overlay-page")
	assert.equal(background.isConnected, true)

	await Page.close()
	assert.equal(Page.activeTag, "overlay-page")
	await Page.open("game-page")
	assert.equal(Page.activeTag, "game-page")
	assert.equal(background.isConnected, false)
	assert.deepEqual(Array.from(Page.visiblePages, page => page.tag), ["game-page"])
})

test("closing during modal opening waits and restores the underlying page", async () => {
	const { Page } = fixture()
	Page.init("overlay-page", { persistOnClose: false, assertKeyPresent() {} })
	await Page.open("hub-page")
	await Promise.all([Page.openAsModalFixed("overlay-page"), Page.close()])
	assert.equal(Page.activeTag, "hub-page")
	assert.equal(Page.active.page.isConnected, true)
	assert.equal(Page.pages["overlay-page"].page, null)
})

test("page URLs support direct paths and native Back and Forward", async () => {
	const { Page, browser } = fixture({}, "http://localhost:5050/game?keep=yes")
	await Page.start("hub-page")
	assert.equal(Page.activeTag, "game-page")
	await Page.open("hub-page")
	assert.equal(new URL(browser.location.href).pathname, "/hub")
	assert.equal(new URL(browser.location.href).searchParams.get("keep"), "yes")
	browser.history.back()
	await new Promise(resolve => setImmediate(resolve))
	await Page.navigation
	assert.equal(Page.activeTag, "game-page")
	browser.history.forward()
	await new Promise(resolve => setImmediate(resolve))
	await Page.navigation
	assert.equal(Page.activeTag, "hub-page")
})

test("modal Back, Forward, and Close preserve the underlying page", async () => {
	const { Page, browser, connections } = fixture()
	Page.init("chat-page", { persistOnClose: true, assertKeyPresent() {} })
	await Page.start("hub-page")
	const background = Page.active.page
	await Page.openAsModalFixed("chat-page")
	assert.equal(new URL(browser.location.href).searchParams.get("modal"), "chat")
	browser.history.back()
	await new Promise(resolve => setImmediate(resolve))
	await Page.navigation
	assert.equal(Page.active.page, background)
	browser.history.forward()
	await new Promise(resolve => setImmediate(resolve))
	await Page.navigation
	assert.equal(Page.activeTag, "chat-page")
	await Page.close()
	assert.equal(Page.active.page, background)
	assert.equal(new URL(browser.location.href).searchParams.has("modal"), false)
	assert.equal(connections.filter(([tag, connected]) => tag == "hub-page" && !connected).length, 0)
})

test("direct modal links create a base history entry and stacked modals restore", async () => {
	const { Page, browser } = fixture({}, "http://localhost:5050/hub?modal=chat&modal=confirm")
	Page.init("chat-page", { persistOnClose: true, assertKeyPresent() {} })
	Page.init("confirm-page", { persistOnClose: false, assertKeyPresent() {} })
	await Page.start("game-page")
	assert.equal(browser.history.length, 3)
	assert.equal(Page.activeTag, "confirm-page")
	await Page.close()
	assert.equal(Page.activeTag, "chat-page")
	await Page.close()
	assert.equal(Page.activeTag, "hub-page")
})

test("reload restores a modal URL without adding history entries", async () => {
	const { Page, browser } = fixture({}, "http://localhost:5050/hub?modal=chat")
	Page.init("chat-page", { persistOnClose: true, assertKeyPresent() {} })
	browser.history.replaceState({ pageNavigation: { stack: [{ tag: "hub-page", isOverlay: false }], previous: null } }, "", browser.location.href)
	await Page.start("hub-page")
	assert.equal(browser.history.length, 1)
	assert.equal(Page.activeTag, "chat-page")
})

test("unknown page paths and duplicate modal paths are rejected before navigation", async () => {
	const unknown = fixture({}, "http://localhost:5050/missing")
	assert.throws(() => unknown.Page.start("hub-page"), /Unknown page/)
	const duplicate = fixture({}, "http://localhost:5050/hub?modal=hub")
	assert.throws(() => duplicate.Page.start("hub-page"), /already visible/)
})

test("malformed history URLs recover without blocking later navigation", async () => {
	const { Page, browser } = fixture()
	await Page.start("hub-page")
	browser.history.pushState({}, "", "http://localhost:5050/%ZZ")
	browser.history.pushState({}, "", "http://localhost:5050/hub")
	browser.history.back()
	await new Promise(resolve => setImmediate(resolve))
	await Page.navigation
	assert.equal(new URL(browser.location.href).pathname, "/hub")
	await Page.open("game-page")
	assert.equal(Page.activeTag, "game-page")
})
