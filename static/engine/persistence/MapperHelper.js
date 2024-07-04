export class MapperHelper {

	static jsObjectIsvalidJson(o) {
		try {
			const jsonString = JSON.stringify(o); // Convert object to JSON string
			JSON.parse(jsonString); // Parse JSON string back to object

			return true; // Both operations succeeded
		} catch (e) {
			return false; // An error occurred during serialization or parsing
		}
	}

	static getClassFromString(className) {
		try {
			return eval(className)
		}
		catch (e) {
			throw new Error(`you need to add 'import' for ${jsonObject.className} in ObjectMapper.js`)
		}
		
	}
}
