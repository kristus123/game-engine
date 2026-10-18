export default async ({ html }) => {
	const attributes = [
		["offset-x", "--offset-x"],
		["offset-y", "--offset-y"],
		["offset-width", "--offset-width"],
	]

	for const [attribute, property] of attributes {
		if html.hasAttribute(attribute) {
			html.style.setProperty(property, html.getAttribute(attribute))
		}
	}
}
