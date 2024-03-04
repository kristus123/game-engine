export class GuiPosition {

	static bottomMiddle(offset_x=0, offset_y=0, width=1, height=1) {
		const x = (Palette.width / 2) + offset_x
		const y = (Palette.height - 50) + offset_y

		return new Position(x, y, width, height)
	}

	static topMiddle() {
		const x = Palette.width / 2
		const y = 50

		return new Position(x, y)
	}

	static leftMiddle() {
		const x = 50
		const y = Palette.height / 2

		return new Position(x, y)
	}

	static rightMiddle() {
		const x = Palette.width - 50
		const y = Palette.height / 2

		return new Position(x, y)

	}

	static middle() {
		const x = Palette.width / 2
		const y = Palette.height / 2

		return new Position(x, y)
	}
}
