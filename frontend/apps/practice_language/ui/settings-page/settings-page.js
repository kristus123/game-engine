export const page = {
	persistOnClose: true,
}

export default async () => {

	return {
		methods: {
			installPwa: () => {
				Pwa.install()
			},
		},
	}
}
