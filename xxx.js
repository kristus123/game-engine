import fs from 'node:fs';
import zlib from 'node:zlib';
import Xml from './Xml.js';

const buffer = fs.readFileSync('ableton_test/2 sanger i en looooooooooooool.als');
const xml = zlib.gunzipSync(buffer).toString('utf8');

const project = Xml.parse(xml);

const locators = Xml.findAll(project, 'Locator');

for (const locator of locators) {
    const time = Xml.find(locator, 'Time')?.attributes.Value;
    const name = Xml.find(locator, 'Name')?.attributes.Value;

    console.log({ name, time });
}

const tempo = Xml.find(project, 'Tempo');

console.log('BPM:', tempo?.attributes.Value);
