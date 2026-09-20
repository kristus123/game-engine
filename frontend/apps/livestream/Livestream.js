export function Livestream() {
	if (Token.isAdmin) {
		Page.init("index", H.create("livestream-body"))
		Page.go("index")
	}
	else if (Token.isUser) {
		Page.init("index", H.create("livestream-body"))
		Page.go("index")
	}
	else {
		throw new Error("unsupported role")
	}
}
