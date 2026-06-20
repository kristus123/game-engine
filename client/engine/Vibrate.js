export function Vibrate(ms=50) {
	if ("vibrate" in navigator) {
		navigator.vibrate(ms);
	}
}
