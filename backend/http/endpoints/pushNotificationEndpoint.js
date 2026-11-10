import webPush from "web-push"

const vapidKeys = webPush.generateVAPIDKeys()

webPush.setVapidDetails(
	"mailto:example@yourdomain.org",
	vapidKeys.publicKey,
	vapidKeys.privateKey
)

let subscription = null

UnsecureRoute.getVapidPublicKey = () => {
	return {
		publicKey: vapidKeys.publicKey.replace(/-/g, "+").replace(/_/g, "/")
	}
}

UnsecureRoute.subscribe = ({ body }) => {
	subscription = body.subscription
	return { status: "server success" }
}

UnsecureRoute.unsubscribe = ({ body }) => {
	if (subscription?.endpoint == body.endpoint) {
		subscription = null
	}
	return { status: "server success" }
}

UnsecureRoute.triggerNotification = async ({ body }) => {
	if (!subscription) {
		throw new Error("No push notification subscription is registered")
	}

	await webPush.sendNotification(subscription, JSON.stringify({
		title: body.title,
		body: body.body
	}))

	return { status: "server success" }
}
