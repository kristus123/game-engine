import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Spawner {
	constructor(create, interval, add) {

				AssertNotNull(create, "argument create in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(interval, "argument interval in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(add, "argument add in " + this.constructor.name + ".js should not be null")
			
		this.create = create; 
		this.interval = interval; 
		this.add = add; 

		this.create = create
		this.interval = interval || 2000
		this.add = add || ((e) => this.localObjects.add(e))
		this.timer = null
		this.spawned = []
	}

	start() {
		if (this.timer) {
			return
		}
		this.timer = setInterval(() => {
			const entity = this.create()
			if (entity) {
				this.add(entity)
				this.spawned.push(entity)
			}
		}, this.interval)
	}

	stop() {
		if (!this.timer) {
			return
		}
		clearInterval(this.timer)
		this.timer = null
	}

	setIntervalTime(ms) {
		this.interval = ms
		if (this.timer) {
			this.stop(); this.start()
		}
	}

	dispose() {
		this.stop()
		this.spawned.length = 0
	}
}
