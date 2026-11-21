const locators = Assert.value(
	Assert.value(Ableton.projects.voices, "Ableton project voices is missing")._locators,
	"Ableton project voices has no locator markers"
)

export const SamiCards = ProxyObject({
	target: Object.fromEntries(SamiWords.map(word => {
		SamiWords[word].assertAllKeysPresent(["norwegian", "nordSami", "luleSami", "sorSami"])

		const locator = Assert.value(
			locators.find(locator => locator.name == word),
			`No Ableton voices locator marker found for SamiWords.${word}`
		)

		return [locator.name, {
			text: SamiWords[word],
			audio: {
				norwegian: Ableton.projects.voices.nor[locator.name],
				nordSami: Ableton.projects.voices.nordSami[locator.name],
				luleSami: Ableton.projects.voices.luleSami[locator.name],
				sorSami: Ableton.projects.voices.sorSami[locator.name],
			},
			image: Assert.value(Sprite[locator.name], `No sprite found for SamiCards.${locator.name}`),
		}]
	})),
	onGetMissing: word => {
		throw new Error(`Sami card not found: ${word}`)
	},
})
