// ClientId(


export class World {
	constructor() {
		OtherConnectedSocketClients.add('Mom')
		OtherConnectedSocketClients.onJoin((clientId, onLeave) => {
			console.log('Someone joined')
			const b = Html.button('Player')
			Dom.overlay(b)
			console.log(onLeave)
			onLeave(() => {
				console.log('Someone left')
				b.remove()
			})
		})
		setTimeout(() => {
			OtherConnectedSocketClients.remove('Mom')
		}, 2000)
	}



	update() {
	}

	draw(draw) {}
}
