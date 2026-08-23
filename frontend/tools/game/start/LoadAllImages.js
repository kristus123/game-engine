export async function LoadAllImages(IMAGE_FILES) {
	return Promise.all(IMAGE_FILES.map(async path => {
		const name = path.split("/").pop().replace(/\.(png|jpg|jpeg|gif)$/i, "")
		try {
			const img = await LoadImage(path)
			Png[name] = img
		}
		catch (e) {
			throw new Error("Error loading image: " + e)
		}
	}))
}
