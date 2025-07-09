import { Key } from '/static/engine/controller/keyboard/Key.js'; 
import { KeypressEvent } from '/static/engine/controller/keyboard/KeypressEvent.js'; 

export function KeyDown(key, execute) {
	new KeypressEvent().addKeyDownListener(key, execute)
}
