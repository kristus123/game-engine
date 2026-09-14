export class Font {

	static async load(name, url) {
		const font = new FontFace(name, `url(${url})`)
		await font.load()
		document.fonts.add(font)
	}

	static use(name, element = document.documentElement) {
		element.style.fontFamily = name
	}

}
