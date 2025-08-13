import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 

export class Waves {
	constructor() {


		new Quest([
			() => new class {
				constructor() {

				}
			},
		])
	}
}
