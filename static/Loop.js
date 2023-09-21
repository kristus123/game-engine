export class Loop {
	constructor() {
		this.fps = 120;
		this.lastUpdated = 0;
		this.frameInterval = 10;
	};

	everyFrame(run) {
		let lastTimestamp = performance.now();
		const loop = (currentTimestamp) => {
			const deltaTime = (currentTimestamp - lastTimestamp) / 1000
			lastTimestamp = currentTimestamp;
			run(deltaTime)
			if (this.lastUpdated > 10) {
				this.lastUpdated = 0
			} else {
				this.lastUpdated += 1
			};
			requestAnimationFrame(loop);
		};
		requestAnimationFrame(loop);
	};

};
