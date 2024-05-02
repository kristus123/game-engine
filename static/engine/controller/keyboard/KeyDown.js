export function KeyDown(key, execute) {
	new KeypressEvent().addKeyDownListener(key, execute)
}
