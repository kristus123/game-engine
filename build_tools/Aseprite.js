import { execFileSync } from 'child_process'
import { existsSync } from 'fs'

const bin = (() => {
  const list = [
    'aseprite',
    process.env.HOME + '/aseprite/build/bin/aseprite',
    '/usr/local/bin/aseprite',
    '/usr/bin/aseprite'
  ]
  for (const c of list) {
    try {
      const out = execFileSync('which', [c], { shell: true }).toString().trim()
      if (out) return c
    } catch {}
    if (existsSync(c)) return c
  }
  return 'aseprite'
})()

function runAsepriteCommand(args) {
  return execFileSync(bin, args, { stdio: 'inherit', shell: true })
}

export class Aseprite {
  static tags(src, destBase) {
    runAsepriteCommand([
      '-b',
      src,
      '--split-tags',
      '--list-slices',
      '--sheet', destBase + '.png',
      '--data', destBase + '.json',
      '--format', 'json-array',
      '--filename-format', '{tag}'
    ])
  }

  static layers(src, destBase) {
    runAsepriteCommand([
      '-b',
      '--split-layers',
      src,
      '--sheet', destBase + 'Layers.png',
      '--data', destBase + 'Layers.json',
      '--filename-format', '{layer}_{frame}_{tag}'
    ])
  }

  static tilemaps(src, destBase) {
    runAsepriteCommand([
      '-b',
      src,
      '--script', 'build_json/aseprite_to_json.lua',
      '--',
      destBase + 'Tilemaps.json'
    ])
  }
}
