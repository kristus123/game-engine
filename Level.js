// LevelSelector.js

export class LevelSelector {
    constructor(cameraFollow, mouse) {
      this.mouse = mouse;
      this.controller = new Controller(this.player);
      this.player = new Player(mouse, this.controller);
      this.npc = new Npc(mouse, this.controller);
      this.controller.control(this.player);
  
      this.piss = new Piss(this.player, this.mouse);
    }
  
    update() {
      this.player.update();
      this.controller.update();
      this.npc.update();
      this.piss.update();
    }
  
    draw(ctx) {
      this.player.draw(ctx);
      this.npc.draw(ctx);
      this.piss.draw(ctx);
    }
  }
  
  // InsideLevel.js
  
  import { LevelSelector } from "./LevelSelector";
  
  export class InsideLevel extends LevelSelector {
    // Additional properties and methods specific to InsideLevel can be added here
  }
  
  // OutsideLevel.js
  
  import { LevelSelector } from "./LevelSelector";
  
  export class OutsideLevel extends LevelSelector {
    // Additional properties and methods specific to OutsideLevel can be added here
  }
  