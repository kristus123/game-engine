export class B64 {

	static encode(payload) {
		return Buffer.from(JSON.stringify(payload)).toString("base64url")
	}

	static decode(encoded) {
		return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))
	}

}

