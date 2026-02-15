import fs from 'fs'
import Path from 'path'
import Files from './Files.js'

import crypto from 'crypto'


import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import FileConfig from '#root/FileConfig.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const mainFilename = process.argv[1]

fs.copyFileSync('manifest.json', path.join(FileConfig.dist, 'manifest.json'))
fs.copyFileSync('sw.js', path.join(FileConfig.dist, 'sw.js'))
fs.copyFileSync('sw-push.js', path.join(FileConfig.dist, 'sw-push.js'))

const sw = Files.read('sw.js')
	.replace('RANDOM_UUID', '"' + crypto.randomUUID() + '"')
	.replace('ALL_FILES', '[' + Files.at(Path.dirname(mainFilename)).map(f => '"/' + f + '"').join(',') + ']')

Files.write(path.join(FileConfig.dist, 'sw.js'), sw)
