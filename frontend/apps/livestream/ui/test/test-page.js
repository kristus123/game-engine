export const page = {
	persistOnClose: true,
}

export default {
	methods: {
		streamer: () => Page.open("streamer-page"),
		viewer: () => Page.open("viewer-page"),
	},
}
