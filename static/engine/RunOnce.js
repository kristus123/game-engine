const id = {}

// generate_dist.js adds uuid and object, you should only add condition and run

export const RunOnce = (uuid, object, condition, run) => {

	if (!(object in id)) {
		id[object] = []
		return false
	}

	const x = !id[object].includes(uuid)

	if (x && condition) {
		id[object].push(uuid)

		run()
	}
}

