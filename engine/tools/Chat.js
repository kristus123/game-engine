export class Chat {
	static async sendAudioBlob(clientId, blob) {
    	console.log(blob)
    	AudioDb.save(clientId, blob)
    	console.log('sent!')
	}
}