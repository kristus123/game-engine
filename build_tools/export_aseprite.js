const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ASEPRITE_PATH = "aseprite"; // adjust if necessary
const SRC_DIR = path.join(__dirname, "../static/assets/aseprite");
const DEST_BASE = path.join(__dirname, "../static/assets");

function walk(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else if (entry.isFile() && fullPath.endsWith(".aseprite")) {
      callback(fullPath);
    }
  });
}

function getRelativeDestPath(srcFile) {
  const relPath = path.relative(SRC_DIR, srcFile);
  const parsed = path.parse(relPath);
  const newFolder = path.join(DEST_BASE, parsed.dir);
  const destFolder = newFolder.replace(path.sep + "aseprite", "");
  return path.join(destFolder, `${parsed.name}.png`);
}

function exportAseprite(srcFile, destFile) {
  const destDir = path.dirname(destFile);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log(`Exporting: ${srcFile} -> ${destFile}`);
  execFileSync(ASEPRITE_PATH, [
    "-b", srcFile,
    "--sheet", destFile
  ]);
}

walk(SRC_DIR, srcFile => {
  const destFile = getRelativeDestPath(srcFile);
  exportAseprite(srcFile, destFile);
});

