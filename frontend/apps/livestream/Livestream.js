export function Livestream() {
	const html = Page.init("index", H.create("livestream-body"))

	Page.init("wow", `
		<overlay>
			<h1>hei</h1>
		</overlay>
	`.toHtml())

	Page.go("index")
}
