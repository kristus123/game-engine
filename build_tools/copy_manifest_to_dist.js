import fs from 'fs'
import Path from 'path'
import Files from './Files.js'

import crypto from 'crypto'


import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const mainFilename = process.argv[1]

fs.copyFileSync('manifest.json', 'dist/manifest.json')
fs.copyFileSync('sw.js', 'dist/sw.js')

const sw = Files.read('sw.js')
	.replace('RANDOM_UUID', '"' + crypto.randomUUID() + '"')
	.replace('ALL_FILES', '[' + Files.at(Path.dirname(mainFilename)).map(f => '"/' + f + '"').join(',') + ']')

Files.write('dist/sw.js', sw)
