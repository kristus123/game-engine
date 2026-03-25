export class PhoneLayout {
	constructor() {
		return GridTemplate({
			areas: `
				"top"
				"mid"
				"bot"
			`,
			h: "80px 1fr 40px",
			v: "1fr",
		})
	}
}
