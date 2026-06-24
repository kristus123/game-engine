export class MicPermission {

	static granted = false

	static onGrantedListener = Listener()
	static onDeniedListener = Listener()

	static async request(callback) {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			stream.getTracks().forEach(track => track.stop())

			this.onGrantedListener.trigger({})
			this.granted = true
			callback(true)

		}
		catch (e) {
			console.error("Mic denied:", e)
			this.onDeniedListener.trigger({})
			this.granted = false
			callback(false)
		}
	}

}
