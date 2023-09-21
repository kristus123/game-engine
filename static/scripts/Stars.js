import { Draw } from '/static/scripts/Draw.js'
import { Random } from '/static/scripts/Random.js'


const MIN_STAR_SIZE = 0.1;
const MAX_STAR_SIZE = 3.0;

const generateStars = (map, numberOfStars = 1000) => {
	const stars = [];
	for (let i = 0; i < numberOfStars; i++) {
		const x = Random.numberBetween(-map.width, map.width);
		const y = Random.numberBetween(-map.height, map.height);
		const width = Random.numberBetween(MIN_STAR_SIZE, MAX_STAR_SIZE);
		const height = width;
		stars.push({ x, y, width, height });
	}
	return stars;
};

export class Stars {
	constructor(map) {
		this.stars = generateStars(map);
	};

	draw(palette) {
		this.stars.forEach((star) => {
			const { x, y, width, height } = star;
			Draw.rectangle(palette.ctx, x, y, width, height)
		});
	};

};
