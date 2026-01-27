// ClientId(

export class Chat {
	static sendAudioBlob (blob) {
		console.log(`Sending Audio To Server...`)

		HttpClient.uploadFile(blob, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			console.log('sent!')
			ChatDb.save(Random.uuid(), blob)
		})
	}

	static sendAudioBlobToClient(clientId, blob) {
		console.log(`Sending Audio To Server...`)

		HttpClient.uploadFile(blob, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			console.log('sent!')
			SocketClient.sendToClient('NEW_MESSAGE', clientId, {key: clientId});
			ChatDb.save(Random.uuid(), blob)
		})
	}

	static getAudioBlob(folder, callback) {
		console.log(`Getting Audio From Server...`)

		HttpClient.readFiles({ folder: folder }, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			
			for (const index in res) { 
				const byteArray = new Uint8Array(res[index].data)
				const blob = new Blob([byteArray], { type: 'audio/webm' })
				callback(blob)
			}
		})
	}
}