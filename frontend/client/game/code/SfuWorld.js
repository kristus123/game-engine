export class SfuWorld {
	constructor() {
		document.body.dataset.role = "user" // cool, but move somewhere where it makes sense to have it. maybe My.js

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

		SfuRouters.onMessage = (clientId, message) => {
			html.chatHistory.add(`
				<flex-h class="bgWhite" close>
					<p style="color: purple; margin-right: 10px">Other</p>
					<p>${message}</p>
				</flex-h>
			`.toHtml())
		}

		html.create.onClick(() => {
			SfuClient.createRouter(true) // streamOnly == true
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
