export const page = {
	persistOnClose: true,
}

export default async () => {
	const logHover = ({ origin, hovering }) => {
		console.log("onHover", origin.id, hovering)
	}
	return {
		onHover: {
			heiOne: logHover,
			heiTwo: logHover,
			heiThree: logHover,
			adviceWise: ({ origin, popover, hovering }) => {
				if hovering {
					popover.h1.content = Random.uuid()
					popover.p.content = `Triggered by ${origin.tag}`
				}
			},
		},
	}
}
