import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Xml from './Xml.js';

const repoDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectsDirectory = path.join(repoDirectory, 'ableton_projects');
const outputXml = true;

export const AbletonParser = (() => {
	return {
		prepareAssets: () => {
			const projects = {};
			const distAudioPaths = [];

			for (const projectName of fs.readdirSync(projectsDirectory)) {
				const projectDirectory = path.join(projectsDirectory, projectName);
				if (!fs.statSync(projectDirectory).isDirectory()) continue;
				const setPath = path.join(projectDirectory, `${projectName}.als`);
				if (!fs.existsSync(setPath)) continue;
				const outputPath = outputXml ? path.join(projectDirectory, 'output.xml') : null;
				const xml = Xml.parseAls(setPath, outputPath);
				const bpm = Number(xml.find('Tempo').find('Manual').attributes.Value);

				const locators = xml.find('Locators').findAll('Locator')
					.map(locator => ({
						name: locator.find('Name').attributes.Value,
						time: Number(locator.find('Time').attributes.Value),
					}))
					.sort((first, second) => first.time - second.time);

				if (!Number.isFinite(bpm) || bpm <= 0) {
					throw new Error(`Invalid tempo in Ableton set: ${setPath}`);
				}
				if (locators.length === 0 || locators.some(locator => !locator.name || !Number.isFinite(locator.time))) {
					throw new Error(`No valid locators found in Ableton set: ${setPath}`);
				}

				const audioTracks = xml.find('Tracks').findAll('AudioTrack');
				const tracks = {};
				const missingTracks = [];
				const exportedDirectory = path.join(projectDirectory, 'exported');

				for (const track of audioTracks) {
					const trackName = track.find('Name').find('EffectiveName')?.attributes.Value
						|| track.find('Name').find('UserName')?.attributes.Value;
					if (!trackName) continue;

					const filename = `${projectName} ${trackName}.wav`;
					const sourcePath = path.join(exportedDirectory, filename);
					if (!fs.existsSync(sourcePath)) {
						missingTracks.push(trackName);
						continue;
					}

					const audioPath = `/ableton/${projectName}/${filename}`;
					const distPath = path.join(repoDirectory, 'dist', audioPath.slice(1));
					fs.mkdirSync(path.dirname(distPath), { recursive: true });
					fs.copyFileSync(sourcePath, distPath);
					distAudioPaths.push(audioPath);
					tracks[trackName] = { audioPath, locators };
				}

				if (missingTracks.length > 0) {
					throw new Error(`Missing exported Ableton tracks in ${projectName}: ${missingTracks.join(', ')}`);
				}

				projects[projectName] = { bpm, locators, tracks };
			}

			return { data: projects, audioPaths: distAudioPaths };
		},
	};
})();
