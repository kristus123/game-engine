export class SocketConnection {
	constructor() {
		this.ws = new WebSocket('ws://localhost:8080')

		this.ws.onopen = () => {
		  console.log('Connected to server')
		}

		this.ws.onmessage = (event) => {
		  console.log('Received message:', event.data)
		}

		this.ws.onclose = () => {
		  console.log('Connection closed')
		}
	}

	send(data) {
	  if (this.ws.readyState === WebSocket.OPEN) {
	    this.ws.send(JSON.stringify(data))
	  }
	}
}

