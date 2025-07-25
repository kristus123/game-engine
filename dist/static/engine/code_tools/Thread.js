import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Worker } from '/static/game/enemies/Worker.js'; 

export class Thread {
	constructor(logic) {

				AssertNotNull(logic, "argument logic in " + this.constructor.name + ".js should not be null")
			
		this.logic = logic; 

		const workerCode = `
			${Random.toString()}

			onmessage = (e) => {
				const result = (${logic.toString()})(e.data)
				postMessage(result)
			}
		`

		const blob = new Blob([workerCode], { type: 'application/javascript' })

		this.worker = new Worker(URL.createObjectURL(blob))

	}

	run(input='na', onMessage) {
		this.worker.postMessage(input)

		this.worker.onmessage = (e) => {
			onMessage(e.data)
		}
	}
}

