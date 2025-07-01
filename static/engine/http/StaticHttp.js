export class StaticHttp {

	static get(endpoint) {
		return _HttpClient.get(endpoint)
	}

}
