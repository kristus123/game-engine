// later we can find a prettier way

export class Permission {

	static granted = false

	static async request({ ok, error } = {}) { // no-null-check
		Assert.false(this.granted)

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
