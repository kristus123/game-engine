const buttons = [
	"cross",
	"circle",
	"square",
	"triangle",
	"L1",
	"R1",
	"L2",
	"R2",
	"select", // share
	"start", // options
	"L3",
	"R3",
	"up",
	"down",
	"left",
	"right",
	"ps",
]

const mappings = {}

for (const [index, b] of buttons.entries()) {
	mappings[index] = b
}

export class Playstation {

	static buttons = buttons

	static mapToButton(index) {
		if (index in mappings) {
			return mappings[index]
		}
		else {
			// console.warn(`Unknown gamepad button index: ${index}`)
			return null
		}
	}

}
