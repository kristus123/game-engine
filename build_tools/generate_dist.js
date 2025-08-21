const Files = require('./Files')

require('./transpiler')
require('./copy_asset_folder_to_dist')
require('./generate_helper_classes')


const allAsepritePaths = Files.at('static/assets/aseprite')
	.map(f => f.replace('/aseprite', ''))
	.map(f => f.replace('\\aseprite', '')) // for windows compability (i assume)
	.map(f => f.replace('.aseprite', ''))
	.map(f => `/${f}`)
	.map(f => `"${f}"`)
	.map(f => f.replace(/\\/g, '/'))
Files.replace('dist/static/engine/start/index.js', 'ASEPRITE_FILES', `[${allAsepritePaths}]`)


const jsImports = require('./js_files')
	.map(f => `<script type="module" src="${f}"></script>`)
	.join('\n')

const cssImports = Files.at('static/ui/css')
	.map(f => f.replaceAll('\\', '/')) // for windows compability
	.map(f => Files.read(f))
	.join('\n')

const indexHtml = Files.read('static/start/index.html')
	.replace('SCRIPT_IMPORTS', jsImports)
	.replace('CSS_IMPORTS', cssImports)
Files.write('dist/start/index.html', indexHtml)
