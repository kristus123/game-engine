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
			console.log("Guest Webcam Received")
			
			s.guestWebcam.srcObject = stream
		}

		SfuRouters.onLocalConnection = () => {
			console.log("Local Webcam Received")

			s.localWebcam.srcObject = SfuClient.videoStream.stream
		}

		SfuRouters.onMessage = (clientId, message) => {
			console.log("MESSAGE FROM " + clientId + ": ", message)
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

		s.kickClient.onClick(() => {
			console.log("TRYING TO KICK CLIENT: ", s.clientId.value)
			SfuClient.kick(s.clientId.value)
		})

		s.sendMessage.onClick(() => {
			SfuClient.sendToEveryone(s.message.value)
		})
	}

	update() {
		SfuClient.videoStream.update()
	}
}
