import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Grid } from '/static/engine/graphics/grid/Grid.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D1 } from '/static/engine/start/D1.js'; 
import { Scale } from '/static/game/Scale.js'; 

export class LargeTile {
  constructor() {


    this.grid = new Grid()
    this.tileSize = 128
    this.gridSize = 16
    this.cellsCovered = this.tileSize / this.gridSize

  }

  update() {
	const p = this.grid.snappedPosition(Mouse.position)

	  for (const x of p.split(16)) {
		  D1.rectangle(x)
	  }

	  
	  console.log(p.split(16*Scale.value))

	  this.grid.area(p)
	  
    D1.picture(p, G.image.house)
  }
}

