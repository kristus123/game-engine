const p = Html.p('default', 'lower-center-ui pokemon-text')
Html.addToScreen(p)
Html.hide(p)

export class BottomText {


	static show(text, removeAfterMs=null) {

		Html.changeText(p, text)
		Html.show(p)

		if (removeAfterMs) {
			setTimeout(() => {
				Html.hide(p)
			}, removeAfterMs)
		}
	}

}
