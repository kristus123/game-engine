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

		OtherConnectedSocketClients.onConnect = connectingClientId => {
			console.log('client connected')
			const player = SyncedObject.link(connectingClientId, 'PLAYER', { hp: 100 })

			Dom.add(Html.button('damage person', () => {
				player.hp -= 1
				console.log(player.hp)
			}))
			console.log('all done')

			setInterval(() => {
				Dom.add(Html.p(player.hp))
			}, 200)
		}

		SocketClient.onClientMessage('NEW_MESSAGE', (data) => {
			Chat.getAudioBlob(`${data.key}`, blob => {
				const url = URL.createObjectURL(blob)
				console.log(url)
			})
		})

		Dom.overlay([
    		Html.div('audioRecordDiv', [
        		Html.button('Record Audio', () => {
            		Microphone.start()
					console.log('recording...')
        		}),
        		Html.button('Stop Recording', () => {
            		Microphone.stop(blob => {
                		Chat.sendAudioBlob(OtherConnectedSocketClients.ids[0], blob)
            		})
        		})
    		])
		])
	}



	update() {
	}

	draw(draw) {}
}
