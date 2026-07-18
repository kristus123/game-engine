export class Diff {
	static add = "DIFF_TYPE_ADD"
	static set = "DIFF_TYPE_SET"
	static remove = "DIFF_TYPE_REMOVE"

	static init () {
		const client = { users: [] }
		const server = { users: ["user_1"] }

		for (const d of client.diff(server)) {
			console.log(d)
			if (d.add) {
				if (d.path[0] == "users") {
					console.log("new user joined")
				}
				client.applyDiff(d)
			}
			else if (d.set) {
				client.applyDiff(d)
			}
			else if (d.remove) {
				client.applyDiff(d)
			}
			else {
				throw new Error("unsupported type: " + d.type)
			}
		}
	}
}
