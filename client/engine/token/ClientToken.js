export class ClientToken {

	static get() {
		const encoded = Assert.value(localStorage.getItem("clientToken"))

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

	static create(callback = () => {}) {
		HttpClient.createToken({}, body => {
			this.store(body.token)
			callback(this.get())
		})
	}

	static store(token) {
		Assert.value(token)

		if (this.present()) {
			// throw new Error("can't store token if another token is already stored")
		}
		else {
		}
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
		if (localStorage.getItem("clientToken")) {
			return true
		}
		else {
			return false
		}
	}

}
