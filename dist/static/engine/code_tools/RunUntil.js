
const id = {}

export const RunUntil = (uuid, object, condition, run) => {
	if (!(object in id)) {
		id[object] = []
	}

	if (id[object].includes(uuid)) {
		return // finished
	}
	else if (condition) {
		id[object].push(uuid)
	}
	else {
		run()
	}
}
