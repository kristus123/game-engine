export class SfuWorld {
	constructor() {
		const s = Dom.add(Html.sfu())

		SfuClient.onNewLobbyCreated(lobby => {
			s.lobbies.add(H.button("join"), () => {
				SfuClient.joinLobby(lobby.routerId)
			})
		})

		Webcam.request(async (ok) => {
			if (ok) {
				s.localCam.srcObject = await Webcam.enable()
				SfuClient.createLobby()
			}
			else {
				throw new Error("explosion")
			}
		})
	}

	update() {

	}
}
