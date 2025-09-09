const fs = require('fs')
const Files = require('./Files')


const crypto = require('crypto')


fs.copyFileSync('manifest.json', 'dist/manifest.json')


fs.copyFileSync('sw.js', 'dist/sw.js')

const sw = Files.read('sw.js')
	.replace("RANDOM_UUID", crypto.randomUUID())
	.replace('ALL_FILES', '[' + Files.at('static').map(f => '"/' + f + '"') + ']')

Files.write('dist/sw.js', sw)
