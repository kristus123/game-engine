import webPush from "web-push"

const vapidKeys = webPush.generateVAPIDKeys()

webPush.setVapidDetails(
	"mailto:example@yourdomain.org",
	vapidKeys.publicKey,
	vapidKeys.privateKey
)

let subscription = null

Route.add("getVapidPublicKey", () => {
	return {
		publicKey: vapidKeys.publicKey.replace(/-/g, "+").replace(/_/g, "/")
	}
})

Route.add("subscribe", ({ body }) => {
	subscription = body.subscription
	return { status: "server success" }
})

Route.add("triggerNotification", ({ body }) => {
	webPush.sendNotification(subscription, JSON.stringify({
		title: body.title,
		body: body.body
	}))

	return { status: "server success" }
})
