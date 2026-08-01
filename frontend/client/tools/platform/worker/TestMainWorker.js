export function InitiateWorker(workerFileUrl, onMessage = m => {}) {
	Assert.value(workerFileUrl)
	Assert.method(onMessage)

	const worker = new Worker(workerFileUrl, {
		type: "module",
	})

	worker.onmessage = (e) => {
		onMessage(e.data)
	}

	return {
		send: (message) => {
			worker.postMessage(message)
		}
	}

}
