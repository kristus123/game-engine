export default async () => {

	return {
		page: { persistOnClose: true },
		methods: {
			installPwa: () => {
				Pwa.install()
			},
		},
	}
}
