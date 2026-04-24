export function InitiateWorker(workerFile, onMessage = (m) => {}) { 
	Assert.value(workerFile)
	Assert.method(onMessage)

	const worker = new Worker(workerFile.urlPath, {
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
