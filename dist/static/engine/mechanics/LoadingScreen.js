import { Html } from '/static/engine/graphics/ui/html/Html.js'; 

export class LoadingScreen {
	static show(text = 'Loading...') {
		const p = Html.p(text, 'center-ui')
		Html.addToScreen(p)
	}
}
