const { execSync } = require('child_process')

module.exports = command => {
	try {
		const output = execSync(command, { stdio: 'pipe' }).toString()
		console.log(`stdout: ${output}`)
	}
	catch (error) {
		console.log(`error: ${error}`)
		if (error.stderr) {
			console.log(`stderr: ${error.stderr.toString()}`)
		}
	}
}
