export class Permission {

	static granted = null

	static async request({ ok, error } = {}) { // no-null-check
		if (this.granted == null) {
			const camera = navigator.permissions.query({
				name: "camera",
			})

			const microphone = navigator.permissions.query({
				name: "microphone",
			})

			if ((await camera).state == "granted" && (await microphone).state == "granted") {
				this.granted = true
			}
		}

		if (this.granted) {
			// do nothing, all is ok
		}
		else {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: true,
				})
				stream.getTracks().forEach(t => t.stop())
				this.granted = true
				ok?.()
			}
			catch (e) {
				console.error("all denied:", e)
				error?.()
				throw e
			}
		}
	}
}
