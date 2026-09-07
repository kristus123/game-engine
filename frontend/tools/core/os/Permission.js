// later we can find a prettier way

export class Permission {

	static async requestAll({ ok, error } = {}) { // no-null-check
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			})
			stream.getTracks().forEach(t => t.stop())
			ok?.()
		}
		catch (e) {
			console.error("all denied:", e)
			error?.()
			throw e
		}
	}

}
