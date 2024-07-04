// hack to import necessary stuff
// new Chicken(
// new InvisibleWall(

export class ObjectMapper {
	static mapFrom(jsonObject) {
		try {
			eval(jsonObject.className)
		}
		catch (e) {
			throw new Error(`you need to add 'import' for ${jsonObject.className} in ObjectMapper.js`)
		}

		const c = eval(jsonObject.className)
		if (!c.mapFromJsonObject) {
			throw new Error(`you need to add 'static mapFromJsonObject(json) {...}' method in ${jsonObject.className} to be able to persist it`)
		}

		try {
			return c.mapFromJsonObject(jsonObject)
		}
		catch (error) {
			throw new Error(`error while mapping json object ${jsonObject.className} to js object:<hr>${error}`)
		}
	}
}
