export class SfuWorld {
	constructor() {
		SfuClient.init()
		SfuRouters.init()

		// SfuRouters.updateRouterList()

		const s = Dom.add(Html.sfu())

		SfuRouters.onRouterCreated = lobby => {
			s.lobbies.add(H.button("join " + lobby.routerId, () => {
				SfuClient.join(lobby.routerId)
			}))
		}

		SfuRouters.onGuestConnection = stream => {
			console.log(stream)
			s.guestWebcam.srcObject = stream
		}

		SfuRouters.onLocalConnection = stream => {
			s.localWebcam.srcObject = stream
		}

		s.create.onClick(() => {
			SfuClient.createRouter(true) // streamOnly == true
		})
	}

	update() {

	}
}
