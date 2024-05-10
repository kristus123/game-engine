export class WorldEditor {
  constructor(camera, mouse) {
    camera.followInstantly(
      new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50)
    );

    this.data = Http.get("/canvas-image");
    this.selectedImage = "";

    this.runAll = new RunAll([
      new Controller().control(camera.objectToFollow),
      new StarBackground(camera),
      // new Planet(0, 0),
      // new Grid(mouse),
    ]);

    ObjectPersistence.get().forEach((o) => {
      this.runAll.add(o);
    });

    mouse.addOnClick("paint", async (p) => {
      // making file path for randomise image
      this.selectedImage = `../static/assets/planets/${
        this.data.planets[Math.floor(Math.random() * this.data.planets.length)]
      }`;

      p.height = this.selectedImage.width;
      p.width = this.selectedImage.height;
      const o = new StaticPicture(
        new Position(p.x, p.y, p.width, p.height),
        this.selectedImage
      );
      //   const o = new DynamicGameObject(
      //     new Position(p.x, p.y, p.width, p.height),
      //     100,
      //     100
      //   );
      this.runAll.add(o);
      ObjectPersistence.save(o);
    });

    // mouse.addOnClick("paint", async (p) => {
    //   p.height = 100;
    //   p.width = 100;
    //   // const o = new StaticPicture(
    //   //   new Position(p.x, p.y, p.width, p.height),
    //   //   this.selectedImage
    //   // );
    //   const o = new DynamicGameObject(
    //     new Position(p.x, p.y, p.width, p.height),
    //     100,
    //     100
    //   );
    //   this.runAll.add(o);
    //   ObjectPersistence.save(o);
    // });

    KeyDown("-", () => {
      console.log("zooming out");
      camera.zoom -= 0.5;
    });

    KeyDown("_", () => {
      console.log("zooming in");
      camera.zoom += 1.5;
    });
  }

  update() {
    this.runAll.update();
  }

  draw(draw, guiDraw) {
    this.runAll.draw(draw, guiDraw);
  }
}
