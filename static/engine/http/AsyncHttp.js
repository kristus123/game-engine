export class AsyncHttp {
	constructor() {
	}

	async getData() {
		  try {
			const response = await fetch('https://example.com/data')

			if (!response.ok) {
			  throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json() // or .text() for plain text
			console.log(data)
		  }
		catch (error) {
			console.error('Fetch error:', error)
		  }
	}
}
