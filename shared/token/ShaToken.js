export class ShaToken {

	static async create() {
		return await this.encode({
			internal: {
				userId: crypto.randomUUID(),
				role: "ROLE_UNSECURE",
				name: "New user",
			},
			unsafe: {
				age: "Your age",
			},
		})
	}

	static async decode(encoded) {
		await Sha.assertValid(encoded)
		return Tapi.decode(encoded)
	}

	static async encode({ internal, unsafe } = {}) {
		const i = Tapi.encodeJson(internal)
		const s = await Sha.sign(i)
		const u = Tapi.encodeJson(unsafe)

		return await Sha.assertValid(`${i}.${s}.${u}`)
	}

	static async update(encoded) {
		Assert.string(encoded)
		await Sha.assertValid(encoded)

		const {
			internal,
			unsafe,
		} = await this.decode(encoded)

		console.log("__")
		console.log(internal)
		console.log("__")
		internal.role = UserId.role(internal.userId)
		console.log("sex")

		return await this.encode({ internal, unsafe })
	}

}
