export class Http {

	static get(endpoint) {
		return _HttpClient.get('http://localhost:3000' + endpoint)
	}

	static post(endpoint, body) {
		return _HttpClient.post('http://localhost:3000' + endpoint)
	}
}
