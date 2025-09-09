const fs = require('fs')
const path = require('path')




const dirPath = './'

console.log('sex________________________________________________________')
fs.readdir(dirPath, (err, files) => {
	if (err) {
		throw err
	}
	files.forEach(file => {
		const fullPath = path.join(dirPath, file)
		if (fs.statSync(fullPath).isFile()) {
  	console.log(file)
		}
	})
})
console.log('sex________________________________________________________')


fs.copyFileSync('manifest.json', 'dist/manifest.json')
fs.copyFileSync('sw.js', 'dist/sw.js')
