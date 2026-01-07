export class Config {
	static get baseUrl() {
		switch (ENVIRONMENT) {
			case 'DEVELOPMENT': {
				return 'http://localhost:3000'
			}
			case 'PRODUCTION': {
				return 'https://myproductionurl.com'
			}
			default: {
				throw new Error("unexpected environment given")
			}
		}
	}
}
