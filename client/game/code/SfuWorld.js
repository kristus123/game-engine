export class SfuWorld {
	constructor() {
		SfuClient.init()

		const s = Dom.add(Html.sfu())

		SfuClient.onNewLobbyCreated = lobby => {
			s.lobbies.add(H.button("join " + lobby.routerId, () => {
				SfuClient.joinLobby(lobby.routerId)
			}))
		}

		SfuClient.onGuestConnection = stream => {
			s.guestWebcam.srcObject = stream
		}

		Webcam.request(async (ok) => {
			if (ok) {
				await Webcam.enable()
				console.log(s.localWebcam)
				s.localWebcam.srcObject = Webcam.stream
				SfuClient.createLobby()
			}
			else {
				throw new Error("explosion")
			}
		})

		s.create.onClick(() => {
			SfuClient.createLobby()
		})
	}

	update() {

	}
}
