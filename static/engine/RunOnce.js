const o = []

// THIS IS HOW YOU SHOULD USE IT.
// generate_dist.js adds the sugar
//
// runonce(true).then(() => {
// 	console.log("hei!")
// })

export const RunOnce = (uuid, condition, run) => {
	if (!o.includes(uuid) && condition === true) {
		o.push(uuid)

		run()
	}
}

