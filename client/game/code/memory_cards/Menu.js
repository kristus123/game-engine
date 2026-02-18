export class Menu {
	constructor() {
		Html.fillList([
			Flex.container([
				Html.button("practice", () => {
					new Practice()
				}),
				Html.button("record more", () => {
					new RecordButton()
				}),
				Html.button("edit memories", () => {
					new EditMemories()
				}),
			])
		])
	}
}
