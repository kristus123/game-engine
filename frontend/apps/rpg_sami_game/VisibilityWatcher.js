export function VisibilityWatcher(el, options = {}) {
	const {
		root = null,
		rootMargin = "100px 1000px",
		threshold = 0,
		onEnter = () => {},
		onLeave = () => {}
	} = options

	const observer = new IntersectionObserver(([entry]) => {
		if (entry.isIntersecting) {
  	onEnter(el, entry)
		}
		else {
  	onLeave(el, entry)
		}
	}, {
		root,
		rootMargin,
		threshold
	})

	observer.observe(el)

	return () => observer.unobserve(el)
}
