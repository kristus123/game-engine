export default ({ html }) => {

	return {
		methods: {
			streamer: () => {
				Page.init("x", H.create("streamer-page"))
				Page.go("x")
			},
			viewer: () => {
				Page.init("x", H.create("viewer-page"))
				Page.go("x")
			},
		},
	}
}
