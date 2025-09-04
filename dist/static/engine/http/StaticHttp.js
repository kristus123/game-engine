import { _HttpClient } from '/static/engine/http/_HttpClient.js'; 

export class StaticHttp {

	static get(endpoint) {
		return _HttpClient.get(endpoint)
	}

}
