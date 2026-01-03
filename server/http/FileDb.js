import fs from 'fs';
import path from 'path';

export class FileDb {
	static prefix = path.resolve('./fileDb');

	static ensureFolderExists() {
		if (!fs.existsSync(FileDb.prefix)) {
			fs.mkdirSync(FileDb.prefix, { recursive: true });
		}
	}

	static get(filePath) {
		FileDb.ensureFolderExists();
		const fullPath = path.join(FileDb.prefix, filePath);
		if (!fs.existsSync(fullPath)) return null;

		const content = fs.readFileSync(fullPath); // Buffer
		try {
			const str = content.toString('utf8');
			return JSON.parse(str);
		} catch {
			return content; // Return Buffer if not JSON
		}
	}

	static save(filePath, data) {
		FileDb.ensureFolderExists();
		const fullPath = path.join(FileDb.prefix, filePath);
		const tempPath = fullPath + '.tmp';

		if (typeof data === 'object' && !(data instanceof Buffer)) {
			// JSON object
			fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
		} else {
			// Buffer or string (binary/text file)
			fs.writeFileSync(tempPath, data);
		}

		fs.renameSync(tempPath, fullPath);
	}
}

