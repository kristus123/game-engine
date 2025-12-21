export function LoadImage(path) {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.src = path
		img.onerror = reject

		if (img.complete) {
			resolve(img)
		}
		else {
			img.onload = () => resolve(img)
		}
	})
}


