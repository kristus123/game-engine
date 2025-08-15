import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Key {
	constructor(key) {

				AssertNotNull(key, "argument key in " + this.constructor.name + ".js should not be null")
			
		this.key = key; 

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
