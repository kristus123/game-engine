class RunOnceChecker {
  constructor() {
    this.id = {};
  }

  runOnce(uuid, object, functionToRun) {
    if (!(object in this.id)) {
      this.id[object] = [];
    }

    if (!this.id[object].includes(uuid)) {
      this.id[object].push(uuid);
      functionToRun();
    }
  }
}


const runOnceChecker = new RunOnceChecker()
const activeBlock = 0

export const Steps = {

	runOnce(uuid, object, run) {
		runOnceChecker.runOnce(uuid, object, run)
		activeBlock = uuid + 1
	},

	wait() {
		
	},
	
}







