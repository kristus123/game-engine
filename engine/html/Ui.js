export class Ui {
	static {
		this.grid = {
			top: [],
			left: [],
			right: [],
			mid: [],
			bottom: [],
		}
	}
	
	static overlay(elements) {
		elements = Always.list(elements)

		document.getElementById('ui_elements').appendChild(Html.div('overlay', elements))
		return elements
	}

	static updateGrid() {
		Ui.overlay([
			Html.div('grid', [
				Html.div('grid-top', [
					...this.grid.top,
				]),
				Html.div('grid-left', [
					...this.grid.left,
				]),
				Html.div('grid-right', [
					...this.grid.right,
				]),
				Html.div('grid-mid', [
					...this.grid.mid,
				]),
				Html.div('grid-bottom', [
					...this.grid.bottom,
				]),
			])
		])
	}

	static gridAppend(grid_key, value) {
		value = Always.list(value)
		this.grid[grid_key].push(...value)
		Ui.updateGrid()
	}

	static gridReplace(grid_key, value) {		
		this.grid[grid_key] = Always.list(value)
		Ui.updateGrid()
	}


}
