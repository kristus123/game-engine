export class SfuWorld {
	constructor() {
		const s = Dom.add(Html.sfu())

		SfuClient.onNewLobbyCreated = lobby => {
			s.lobbies.add(H.button("join"), () => {
				SfuClient.joinLobby(lobby.routerId)
			})
		}

		VideoCamera.request(async (ok) => {
			if (ok) {
				await SfuClient.init()
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
