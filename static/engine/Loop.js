export class Loop {
  static fps = 0;
  static lastUpdated = 0;

  static everyFrame(run, targetFPS = 60) {
    const targetFrameTime = 1000 / targetFPS;
    let lastTimestamp = performance.now();
    let accumulatedTime = 0;

    function loop(currentTimestamp) {
      const deltaTime = currentTimestamp - lastTimestamp;
      lastTimestamp = currentTimestamp;

      accumulatedTime += deltaTime;

      // Update the game logic at a fixed time step
      while (accumulatedTime >= targetFrameTime) {
        run(targetFrameTime / 1000); // Pass fixed time step to the game logic
        accumulatedTime -= targetFrameTime;
      }

      if (Loop.lastUpdated > 10) {
        Loop.fps = Math.floor(1000 / deltaTime);
        Loop.lastUpdated = 0;
      } else {
        Loop.lastUpdated += 1;
      }

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }
}
