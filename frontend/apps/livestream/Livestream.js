export function Livestream() {
	if (Token.admin) {
		Page.init("index", H.create("streamer-page"))
		Page.go("index")
	}
	else if (Token.user) {
		Page.init("index", H.create("viewer-page"))
		Page.go("index")
	}
	else {
		console.log(Token.user)
		throw new Error("unsupported role: " + Token.role)
	}
}
