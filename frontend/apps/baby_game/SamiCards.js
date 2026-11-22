const words = ProxyObject({
	target: {
		one: {
			norwegian: "1",
			nordSami: "1",
			luleSami: "1",
			sorSami: "1",
			number: 1,
		},
		two: {
			norwegian: "2",
			nordSami: "2",
			luleSami: "2",
			sorSami: "2",
			number: 2,
		},
		three: {
			norwegian: "3",
			nordSami: "3",
			luleSami: "3",
			sorSami: "3",
			number: 3,
		},
		four: {
			norwegian: "4",
			nordSami: "4",
			luleSami: "4",
			sorSami: "4",
			number: 4,
		},
		five: {
			norwegian: "5",
			nordSami: "5",
			luleSami: "5",
			sorSami: "5",
			number: 5,
		},
		six: {
			norwegian: "6",
			nordSami: "6",
			luleSami: "6",
			sorSami: "6",
			number: 6,
		},
		seven: {
			norwegian: "7",
			nordSami: "7",
			luleSami: "7",
			sorSami: "7",
			number: 7,
		},
		eight: {
			norwegian: "8",
			nordSami: "8",
			luleSami: "8",
			sorSami: "8",
			number: 8,
		},
		nine: {
			norwegian: "9",
			nordSami: "9",
			luleSami: "9",
			sorSami: "9",
			number: 9,
		},
		ten: {
			norwegian: "10",
			nordSami: "10",
			luleSami: "10",
			sorSami: "10",
			number: 10,
		},
	},
	onGetMissing: w => {
		return {
			norwegian: w + " - NO",
			nordSami: w + " - nord",
			luleSami: w + " - lule",
			sorSami: w + " - sor",
			number: -1,
		}
	},
})

// slightly hacky solution
function _init() {
	const entries = {}

	for const name of Ableton.projects.voices._locators {
		const text = words[name]
		text.assertAllKeysPresent(["norwegian", "nordSami", "luleSami", "sorSami"])
		const audio = {}
		for const language of ["norwegian", "nordSami", "luleSami", "sorSami"] {
			audio[language] = Ableton.projects.voices[language][name]
		}
		entries[name] = { name: name, text, audio, src: Sprite.temporary(WorldPosition(0, 0)).src }
	}

	Object.assign(SamiCards, entries)
}

export const SamiCards = ProxyObject({
	target: { _init },
	onGetMissing: word => {
		throw new Error(`Sami card not found: ${word}`)
	},
})
