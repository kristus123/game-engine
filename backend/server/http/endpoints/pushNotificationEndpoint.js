import webPush from "web-push"

const vapidKeys = webPush.generateVAPIDKeys()

webPush.setVapidDetails(
	"mailto:example@yourdomain.org",
	vapidKeys.publicKey,
	vapidKeys.privateKey
)

let subscription = null

Route.getVapidPublicKey = () => {
	return {
		publicKey: vapidKeys.publicKey.replace(/-/g, "+").replace(/_/g, "/")
	}
}

Route.subscribe = ({ body }) => {
	subscription = body.subscription
	return { status: "server success" }
}

Route.triggerNotification = ({ body }) => {
	webPush.sendNotification(subscription, JSON.stringify({
		title: body.title,
		body: body.body
	}))

	return { status: "server success" }
}
