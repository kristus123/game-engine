export class Rain extends DynamicGameObject {
	constructor(position, options = {}) {
		super(position, options)
		this.localObjects = new LocalObjects()

		setInterval(() => {
			// Create a raindrop as a DynamicGameObject
			const rainDrop = new DynamicGameObject(
				Random.positionWithin(position),
				{ speed: 2 } // drop speed (adjust as needed)
			)

			// Render as a simple blue rectangle
			rainDrop.draw = (draw) => {
				draw.rectangle(rainDrop, 'blue')
			}

			// Raindrop lifetime (frames or ticks, depending on your loop)
			rainDrop.life = 200

			// Update logic for each raindrop
			rainDrop.update = () => {
				// Move downwards
				rainDrop.moveTowards(rainDrop.position.offset(0, 100), 0.1)

				// Decrease life
				rainDrop.life--
				if (rainDrop.life <= 0) {
					this.localObjects.remove(rainDrop)
				}
			}

			// Add raindrop to local objects so it's updated/drawn each frame
			this.localObjects.add(rainDrop)
		}, 100)
	}

	update() {
		// Update all raindrops
		this.localObjects.update()
	}

	draw(draw) {
		// Draw all raindrops
		this.localObjects.draw(draw)
	}
}
