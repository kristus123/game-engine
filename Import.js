import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";

const cache = new Map();

async function findFile(dir, target) {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		if (entry.name === "node_modules") continue;

		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			const found = await findFile(fullPath, target);
			if (found) return found;
			continue;
		}

		if (entry.name === target) {
			return fullPath;
		}
	}

	return null;
}

export async function Import(name) {
	if (cache.has(name)) {
		return cache.get(name);
	}
	else {
		const filePath = await findFile(process.cwd(), `${name}.js`);

		if (!filePath) {
			throw new Error(`File "${name}.js" not found`);
		}

		const mod = await import(pathToFileURL(filePath));

		if (!(name in mod)) {
			throw new Error(`Export "${name}" not found in ${filePath}`);
		}

		cache.set(name, mod[name]);

		return mod[name];
	}
}
