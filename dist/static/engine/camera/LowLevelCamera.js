import { a } from '/static/engine/assertions/a.js'; 

export class LowLevelCamera {

	static context(camera, run) {

		camera.palette.ctx.save()

		camera.palette.ctx.translate(
			-camera.position.x * camera.zoom + camera.offset.x,
			-camera.position.y * camera.zoom + camera.offset.y)

		camera.palette.ctx.scale(camera.zoom, camera.zoom)

		run()

		camera.palette.ctx.restore()
	}

}

