import { Methods } from '#root/transpiledBackend/server/http/Methods.js'; 

import webPush from "web-push"

const vapidKeys = webPush.generateVAPIDKeys()

webPush.setVapidDetails(
	"mailto:example@yourdomain.org",
	vapidKeys.publicKey,
	vapidKeys.privateKey
)

let subscription = null

Methods.add("getVapidPublicKey", () => {
	return {
		publicKey: vapidKeys.publicKey.replace(/-/g, "+").replace(/_/g, "/")
	}
})

Methods.add("subscribe", ({ body }) => {
	subscription = body.subscription
	return { status: "server success" }
})

Methods.add("triggerNotification", ({ body }) => {
	webPush.sendNotification(subscription, JSON.stringify({
		title: body.title,
		body: body.body
	}))

	return { status: "server success" }
})
