export default async ({ html, setState }) => {

	return {
		methods: {
			installPwa: () => {
				Pwa.install()
			},
		},
	}
}
