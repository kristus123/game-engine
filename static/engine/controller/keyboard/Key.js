export class Key {
	constructor(key) {
		this.up = true
		this.down = false
		
		new KeypressEvent().addKeyDownListener(key, () => {
			this.up = false
			this.down = true
		})

		new KeypressEvent().addKeyUpListener(key, () => {
			this.up = true
			this.down = false
		})
	}
}
