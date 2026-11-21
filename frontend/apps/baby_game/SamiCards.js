const words = ProxyObject({
	target: {
		hello: {
			norwegian: "",
			nordSami: "",
			luleSami: "",
			sorSami: "",
		},
	},
	onGetMissing: () => {
		return {
			norwegian: "",
			nordSami: "",
			luleSami: "",
			sorSami: "",
		}
	},
})

// slightly hacky solution
function _init(projects) {
	const voices = Assert.value(projects.voices, "Ableton voices project has not been initialized")
	const locators = Assert.value(projects._locators, "Ableton has no locator markers")
	const names = new Set(locators.filter(locator => locator.projectName == "voices").map(locator => locator.name))
	const placeholder = Sprite.temporary(WorldPosition(0, 0))
	const entries = {}

	for const name of names {
		const text = words[name]
		text.assertAllKeysPresent(["norwegian", "nordSami", "luleSami", "sorSami"])
		const audio = {}
		text.forEach(language => {
			audio[language] = voices[language][name]
		})
		entries[name] = { text, audio, img: placeholder.img, src: placeholder.src  }
	}

	Object.assign(SamiCards, entries)
}

export const SamiCards = ProxyObject({
	target: { _init },
	onGetMissing: word => {
		throw new Error(`Sami card not found: ${word}`)
	},
})
