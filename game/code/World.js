// ClientId(

export class World {
	constructor() {
		PushClient.register()

		Dom.overlay([
			Html.div('pushTestDiv', [
				Html.button('Subscribe', () => {
					HttpClient.getVapidPublicKey({}, res => {
						const vapid = Base64.validateString(res.publicKey)
						PushClient.subscribe(vapid)
					})
				}),

				Html.button('Push Notification', () => {
					PushClient.push('this is a title', 'this is body')
				}),
			])
		])
	}

	update() {}

	draw(draw) {}
}
