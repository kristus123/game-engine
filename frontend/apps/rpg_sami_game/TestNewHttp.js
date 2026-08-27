export class TestNewHttp {
	constructor() {
		JsonHttpClient.ping({
			body: {},
			ok: body => {
				console.log("Everything Is OK! HTTP Body: ", body)
			},
			error: body => {
				console.log("NOTHING IS OKAY! >:(")
			}
		})

		this.testNew()
	}

	update() {}

	async testNew() {
		const { ok, error, body } = await JsonHttpClient.anEndpointThatDoesNotExistWhateverYouDoOnTheCircuitDoNotTurnLeft()

		console.log(`Response is ${ok}, the error is ${JSON.stringify(error)} and the body is ${body}`)
	}
}