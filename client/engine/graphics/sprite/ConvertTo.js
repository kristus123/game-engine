export class ConvertTo {

	static integer(str) {
	  if (/^-?\d+$/.test(str)) {
		return Number(str);
	  }
		else {
		throw new Error("only accepts integers, not " + str)	
		}
	}

}
