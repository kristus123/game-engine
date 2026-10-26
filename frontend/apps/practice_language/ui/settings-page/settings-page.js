export const page = {
	persistOnClose: true,
}

export default {
	methods: {
		installPwa: () => {
			Pwa.install()
		},
	},
}
