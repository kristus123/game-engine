export class Loop {
	constructor(fps, frameInterval) {
		this.fps = fps;
		this.lastUpdated = 0;
		this.frameInterval = frameInterval;
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
