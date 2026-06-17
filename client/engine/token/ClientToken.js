export class ClientToken {

	static async init() {
		if (!this.present) {
			console.log("Tonkin is not present.")
			await this.create()
		}

		const token = this.get()

		My.token = Assert.value(token)
		My.userId = Assert.string(token.internal.userId)
	}

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

	static async create() {
		if (this.present) {
			throw new Error("currently not allowed to create if token already created")
		}
		else {
			const body = await HttpClient.createToken()
			this.store(body.token)
		}
	}

	static store(token) {
		Assert.string(token)

		if (this.present()) {
			throw new Error("can't store token if another token is already stored")
		}
		else {
			localStorage.setItem("clientToken", token)
		}
	}

	static remove() {
		if (this.present()) {
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

}
