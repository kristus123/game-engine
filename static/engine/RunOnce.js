const id = {}

// THIS IS HOW YOU SHOULD USE IT.
// generate_dist.js adds the sugar
//
// runonce(true).then(() => {
// 	console.log("hei!")
// })

export const RunOnce = (uuid, object, condition, run) => {

	if (!(object in id)) {
		id[object] = []
		return false
	}

	const x = !id[object].includes(uuid)

	if (x && condition == true) {
		id[object].push(uuid)

		run()
	}
}

