export class GuiPosition {

	static bottomMiddle() {
		const x = Palette.width / 2
		const y = Palette.height - 50

		return new Position(x, y)
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
