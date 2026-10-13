export async function LoadAllImages(IMAGE_FILES) {
	const catalogs = { png: Png, gif: Gif, jpg: Jpg, jpeg: Jpeg }
	return Promise.all(IMAGE_FILES.map(async path => {
		const filename = path.split("/").pop()
		const dot = filename.lastIndexOf(".")
		const name = filename.slice(0, dot)
		const extension = filename.slice(dot + 1).toLowerCase()
		try {
			await LoadImage(path)
			catalogs[extension][name] = path
		}
		catch (e) {
			throw new Error("Error loading image: " + e)
		}
	}))
}
