// ClientId(

export class World {
	constructor() {
		const syncedPlayer = SyncedObject.create(ClientId, {x: 0, y:0})
		this.syncedPlayer = syncedPlayer

		SyncedObject.link(ClientId, 'PLAYER', player => {
			// here is the synced player object
			console.log(player.x)
		})

		setInterval(() => {
			this.syncedPlayer.x += 1
		}, 500);
	}



	update() {
	}

	draw(draw) {}
}
