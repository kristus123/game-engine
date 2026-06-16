export function PlaystationMapper(index) {
	const mapping = {
		0: "cross",
		1: "circle",
		2: "square",
		3: "triangle",
		4: "L1",
		5: "R1",
		6: "L2",
		7: "R2",
		8: "select", // share
		9: "start", // options
		10: "L3",
		11: "R3",
		12: "up",
		13: "down",
		14: "left",
		15: "right",
		16: "ps"
	}

	if (index in mapping) {
		return mapping[index]
	}
	else {
		throw new Error(`Unknown gamepad button index: ${index}`)
	}

}
