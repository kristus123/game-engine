export const WorkerFile = "path to this file which is set by transpiler"

let array = null

self.onmessage = (e) => {
	array = e.data
}
