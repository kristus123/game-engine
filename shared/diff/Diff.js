export class Diff {
	static add = "DIFF_TYPE_ADD"
	static set = "DIFF_TYPE_SET"
	static remove = "DIFF_TYPE_REMOVE"

	static init () {
		const client = { hello: "wow" }
		const server = { hello: "now" }

		for (const d of client.diff(server)) {
			console.log(d)

			if (d.type == Diff.set) {
				client.applyDiff(d)
			}
			else if (d.type == Diff.add) {
				client.applyDiff(d)
			}
			else if (d.type == Diff.remove) {
				client.applyDiff(d)
			}
			else {
				throw new Error("unsupported type: " + d.type)
			}
		}
	}
}
