export class Chat {
	static sendAudioBlob(clientId, blob) {
		console.log(`Sending Audio To Server...`)

		HttpClient.uploadFile(blob, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			console.log('sent!')

			const filename = res.filename
			console.log(`sending key: ${filename} to client: ${clientId}...`)
			SocketClient.sendToClient('NEW_MESSAGE', clientId, {key: filename});
		})
	}

	static getAudioBlob(key, callback) {
		console.log(`Getting Audio From Server...`)

		HttpClient.readFile({ filename: key }, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			const byteArray = new Uint8Array(res.data)
			const blob = new Blob([byteArray], { type: 'audio/webm' })
			callback(blob)
		})
	}
}