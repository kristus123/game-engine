// ClientId(

export class World {
	constructor() {
		const player = new DynamicGameObject(new Position(8000, 6000))

		Controller.control(player)
		Camera.followInstantly(player)

		this.localObjects = new LocalObjects([
			Sprite.snow(new Position(0, 0), 6),
			Sprite.samurai(player.position, 0.5),
		])

		SocketClient.onServerMessage('UPDATE_CLIENTS_LIST', data => {
			console.log(`Logging From Game: ${JSON.stringify(data)}.`)
		})

		GridUi.top.set(Html.input('json goes here', (value) => {
			GridUi.mid.push([
				Html.button('write json', (json) => {
					HttpClient.write({ 'test': value }, body => {
						console.log('___')
						console.log(body)
						console.log('___')
					})
				}),
				Html.button('get json', (json) => {
					HttpClient.read({ 'filename': 'test' }, body => {
						console.log('___')
						console.log(body)
						console.log('___')
					})
				})
			])
		}))
	}


	update() {
		this.localObjects.update()
	}

	draw(draw) {}
}
