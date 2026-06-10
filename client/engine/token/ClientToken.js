export class ClientToken {

	static get() {
    	return Assert.value(localStorage.getItem("clientToken"))
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
}
