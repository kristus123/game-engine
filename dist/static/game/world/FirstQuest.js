import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Chicken } from '/static/engine/chicken_stuff/Chicken.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Distance } from '/static/engine/code_tools/misc/Distance.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { Level } from '/static/engine/core/Level.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { DeliveryZone } from '/static/engine/mechanics/DeliveryZone.js'; 
import { MovableObjects } from '/static/engine/mechanics/MovableObjects.js'; 
import { MultiTextTyper } from '/static/engine/mechanics/dialogue/MultiTextTyper.js'; 
import { TextTyper } from '/static/engine/mechanics/dialogue/TextTyper.js'; 
import { Quest } from '/static/engine/mechanics/quest/Quest.js'; 
import { QuestList } from '/static/engine/mechanics/quest/QuestList.js'; 
import { Cargo } from '/static/engine/mechanics/vehicle/Cargo.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { DeliveryDrone } from '/static/game/delivery_drone/DeliveryDrone.js'; 
import { D } from '/static/game/world/D.js'; 
import { Npc } from '/static/game/world/Npc.js'; 

class ONE_DeliverChickens {
	constructor(chickens) {

				AssertNotNull(chickens, "argument chickens in " + this.constructor.name + ".js should not be null")
			
		this.chickens = chickens; 

		this.deliveryZone = new DeliveryZone(new Position(-1_000, 0, 100, 100), chickens)
		QuestList.clear()
		this.p = QuestList.add('Deliver chickens to the new destination')
	}

	completed() {
		if (this.deliveryZone.amountDelivered == 2) {
			this.p.completed()
			return true
		}
		else {
			return false
		}
	}

	update() {
		this.deliveryZone.update()
	}

	draw(draw, guiDraw) {
		this.deliveryZone.draw(draw, guiDraw)
	}
}

class TWO_DriveChickens {
	constructor(chickens, player) {
		this.player = player

		this.p = QuestList.add('drive them to wacky mac!')

		this.deliveryZone = new DeliveryZone(new Position(1_000, 1_000, 64*10, 64*10), chickens)

		const building = new Picture(this.deliveryZone.position, '/static/assets/building/wacky_mac_warehouse_64x64.png')
		this.deliveryZone.draw = (draw, guiDraw) => {
			building.draw(draw, guiDraw)
		}

		this.npc = new Npc(player.position.copy().set(200))
		this.text = new MultiTextTyper(this.npc.position.offset(0, -20), [
			'welcome!',
			'time to get to work',
			'time to get to work',
			'time to get to work',
			'time to get to work',
			'time to get to work',
			'time to get to work',
		])

		const deliveryDrone = new DeliveryDrone(new Position(0, 0), player)

		this.localObjects = new LocalObjects([
			deliveryDrone,
			this.deliveryZone,
			new Cargo(chickens, deliveryDrone),
			this.npc,
		])
	}

	completed() {
		if (this.deliveryZone.amountDelivered == 2) {
			this.p.completed()
			return true
		}
		else {
			return false
		}
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		if (Distance.within(100, this.npc, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
		}
		else {
			draw.text(this.npc, 'come closer dude')
		}

		this.localObjects.draw(draw, guiDraw)
	}
}

class InsideWackyMac {
	constructor(player) {
		Camera.followInstantly(player)
		Controller.control(player)

		this.localObjects = new LocalObjects([
			player
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}

export class FirstQuest {
	constructor(player) {
		const chickens = [
			// new Chicken(new Position(0, 0)),
			// new Chicken(new Position(-200, 0)),
			// new Chicken(new Position(-400, 0)),
			// new Chicken(new Position(-100, 0)),
		]

		for (const c of chickens) {
			player.gun.hittableObjects.push(c)
		}

		// QuestList.show()

		this.localObjects = new LocalObjects([
			//new MovableObjects(player, chickens),
			new Quest([
				() => new ONE_DeliverChickens(chickens),
				// () => new TWO_DriveChickens(chickens, player),
			],
			() => {
				Level.change(new InsideWackyMac(player))
			}),
			...chickens,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
