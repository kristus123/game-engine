import { MultiTextTyper } from '/static/engine/mechanics/dialogue/MultiTextTyper.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 

export function Monologue(position) {
	return new MultiTextTyper(position, [
		'use wasd or arrows to drive',
		'Current objective:',
		'Deliver package',
		'',
		'',
		'Would be nice to have a greater purpose',
		'',
		'',
		'Maybe one day',
		'',
		'',
		'But not today',
	])
}
