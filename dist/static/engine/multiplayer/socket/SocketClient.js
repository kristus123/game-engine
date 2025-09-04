import { Random } from '/static/engine/Random.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/assertions/a.js'; 

const clientId = Random.uuid()

export class SocketClient {
	constructor(port, run) {

				AssertNotNull(port, "argument port in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(run, "argument run in " + this.constructor.name + ".js should not be null")
			
		this.port = port; 
		this.run = run; 

		this.listeners = {}


		this.clientId = clientId
		this.webSocket = new WebSocket(`ws://localhost:${port}?clientId=${this.clientId}`)

		this.webSocket.onopen = () => {
		}

		run(this)

		this.webSocket.onmessage = e => {
			const data = JSON.parse(e.data)

			if (this.listeners[data.action]) {
				try {
					this.listeners[data.action](data)
				}
				catch (error) {
					console.log('An error occurred when doing ' + data.action)
					console.log(error)
					throw error
				}
			}
			else {
				console.log(data.action + ' not found')
			}
		}

		this.webSocket.onclose = () => {
			this.close()
		}
	}

	send(data) {
		if (this.webSocket.readyState === WebSocket.OPEN) {
			this.webSocket.send(JSON.stringify(data))
		}
	}

	close() {}

	on(event, callback) {
		this.listeners[event] = callback
	}
}
