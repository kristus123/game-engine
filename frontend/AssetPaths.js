export class AssetPaths {
	static aseprite = ASEPRITE_FILES

	// rename to HTML_TEMPLATES
	static htmlTemplate = HTML_CONTENTS

	// rename to (html)CustomWebComponents
	static htmlComponent = CUSTOM_WEB_COMPONENTS
	static audio = AUDIO_FILES
	static image = IMAGE_FILES

	static resolveImageSource(source) {
		const reference = source.match(/^(png|jpg|jpeg|gif)\.(.*)$/i)
		if !reference {
			return source
		}

		const extension = reference[1].toLowerCase()
		const name = reference[2]
		const matches = this.image.filter(path => {
			const filename = path.split("/").pop()
			const dot = filename.lastIndexOf(".")
			return filename.slice(0, dot) == name && filename.slice(dot + 1).toLowerCase() == extension
		})

		if matches.length == 0 {
			throw new Error(`Image not found: ${source}`)
		}
		if matches.length > 1 {
			throw new Error(`Duplicate image name for ${source}: ${matches.join(", ")}`)
		}
		return matches[0]
	}
}
