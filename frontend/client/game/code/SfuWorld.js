export class SfuWorld {
	constructor() {
		SfuClient.init()
		SfuRouters.init()

		const html = Dom.add(Html.sfu())

		SfuRouters.onRouterCreated = lobby => {
			html.lobbies.add(H.button("join " + lobby.routerId, () => {
				SfuClient.joinRouter(lobby.routerId)
			}))
		}

		SfuRouters.onGuestConnection = stream => {
			console.log("Guest Webcam Received")
			
			html.guestWebcam.srcObject = stream
		}

		SfuRouters.onLocalConnection = () => {
			console.log("Local Webcam Received")

			html.localWebcam.srcObject = SfuClient.videoStream.stream
		}

		SfuRouters.onMessage = (clientId, message) => {
			console.log("MESSAGE FROM " + clientId + ": ", message)
		}

		html.create.onClick(() => {
			SfuClient.createRouter(true) // streamOnly == true
		})

		html.toggleAudio.onClick(() => {
			SfuClient.toggleMic()
		})

		html.toggleVideo.onClick(async () => {
			await SfuClient.toggleVideo()
		})

		html.muteClient.onClick(() => {
			SfuClient.mute(html.clientId.value)
		})

		html.kickClient.onClick(() => {
			console.log("TRYING TO KICK CLIENT: ", html.clientId.value)
			SfuClient.kick(html.clientId.value)
		})

		html.sendMessage.onClick(() => {
			SfuClient.sendToEveryone(html.message.value)
		})
	}

	update() {
		SfuClient.videoStream.update()
	}
}
