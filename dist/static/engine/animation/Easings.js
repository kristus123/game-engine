
export const Easings = {
	linear: t => t,
	easeInQuad: t => t * t,
	easeOutQuad: t => t * (2 - t),
	easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

	// Simple bounce out effect
	bounceOut: t => {
		const n1 = 7.5625;
		const d1 = 2.75;
		if (t < 1 / d1) {
			return n1 * t * t;
		} else if (t < 2 / d1) {
			return n1 * (t -= 1.5 / d1) * t + 0.75;
		} else if (t < 2.5 / d1) {
			return n1 * (t -= 2.25 / d1) * t + 0.9375;
		} else {
			return n1 * (t -= 2.625 / d1) * t + 0.984375;
		}
	},

	overshootOut: t => {
		const s = 1.70158;
		return --t * t * ((s + 1) * t + s) + 1;
	},

	overshootIn: t => {
		const s = 1.70158;
		return t * t * ((s + 1) * t - s);
	},
};

