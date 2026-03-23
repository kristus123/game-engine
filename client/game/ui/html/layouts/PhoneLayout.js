export class PhoneLayout {
	constructor() {
		return GridTemplate({
			areas: `
				"top"
				"mid"
				"bot"
			`,
			h: "100px 1fr 100px",
			v: "1fr",
		})
	}
}
