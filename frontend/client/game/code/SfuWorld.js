export class SfuWorld {
	constructor() {
		SfuRouters.init()
		
		Webcam.request(() => {
			SfuRouters.updateRouterList()

			const s = Dom.add(Html.sfu())

			SfuRouters.onRouterCreated = lobby => {
				s.lobbies.add(H.button("join " + lobby.routerId, () => {
					SfuClient.joinLobby(lobby.routerId)
				}))
			}

			SfuRouters.onGuestConnection = stream => {
				console.log("hei")
				s.guestWebcam.srcObject = stream
			}

			SfuRouters.onLocalConnection = stream => {
				console.log("hei")
				s.localWebcam.srcObject = stream
			}

			s.create.onClick(() => {
				SfuClient.createLobby(true) // streamOnly == true
			})
			
		})

	}

	update() {

	}
}
