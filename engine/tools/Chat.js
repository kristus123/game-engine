export class Chat {
	static sendAudioBlob(blob) {
    	Base64.encode(blob, encodedBlob => {
        	console.log(encodedBlob)

			console.log(`Sending Audio To Server...`)
			HttpClient.uploadFile({ data: encodedBlob }, res => {
				console.log(`Server Response: ${JSON.stringify(res)}`)
				console.log('sent!')
			})
    	})
	}

	static getAudioBlob(key, callback) {
		console.log(`Getting Audio From Server...`)
		
		HttpClient.readFile({ filename: key }, res => {
			console.log(`Server Response: ${JSON.stringify(res)}`)
			callback(Base64.decode(res.data))
		})
	}
}