// ClientId(

export class World {
	constructor() {
		PushClient.register()

		Dom.overlay([
			Html.div('pushTestDiv', [
				Html.button('Subscribe', () => {
					HttpClient.getVAPID({}, res => {
						const vapid = res.key.replace(/-/g, '+').replace(/_/g, '/')
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
