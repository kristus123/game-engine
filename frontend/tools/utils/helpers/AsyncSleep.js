export function AsyncSleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}
