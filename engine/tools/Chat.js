export class Chat {
	static {
		this.db = new Db('audioDB', 'clips')
	}

	static async sendAudioBlob(clientId, blob) {
    	Base64.encode(blob, dataUrl => {
        	console.log(dataUrl)
    		this.db.save(clientId, dataUrl)
    	})

    	// Test Code Below -> Remove This In Production Please!
    	this.db.get(clientId, dataUrlFromDb => {
        	console.log(dataUrlFromDb)
        	const blobFromDb = Base64.decode(dataUrlFromDb)
        	const url = URL.createObjectURL(blobFromDb)
        	console.log(blobFromDb)
        	console.log(url)
    	})

    	console.log('sent!')
	}
}