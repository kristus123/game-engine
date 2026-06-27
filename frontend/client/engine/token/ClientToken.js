export class ClientToken {

	static get() {
		const encoded = localStorage.getItem("clientToken")

		Assert.value(encoded)

		const [
			internalData,
			internalDataSignature,
			unsafeData,
		] = encoded.split(".")

		return {
			internal: JSON.parse(Base64.decode(internalData)),
			unsafe: JSON.parse(Base64.decode(unsafeData)),
		}
	}

	static async createAndStore() {
		if (this.present) {
			throw new Error("You can't create a token if you already have a token")
		}
		else {
			const body = await HttpClient.createToken({})
			this.store(body.token)
		}
	}

	static store(token) {
		Assert.value(token)

		if (this.present) {
			throw new Error("can't store token if another token is already stored")
		}
		else {
			localStorage.setItem("clientToken", token)
		}
	}

	static remove() {
		if (this.present) {
			localStorage.removeItem("clientToken")
		}
		else {
			throw new Error("Token can't be deleted as there is no token stored")
		}
	}

	static get present() {
		if (localStorage.getItem("clientToken")) {
			return true
		}
		else {
			return false
		}
	}

	static async init() {
		if (this.present) {
			console.log("token already present")
		}
		else {
			console.log("creating new token")
			await this.createAndStore()
		}
	}
}
