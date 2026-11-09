import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import Xml from './Xml.js';

const repoDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.join(repoDirectory, 'ableton_projects', 'voices');
const setPath = path.join(projectDirectory, 'voices.als');
const exportedDirectory = path.join(projectDirectory, 'exported');

export function prepareAbletonAssets() {
	const compressedSet = fs.readFileSync(setPath);
	const xml = zlib.gunzipSync(compressedSet).toString('utf8');
	const project = Xml.parse(xml);
	const tempoNode = Xml.find(project, 'Tempo');
	const bpm = Number(Xml.find(tempoNode, 'Manual')?.attributes.Value);
	const locatorContainer = Xml.find(project, 'Locators');
	const locators = Xml.findAll(locatorContainer, 'Locator')
		.map(locator => ({
			name: Xml.find(locator, 'Name')?.attributes.Value,
			time: Number(Xml.find(locator, 'Time')?.attributes.Value),
		}))
		.sort((first, second) => first.time - second.time);

	if (!Number.isFinite(bpm) || bpm <= 0) {
		throw new Error(`Invalid tempo in Ableton set: ${setPath}`);
	}
	if (locators.length === 0 || locators.some(locator => !locator.name || !Number.isFinite(locator.time))) {
		throw new Error(`No valid locators found in Ableton set: ${setPath}`);
	}

	const tracksNode = Xml.find(project, 'Tracks');
	const audioTracks = Xml.findAll(tracksNode, 'AudioTrack');
	const tracks = {};
	const missingTracks = [];
	const distAudioPaths = [];

	for (const track of audioTracks) {
		const trackNameNode = Xml.find(track, 'Name');
		const trackName = Xml.find(trackNameNode, 'EffectiveName')?.attributes.Value
			|| Xml.find(trackNameNode, 'UserName')?.attributes.Value;
		if (!trackName) continue;

		const filename = `voices ${trackName}.mp3`;
		const sourcePath = path.join(exportedDirectory, filename);
		if (!fs.existsSync(sourcePath)) {
			missingTracks.push(trackName);
			continue;
		}

		const distFilename = `voices-${trackName}.mp3`;
		const audioPath = `/ableton/${distFilename}`;
		const distPath = path.join(repoDirectory, 'dist', audioPath.slice(1));
		fs.mkdirSync(path.dirname(distPath), { recursive: true });
		fs.copyFileSync(sourcePath, distPath);
		distAudioPaths.push(audioPath);
		tracks[trackName] = { audioPath, locators };
	}

	const mixSourcePath = path.join(exportedDirectory, 'voices.mp3');
	let mixAudioPath = null;
	if (fs.existsSync(mixSourcePath)) {
		mixAudioPath = '/ableton/voices-mix.mp3';
		const mixDistPath = path.join(repoDirectory, 'dist', mixAudioPath.slice(1));
		fs.mkdirSync(path.dirname(mixDistPath), { recursive: true });
		fs.copyFileSync(mixSourcePath, mixDistPath);
		distAudioPaths.push(mixAudioPath);
	}

	return {
		data: { voices: { bpm, tracks, missingTracks, mixAudioPath } },
		audioPaths: distAudioPaths,
	};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const result = prepareAbletonAssets();
	console.log(JSON.stringify(result, null, 2));
}
