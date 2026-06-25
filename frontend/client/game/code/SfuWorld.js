export class SfuWorld {
	constructor() {
		Test()

		SocketClient.onRemovedClient = (clientId) => {
			console.log("Client Removed: ", clientId)
		}

		SfuClient.init()
		SfuRouters.init()

		SfuRouters.updateRouterList()

		console.log(My.clientId)

		const s = Dom.add(Html.sfu())

		SfuRouters.onRouterCreated = lobby => {
			s.lobbies.add(H.button("join " + lobby.routerId, () => {
				SfuClient.joinLobby(lobby.routerId)
			}))
		}

		SfuRouters.onGuestConnection = stream => {
			console.log(stream)
			s.guestWebcam.srcObject = stream
		}

		SfuRouters.onLocalConnection = stream => {
			console.log("hei")
			console.log(stream)
			s.localWebcam.srcObject = stream
		}

		s.create.onClick(() => {
			SfuClient.createLobby(true) // streamOnly == true
		})
	}

	update() {

	}
}
