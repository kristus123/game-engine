export class Ui {

	static add(element) {
		document.getElementById('ui_elements').appendChild(element)
		return element
	}

	static upperLeft(elements) {
		return Html.addToScreen(
			Html.div('upper-left-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static upperRight(elements) {
		return Html.addToScreen(
			Html.div('upper-right-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static left(elements) {
		return Html.addToScreen(
			Html.div('left-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static right(elements) {
		return Html.addToScreen(
			Html.div('right-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static upper(elements) {
		return Html.addToScreen(
			Html.div('upper-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static lower(elements) {
		return Html.addToScreen(
			Html.div('lower-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}


	static center(elements) {
		return Html.addToScreen(
			Html.div('center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static centerList(elements) {
		return Html.addToScreen(
			Html.div('center-ui', [
				Html.div('', elements)
			]))
	}

	static fill(elements) {
		return Html.addToScreen(
			Html.div('fill-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static fillList(elements) {
		return Html.addToScreen(
			Html.div('fill-ui', [
				Html.div('', elements)
			]))
	}

	static lowerCenter(elements) {
		return Html.addToScreen(
			Html.div('lower-center-ui', [
				Html.div('shoulder-to-shoulder', elements)
			]))
	}

	static clearCenter() {
		document.querySelector('.center-ui').remove()
	  Mouse.hoveringHtmlElement = false
	}


	static clearLower() {
		document.querySelector('.lower-center-ui').remove()
	  Mouse.hoveringHtmlElement = false
	}


	static clear() {
		const elements = document.getElementById('ui_elements').querySelectorAll('*')

		for (const el of elements) {
			el.remove()
		}

	  Mouse.hoveringHtmlElement = false
	}


}
