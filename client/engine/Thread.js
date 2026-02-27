export class Thread {
	constructor(logic) {
		const workerCode = `
			${Random.toString()}

			onmessage = (e) => {
				const result = (${logic.toString()})(e.data)
				postMessage(result)
			}
		`

		const blob = new Blob([workerCode], { type: "application/javascript" })

		this.worker = new Worker(URL.createObjectURL(blob))

	}

	run(input="na", onMessage) {
		this.worker.postMessage(input)

		this.worker.onmessage = (e) => {
			onMessage(e.data)
		}
	}
}

