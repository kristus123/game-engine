export function Livestream() {
	const html = Page.init("index", H.create("test-page"))
	Page.go("index")

	!async function() {
		await Sim.click(html.streamer)
	}()
}
