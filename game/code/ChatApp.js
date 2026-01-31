// ClientId(

export class ChatApp {
	constructor() {
        this.roomId = ""
        this.text = ""
        this.startSync = false
        this.length = 0

        const chatUi = Html.div('chatUi', [
                Html.input('roomId', value => {
                    this.roomId = value
                }),
                
                Html.button("join/create", () => {
                    if(this.roomId != ""){
                        this.startSync = true

                        Html.removeChildElements(chatUi)

                        Html.appendBody([
                            Html.input('type here', value => {
                                this.text = value
                                }),
                            Html.button("send", () => {
                                if(this.text != ""){
                                    Chat.sendJson({rootDir: this.roomId, originClientId: ClientId, text: this.text})
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
        }, 1000)
	}

	update() {

	}
}
