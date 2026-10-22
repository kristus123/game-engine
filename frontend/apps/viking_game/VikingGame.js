export async function VikingGame() {
	Page.open("village-page")

	G.onYear(() => {
		Page.open("new-year-page")
	})
}
