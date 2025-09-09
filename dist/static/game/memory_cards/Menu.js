import { Flex } from '/static/engine/html/Flex.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { EditMemories } from '/static/game/memory_cards/EditMemories.js'; 
import { Practice } from '/static/game/memory_cards/Practice.js'; 
import { RecordButton } from '/static/game/memory_cards/RecordButton.js'; 

export class Menu {
	constructor() {


		Html.fillList([
			Flex.container([
				Html.button('practice', () => {
					new Practice()
				}),
				Html.button('record more', () => {
					new RecordButton()
				}),
				Html.button('edit memories', () => {
					new EditMemories()
				}),
			])
		])
	}
}
