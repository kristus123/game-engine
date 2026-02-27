export class LowLevelCamera {

	static context(camera, run) {
		camera.palettes.forEach((d, palette) => {
			palette.ctx.save()

			palette.ctx.translate(
				-camera.position.x * camera.zoom + camera.offset.x,
				-camera.position.y * camera.zoom + camera.offset.y)

			palette.ctx.scale(camera.zoom, camera.zoom)

		})

		run()

		camera.palettes.forEach((d, palette) => {
			palette.ctx.restore()
		})
	}

}

