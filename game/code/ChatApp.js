// ClientId(

export class ChatApp {
	constructor() {
        this.roomId = "" // Store The Currently Joined RoomId Here
        this.text = "" // Temoprary Variable To Store The Current Message To Send
        this.startSync = false // Tells If We Are Ready To Sync
        this.length = 0 // Total Text Messages Since Last Sync
        this.lengthBlob = 0 // Total Audio Messages Since Last Sync

        const chatUi = Html.div('chatUi', [
                Html.input('roomId', value => {
                    this.roomId = value
                }),
                
                Html.button("join/create", () => {
                    if(this.roomId != ""){
                        this.startSync = true // Start Syncing After Joining A Room

                        Html.removeChildElements(chatUi)

                        Html.appendBody([
                            Html.button('Record Audio', () => {
                                Microphone.start()
                            }),
                            Html.button('Send Audio', () => {
                                Microphone.stop(blob => {
                                    Chat.sendAudioBlob(this.roomId, blob)
                                })
                            }),
                            Html.input('type here', value => {
                                this.text = value
                            }),
                            Html.button("Send Text", () => {
                                if(this.text != ""){
                                    Chat.sendJson(this.roomId, {originClientId: ClientId, text: this.text})
                                }else{
                                    console.log("no message")
                                }
                            })
                        ])
                    }else{
                        console.log("no roomId")
                    }
                })
        ])
        
        Dom.overlay(chatUi)

        setInterval(() => {
            if (!this.roomId || !this.startSync){
                return
            }

            console.log("syncing...")

            // Sync Json
            Chat.getJson(this.roomId, (texts) => {
                if (!texts){
                    return
                } else if (this.length == texts.length) {
                    return
                }

                const totalNew = texts.length - this.length
                const newTexts = texts.slice(texts.length - totalNew)

                for (const index in newTexts){
                    const text = newTexts[index]
                    Html.appendBody([
                        Html.p(`${JSON.stringify(text.originClientId)}: ${text.text}`, 'message')
                    ])  
                }

                this.length = texts.length  
            })

            // Sync Audio Blobs
            Chat.getAudioBlob(this.roomId, (blobs) => {
                if (!blobs){
                    return
                } else if (this.lengthBlob == blobs.length) {
                    return
                }

                const totalNew = blobs.length - this.lengthBlob
                const newBlobs = blobs.slice(blobs.length - totalNew)

                for (const index in newBlobs){
                    const blob = Chat.blobify(newBlobs[index])
                    const url = URL.createObjectURL(blob)
                    console.log(url)
                    Html.appendBody([
                        Html.link("audio message", url)
                    ])  
                }

                this.lengthBlob = blobs.length  
            })
        }, 1000)
	}

	update() {

	}
}
