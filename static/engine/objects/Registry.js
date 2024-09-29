export class Registry {
	static {
		this.enemies = []
		this.invisibleWalls = []

		this.player = null
	}

	static add(o) {
		if (o instanceof Enemy) {
			Registry.enemies.push(o)
		}
		else if (o instanceof Player) {
			this.player = o
		}
		else if (o instanceof InvisibleWall) {
			this.invisibleWalls.push(o)
		}
	}

	static remove(o) {
		List.remove(this.enemies, o)
	}

}
