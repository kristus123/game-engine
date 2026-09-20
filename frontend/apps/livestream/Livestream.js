export function Livestream() {
	if (Token.isAdmin) {
		Page.init("index", H.create("streamer-page"))
		Page.go("index")
	}
	else if (Token.isUser) {
		Page.init("index", H.create("viewer-page"))
		Page.go("index")
	}
	else {
		throw new Error("unsupported role: " + Token.role)
	}
}
