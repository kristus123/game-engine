export class SfuWorld {
	constructor() {
		SfuClient.init()
		SfuRouters.init()

		const s = Dom.add(Html.sfu())

		SfuRouters.onRouterCreated = lobby => {
			s.lobbies.add(H.button("join " + lobby.routerId, () => {
				SfuClient.joinRouter(lobby.routerId)
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
			SfuClient.createRouter(false) // streamOnly == true
		})

		s.toggleAudio.onClick(() => {
			SfuClient.toggleAudio()
		})

		s.toggleVideo.onClick(() => {
			SfuClient.toggleVideo()
		})
	}

	update() {

	}
}
