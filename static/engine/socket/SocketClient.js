export class SocketClient {

	constructor() {
		this.ws = new WebSocket('ws://localhost:8080');
		this.listeners = {};

		this.ws.onopen = () => {
			this.send({
				action: 'NEW_PLAYER',
				playerId: Uuid.create()
			});
		};

		this.ws.onmessage = e => {
			const data = JSON.parse(e.data);

			if (this.listeners[data.action]) {
				this.listeners[data.action](data);
			}
		};

		this.ws.onclose = () => {
			this.close();
		};
	}

	send(data) {
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(data));
		}
	}

	close() {}

	on(event, callback) {
		this.listeners[event] = callback;
	}
}

