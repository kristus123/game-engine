/*
 * the  offscreenCanvas  uses relative positions. makes sense as it is not connected to the dom.
 *
	*/
class WorkerClient {
	constructor(width, height, player, camera) {
		this.width = width
		this.player = player
		this.height = height
		this.camera = camera
		this.worker = new Worker("static/w.js")
		this.position = {
			x: 0,
			y: 0,
		}
		this.workerBitMap = null

		this.canvas = new OffscreenCanvas(4000, 4000)

		this.worker.postMessage({
			width: width, 
			height: height, 
			player: player,
			canvas: this.canvas, 
			type:"init"
		}, [this.canvas]);

		setInterval(() => {
			this.worker.postMessage({
				width, height
			});
		}, 200)

		this.worker.onmessage = e => {
			console.log("heihehi")
			this.workerBitMap = e.data
		}
	}

	// So when positioning the drawn image on the 'global map' 
	// you need to set the position when drawing
	draw(ctx) {
		if (this.workerBitMap) {
			ctx.drawImage(this.workerBitMap, 0, this.player.y)
			this.worker.postMessage({
				type: 'player',
				player: player,
			})
		}
	}
}
