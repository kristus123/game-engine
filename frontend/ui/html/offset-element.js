export default async ({ html }) => {
	const attributes = [
		["offset-x", "--offset-element-x"],
		["offset-y", "--offset-element-y"],
		["offset-width", "--offset-element-width"],
	]

	for const [attribute, property] of attributes {
		if html.hasAttribute(attribute) {
			html.style.setProperty(property, html.getAttribute(attribute))
		}
	}
}
