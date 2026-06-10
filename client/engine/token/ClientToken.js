export class ClientToken {

	static get() {
		const encoded = Assert.value(localStorage.getItem("clientToken"))

		const [
			internalData,
			internalDataSignature,
			unsafeData,
		] = encoded.split(".")

		return {
			internal: Base64.decode(internalData),
			unsafe: Base64.decode(unsafeData),
		}
	}

	static create() {
		HttpClient.createToken({}, body => {
			this.store(body.token)
		})
	}

	static store(token) {
		Assert.value(token)

		localStorage.setItem("clientToken", token)
	}

	static remove() {
		if (this.present()) {
			localStorage.removeItem("clientToken")
		}
		else {
			throw new Error("Token can't be deleted as there is no token stored")
		}
	}

	static present() {
		return Assert.value(localStorage.getItem("clientToken"))
	}

	static getFields() {

	}
}
