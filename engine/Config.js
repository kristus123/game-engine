export class Config {
	static get baseURL() {
		switch (activeEnv) {
  	case 'DEV':
    	return 'http://localhost:3000'
  	case 'PROD':
    	return 'https://myproductionurl.com'
		}
	}
}
