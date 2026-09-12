export default async ({ html, setState }) => {

	Pwa.init(() => {
		html.mid.add(H.button("install", () => {
			Pwa.install()
		}))
	})

	return {
	}
}
