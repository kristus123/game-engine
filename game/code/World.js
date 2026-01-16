// ClientId(

export class World {
	constructor() {
		const syncedPlayer = SyncedObject.create('PLAYER', {x: 0, y:0})

		SyncedObject.link('clientId_2', 'PLAYER', player => {
			// here is the synced player object
			console.log(player.x)
		})
	}



	update() {
	}

	draw(draw) {}
}
