export class Story {
	static show(viking) {
    	this.hide()
    	StoryUi.top.add(Html.p(viking.text))
        StoryUi.mid.add(Html.image(viking.image))
		for (const choice of viking.choices) {
  			StoryUi.bottom.add(Html.button(choice.text, choice.onSelect))
		}
	}
    static hide(){
        StoryUi.top.clear()
        StoryUi.mid.clear()
    	StoryUi.bottom.clear()
    }
}


