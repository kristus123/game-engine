export const SamiCards = (() => { // allow-null

	const words = ProxyObject({
		target: {
			hello: {
				norwegian: "",
				nordSami: "",
				luleSami: "",
				sorSami: "",
			},
			bye: {
				norwegian: "",
				nordSami: "",
				luleSami: "",
				sorSami: "",
			},
		},
		onGetMissing: word => {
			throw new Error(`Word not found in words: ${word}`)
		},
	})

	words.forEachValue(translations => {
		translations.assertAllKeysPresent(["norwegian", "nordSami", "luleSami", "sorSami"])
	})


	console.log(Ableton.projects)
	const locators = Assert.value(Ableton.projects.voices._locators, "Ableton project voices has no locator markers")

	return ProxyObject({
		target: Object.fromEntries(words.map(word => {
			const locator = Assert.value(locators.find(locator => locator.name == word))

			return [locator.name, {
				text: words[word],
				audio: {
					norwegian: Ableton.projects.voices.norwegian[locator.name],
					nordSami: Ableton.projects.voices.nordSami[locator.name],
					luleSami: Ableton.projects.voices.luleSami[locator.name],
					sorSami: Ableton.projects.voices.sorSami[locator.name],
				},
				sprite: Sprite[locator.name](WorldPosition(0, 0)) ?? Sprite.temporary(WorldPosition(0, 0)),
			}]
		})),
		onGetMissing: word => {
			throw new Error(`Sami card not found: ${word}`)
		},
	})
})()
