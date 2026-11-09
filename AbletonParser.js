import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Xml from './Xml.js';

const repoDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.join(repoDirectory, 'ableton_projects', 'voices');
const setPath = path.join(projectDirectory, 'voices.als');
const exportedDirectory = path.join(projectDirectory, 'exported');

export const AbletonParser = (() => {

	const xml = Xml.parseFile(setPath);

	return {
		prepareAssets: () => {
			const tempoNode = xml.find('Tempo');
			const bpm = Number(xml.find('Manual', tempoNode)?.attributes.Value);

			const locatorContainer = xml.find('Locators');
			const locators = xml.findAll('Locator', locatorContainer)
				.map(locator => ({
					name: xml.find('Name', locator)?.attributes.Value,
					time: Number(xml.find('Time', locator)?.attributes.Value),
				}))
				.sort((first, second) => first.time - second.time);

			if (!Number.isFinite(bpm) || bpm <= 0) {
				throw new Error(`Invalid tempo in Ableton set: ${setPath}`);
			}
			if (locators.length === 0 || locators.some(locator => !locator.name || !Number.isFinite(locator.time))) {
				throw new Error(`No valid locators found in Ableton set: ${setPath}`);
			}

			const tracksNode = xml.find('Tracks');
			const audioTracks = xml.findAll('AudioTrack', tracksNode);
			const tracks = {};
			const missingTracks = [];
			const distAudioPaths = [];

			for (const track of audioTracks) {
				const trackNameNode = xml.find('Name', track);
				const trackName = xml.find('EffectiveName', trackNameNode)?.attributes.Value
					|| xml.find('UserName', trackNameNode)?.attributes.Value;
				if (!trackName) continue;

				const filename = `voices ${trackName}.mp3`;
				const sourcePath = path.join(exportedDirectory, filename);
				if (!fs.existsSync(sourcePath)) {
					missingTracks.push(trackName);
					continue;
				}

				const audioPath = `/ableton/${filename}`;
				const distPath = path.join(repoDirectory, 'dist', audioPath.slice(1));
				fs.mkdirSync(path.dirname(distPath), { recursive: true });
				fs.copyFileSync(sourcePath, distPath);
				distAudioPaths.push(audioPath);
				tracks[trackName] = { audioPath, locators };
			}

			return {
				data: { voices: { bpm, tracks, missingTracks } },
				audioPaths: distAudioPaths,
			};
		},
	};
})();
