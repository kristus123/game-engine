export class _HttpClient {

	static get(url) {
		const request = new XMLHttpRequest()
		request.open('GET', url, false) // Synchronous request
		request.send()

		if (request.status === 200) {
			try {
				return JSON.parse(request.responseText)
			}
			catch (e) {
				throw new Error('Error while mapping ' + request.responseText)
			}
		}
		else {
			throw new Error('Request failed with status: ' + request.status)
		}

	}

	static post(url) {
		const xhr = new XMLHttpRequest()
		xhr.open('POST', url, false) // Synchronous request
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
