export default {
	page: {
		persistOnClose: true,
	},
	methods: {
		installPwa: () => {
			Pwa.install()
		},
	},
}
