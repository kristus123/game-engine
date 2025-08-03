import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { StopWatch } from '/static/engine/code_tools/StopWatch.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { OnTrue } from '/static/engine/code_tools/on/OnTrue.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

const scale = 8

export class SpriteLayers extends StaticGameObject {
  constructor(position, image, asepriteJson) {
    super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(image, "argument image in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(asepriteJson, "argument asepriteJson in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.image = image; 
		this.asepriteJson = asepriteJson; 


    // --- derive width/height from meta.size (raw frame sizes are uniform per-sheet) ---
    this.position.width  = asepriteJson.meta.size.w * scale
    this.position.height = asepriteJson.meta.size.h * scale

    // --- build a { tagName: [ frameObj0, frameObj1, ... ] } map from the flat frames hash ---
    this.tags = {}
    for (let [key, frameData] of Object.entries(asepriteJson.frames)) {
      // split off the trailing digits as the frame index
      let m = key.match(/(.+?)(\d+)$/)
      if (!m) continue
      let tag   = m[1]
      let idx   = parseInt(m[2], 10)
      if (!this.tags[tag]) this.tags[tag] = []
      this.tags[tag][idx] = frameData.frame
    }

    // quick lookup for total frames per tag
    this.totalFrames = tag => (this.tags[tag] || []).length

    // animation state
    this.currentFrame = 0
    this.type         = 'loop'
    this.onFinish     = () => {}

    // --- re-create your .play/.loop/.show per-tag API ---
    for (let tag of Object.keys(this.tags)) {
      this[tag] = {
        play: (onFinish = () => {}) => {
          this.currentFrame = 0
          this.activeTag    = tag
          this.type         = 'play'
          this.onFinish     = onFinish
          return this
        },
        loop: (onFinish = () => {}) => {
          this.currentFrame = 0
          this.activeTag    = tag
          this.defaultTag   = tag
          this.type         = 'loop'
          this.onFinish     = onFinish
          return this
        },
        show: frame => {
          this.currentFrame = frame
          this.activeTag    = tag
          this.defaultTag   = tag
          this.type         = 'show'
          return this
        },
      }
    }

    // require an 'idle' tag for default
    if (this.idle) {
      this.idle.loop()
    } else {
      throw new Error("SpriteLayers: missing an 'idle' tag in your JSON")
    }

    // --- frame‐advance logic via your StopWatch + LocalObjects ---
    const stopWatch = new StopWatch().start()
    this.localObjects = new LocalObjects([
      new OnTrue(() => stopWatch.time >= 100, () => {
        const tagFrames = this.tags[this.activeTag]
        if (this.type === 'show') {
          // static; do nothing
        }
        else if (this.currentFrame + 1 >= tagFrames.length) {
          this.currentFrame = 0
          if (this.type === 'play') {
            this.activeTag = this.defaultTag
            this.type      = 'loop'
            this.onFinish()
          }
        }
        else {
          this.currentFrame += 1
        }
        stopWatch.restart()
      }),
    ])
  }

  randomStartFrame() {
    const len = this.totalFrames(this.activeTag)
    this.currentFrame = Random.integerBetween(0, len - 1)
    return this
  }

  update() {
    this.localObjects.update()
  }

  draw(draw, guiDraw) {
    // pull the { x,y,w,h } for the current frame
    const rect = this.tags[this.activeTag][this.currentFrame]
    draw.sprite(this.position, rect, this.image)
  }
}

