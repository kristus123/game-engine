export const SamiWords = ProxyObject({
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
		throw new Error(`Word not found in SamiWords: ${word}`)
	},
})

SamiWords.forEachValue(translations => {
	translations.assertAllKeysPresent(["norwegian", "nordSami", "luleSami", "sorSami"])
})
