const o = []

export const RunOnce = object => {
	return {
		If: (condition, run) => {
			if (!o.includes(object) && condition == true) {
				o.push(object)
				run()
				return true
			}
			else {
				return false
			}
			
		}
		
	}
}
