export class SfuWorld {
	constructor() {

		HttpClient.ping({
			ok: (body) => {
				console.log(body)
			},
			error: (body) => {
				console.log(body)
				console.log("big error baby")
			}
		})

		SfuClient.init()
		SfuRouters.init()

		const s = Dom.add(Html.sfu())
		Dom.add(Html.test())

		SfuRouters.onRouterCreated = lobby => {
			s.lobbies.add(H.button("join " + lobby.routerId, () => {
				SfuClient.joinRouter(lobby.routerId)
			}))
		}

		SfuRouters.onGuestConnection = stream => {
			s.guestWebcam.srcObject = stream
		}

		SfuRouters.onLocalConnection = () => {
			s.localWebcam.srcObject = SfuClient.videoStream.stream
		}

		s.create.onClick(() => {
			SfuClient.createRouter(false) // streamOnly == true
		})

		s.toggleAudio.onClick(() => {
			SfuClient.toggleMic()
		})

		s.toggleVideo.onClick(async () => {
			await SfuClient.toggleVideo()
		})

		s.muteClient.onClick(() => {
			SfuClient.mute(s.clientId.value)
		})
	}

	update() {
		SfuClient.videoStream.update()
	}
}
