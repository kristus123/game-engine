ErrorHandler.run(() => {
  const mainPalette = Palette.main();
  const guiPalette = Palette.offscreen();
  const backgroundPalette = Palette.offscreen();
  const showLogs = new ShowLogs(guiPalette);

  const camera = new Camera();
  const mouse = new Mouse(camera);
  camera.mouse = mouse;

  const draw = new Draw(camera.palette.ctx);
  const guiDraw = new Draw(guiPalette.ctx);

  const controller = new Controller();
  const allGameObjects = new AllGameObjects();

  const levelSelector = new LevelSelector();
  // levelSelector.changeActiveLevel(new World(levelSelector, allGameObjects, camera, mouse, controller))
  levelSelector.changeActiveLevel(new WorldEditor(camera, mouse));

  Overlay.create();

  Loop.everyFrame((deltaTime) => {
    ErrorHandler.run(() => {
      Palette.clear([camera.palette, guiPalette]);

      Physics.global.update(deltaTime);

      camera.context(() => {
        controller.update();
        controller.draw(draw, guiDraw);

        levelSelector.update();
        levelSelector.draw(draw, guiDraw);

        allGameObjects.update();
        allGameObjects.draw(draw, guiDraw);
      });

      showLogs.draw();

      Palette.fill(backgroundPalette, "#130927");
      // new Draw.text(guiPalette.ctx, 20, 20, 80, 80, Loop.fps)
      Palette.apply(mainPalette, [
        backgroundPalette,
        camera.palette,
        guiPalette,
      ]);
    });
  });
});
