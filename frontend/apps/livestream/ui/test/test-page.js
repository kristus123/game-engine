export default () => {

	return {
		page: { persistOnClose: true },
		methods: {
			streamer: () => Page.open("streamer-page"),
			viewer: () => Page.open("viewer-page"),
		},
	}
}
