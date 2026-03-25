export function DbObject(lowDb, o) {
	Assert.notNull(o._dbKey)

	o.delete = () => {
		lowDb.delete(o.value)
	}


	return o

}
