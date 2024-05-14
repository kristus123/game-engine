export class Http {

	static get(endpoint) {
		const r = new XMLHttpRequest()
		r.open('GET', 'http://localhost:3000' + endpoint, false) // Synchronous request
		r.send()

		if (r.status === 200) {
		  return JSON.parse(r.responseText)
		}
		else {
			throw new Error('Request failed with status: ' + r.status)
		}
	}

	static post(endpoint, body) {
		const r = new XMLHttpRequest()
		r.open('POST', 'http://localhost:3000' + endpoint, false) // Synchronous request
		r.setRequestHeader('Content-Type', 'application/json')

		r.send(JSON.stringify(body, null, 4))
	}
}
