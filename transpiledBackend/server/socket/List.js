
export class List extends SuperClass {

	static remove(list, o) {
			Assert.notNull(list, 'param 1 - list - List.remove')
			Assert.notNull(o, 'param 2 - o - List.remove')
		for (let i = list.length - 1; i >= 0; i--) {
			if (list[i] == o) {
				list.splice(i, 1)
				break
			}
		}
	}
}
