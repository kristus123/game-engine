const FRONTEND_FOLDERS = REPLACE_WITH_FRONTEND_JSON

function validateUniqueFolderNames(tree) {
	const folderPathsByName = new Map()
	const foldersByName = new Map()
	const validate = (folder, path) => {
		for const [name, contents] of Object.entries(folder) {
			if contents == null || typeof contents != "object" {
				continue
			}

			const folderPath = `${path}/${name}`
			const previousPath = folderPathsByName.get(name)
			if previousPath != null {
				throw new Error(`Duplicate frontend folder name "${name}": ${previousPath}, ${folderPath}`)
			}
			folderPathsByName.set(name, folderPath)
			foldersByName.set(name, contents)
			validate(contents, folderPath)
		}
	}

	validate(tree, "frontend")
	return foldersByName
}

const foldersByName = validateUniqueFolderNames(FRONTEND_FOLDERS)

function folderProxy(folders, path = "Frontend", searchFolders = false) {
	for const [name, contents] of Object.entries(folders) {
		if contents != null && typeof contents == "object" {
			folders[name] = folderProxy(contents, `${path}.${name}`)
		}
	}

	return ProxyObject(() => {}, folders, name => {
		Assert.string(name)
		if searchFolders && foldersByName.has(name) {
			return folderProxy(foldersByName.get(name), `Frontend.${name}`)
		}
		throw new Error(`Frontend folder or file not found: ${path}.${name}`)
	})
}

export const Frontend = folderProxy(FRONTEND_FOLDERS, "Frontend", true)
