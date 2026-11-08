export default {
	page: { persistOnClose: true },
	methods: {
		openViewer: () => Page.open("viewer-page"),
		openStreamer: () => Page.open("streamer-page"),
	},
}
