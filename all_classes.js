const fs = require('fs')
const path = require('path')

function extractClassesAndMethods(content) {
	// Regular expressions to match exported class and method definitions
	const exportClassRegex = /export\s+class\s+(\w+)\s*\{/g
	const methodRegex = /(?:\s|^)(\w+)\s*\(([^)]*)\)\s*{/g

	let classes = []

	// Extract exported class names
	let match
	while ((match = exportClassRegex.exec(content)) !== null) {
		const className = match[1]
		const methods = []

		// Extract methods for each exported class
		methodRegex.lastIndex = match.index
		while ((match = methodRegex.exec(content)) !== null) {
			const methodName = match[1]
			const methodParameters = match[2].split(',').map(param => param.trim())

			if (methodName != 'for' && methodName != 'if') {
		  methods.push({ methodName, methodParameters })
			}
		}

		classes.push({ className, methods })
	}

	return classes
}

function processFilesInFolder(folderPath) {
	try {
		console.log('Processing JavaScript files in folder:', folderPath)

		let summary = []

		function processFile(filePath) {
			try {
				const isDirectory = fs.statSync(filePath).isDirectory()

				if (isDirectory) {
					console.log('Processing directory:', filePath)

					// Recursively process files in the subdirectory
					const subFiles = fs.readdirSync(filePath)
					subFiles.forEach(subFile => {
						const subFilePath = path.join(filePath, subFile)
						processFile(subFilePath)
					})
				}
				else if (path.extname(filePath) === '.js') {
					const fileContent = fs.readFileSync(filePath, 'utf-8')
					console.log('Processing file:', filePath)

					const classes = extractClassesAndMethods(fileContent)
					if (classes.length > 0) {
						summary = summary.concat(classes)
					}
				}
			}
			catch (error) {
				console.error('Error reading file/directory:', filePath, error.message)
			}
		}

		processFile(folderPath)

		return summary
	}
	catch (error) {
		console.error('Error reading folder:', folderPath, error.message)
		return []
	}
}

const folderPath = 'static/'
const classInfo = processFilesInFolder(folderPath)

// console.log('\nList of classes and methods:');
// console.log(JSON.stringify(classInfo, null, 2));

// Additional formatted output for better human readability
console.log('\nFormatted Output:')
classInfo.forEach(({ className, methods }) => {
	console.log(`\nClass: ${className}`)
	methods.forEach(({ methodName, methodParameters }) => {
		console.log(`  ${methodName}(${methodParameters.join(', ')})`)
	})
})

