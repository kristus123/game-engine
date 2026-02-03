// ClientId(

export class Chat {
	static sendJson(roomId, json) {
		HttpClient.uploadFile(json, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			console.log('sent!')
		}, {folder: `${roomId}/json`})
	}

	static getJson(roomId, callback) {
		HttpClient.readFiles({ folder: `${roomId}/json` }, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			callback(res)
		})
	}
	
	static sendAudioBlob (roomId, blob) {
		console.log('Sending Audio To Server...')

		HttpClient.uploadFile(blob, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			console.log('sent!')
			ChatDb.save(Random.uuid(), blob)
		}, {folder: `${roomId}/audio`})
	}

	static getAudioBlob(roomId, callback) {
		console.log('Getting Audio From Server...')

		HttpClient.readFiles({ folder: `${roomId}/audio` }, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			callback(res)

		})
	}
}