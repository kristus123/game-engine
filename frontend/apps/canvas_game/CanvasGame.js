export class CanvasGame {
	constructor() {
		const p = Sprite.player(WorldPosition(0, 0))

		const img = Dom.overlay(H.img("xxxxxx"))

		const objects = Objects([
			p,
		])
		CanvasLoop({
			update: () => {
				img.src = p.src
				objects.update()
				console.log("hei")
			},
		})
	}
}
