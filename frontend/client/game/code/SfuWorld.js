export class SfuWorld {
	constructor() {
		switch "hei" {
			case "hei" {
				console.log("hei")
			}
		}

		// currently not in use
		document.body.dataset.role = "user" // cool, but move somewhere where it makes sense to init it

		Diff.init()

		SfuClient.init()
		SfuRouters.init()

		const html = Dom.add(Html.test())

		html.openChat.onClick(() => {
			html.chat.show()
		})

		html.closeChat.onClick(() => {
			html.chat.hide()
		})

		SfuRouters.onRouterCreated = router => {
			if (!SfuClient.isHost) {
				console.log("joining since we are not host")
				SfuClient.joinRouter(router.routerId) // hack for now
			}
		}

		SfuRouters.onGuestConnection = stream => {
			console.log("Guest Webcam Received")
			html.video.srcObject = stream
		}

		SfuRouters.onLocalConnection = () => {
			console.log("Local Webcam Received")

			html.video.srcObject = SfuClient.videoStream.stream
		}

		SfuRouters.onLocalSetup = async () => {
			Webcam.request(
				async (ok) => {
					if (ok) {
						await Webcam.enable()
						Webcam.routeTo(SfuClient.videoStream)
					}
					else {
						throw new Error("webcam permission not granted")
					}
				}
			)

			await Microphone.enable()
			SfuClient.audioStream.routeTo(Mix.mic)
			Mix.master.volume = 0
		}

		SfuRouters.onMessage = (clientId, message) => {
			html.chatHistory.add(`
				<flex-h class="bgWhite" close>
					<p style="color: purple; margin-right: 10px">Other</p>
					<p>${message}</p>
				</flex-h>
			`.toHtml())
		}

		html.create.onClick(() => {
			if (SfuRouters.routers.empty) {
				SfuClient.createLivestream() // streamOnly == true
			}
			else {
				throw new Error("only one route for now - for testing")
			}
		})

		html.toggle.onClick(async () => {
			await SfuClient.toggleVideo()
		})

		html.message.onEnter(() => {
			html.chatHistory.add(`
				<flex-h class="bgWhite" close>
					<p style="color: green; margin-right: 10px">Me</p>
					<p>${html.message.value}</p>
				</flex-h>
			`.toHtml())
			SfuClient.sendToEveryone({ message: html.message.value })
			html.message.clear()
		})
	}

	update() {
		SfuClient.videoStream.update()
	}
}
