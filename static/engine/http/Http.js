function _get(port, endpoint) {
		const xhr = new XMLHttpRequest()
		xhr.open('GET', 'http://localhost:' + port + endpoint, false) // Synchronous request
		xhr.send()

		if (xhr.status === 200) {
			try {
				return JSON.parse(xhr.responseText)
			}
			catch (e) {
				throw new Error('Error while mapping ' + xhr.responseText)
			}
		}
		else {
			throw new Error('Request failed with status: ' + xhr.status)
		}
	
}
export class Http {

	static get(endpoint) {
		try {
			return _get(3000, endpoint)
		} catch (error) {
			return _get(5000, endpoint)
		}
	}

	static post(endpoint, body) {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', 'http://localhost:3000' + endpoint, false) // Synchronous request
		xhr.setRequestHeader('Content-Type', 'application/json')

		xhr.send(JSON.stringify(body, null, 4))

		if (xhr.status === 200) {
			// everything is ok
		}
		else {
		  console.error('Request failed with status:', xhr.status)
		}

	}
}
