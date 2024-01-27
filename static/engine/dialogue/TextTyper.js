export class TextTyper {
    constructor(textToType, framesPerLetter) {
        this.textToType = textToType;
        this.currentIndex = 0;
        this.isTyping = true;
        this.ready = false;
        this.framesPerLetter = framesPerLetter || 5
        this.frameCount = 0;
		this.firstTimeFinish = new FirstTimeFinish(() => this.text == this.textToType)
    }

    update() {
		if (this.firstTimeFinish.returnTrueIfFinishedOnce()) {
			Call(this.onFinish)
		}

        if (this.currentIndex < this.textToType.length && this.frameCount % this.framesPerLetter === 0) {
            this.currentIndex++;
        } else if (this.currentIndex >= this.textToType.length) {
            this.isTyping = false;
        }

        this.frameCount++;

    }

    get text() {
        return this.textToType.substring(0, this.currentIndex);
    }

    get finishedTyping() {
        return 
    }
}
