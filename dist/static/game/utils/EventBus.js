
export class EventBus {
	constructor() {


		this.listeners = new Map()
	}

	on(evt, cb) {
		(this.listeners.get(evt) ?? this.listeners.set(evt, []).get(evt)).push(cb); return () => this.off(evt, cb)
	}

	off(evt, cb) {
		const arr = this.listeners.get(evt); if (!arr) {
			return
		} const i = arr.indexOf(cb); if (i>=0) {
			arr.splice(i, 1)
		}
	}

	emit(evt, payload) {
		(this.listeners.get(evt) || []).forEach(fn => fn(payload))
	}
}
