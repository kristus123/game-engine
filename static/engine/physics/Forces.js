export const Forces = {

    push(o, from, options = {}) {
        const multiplier = options.multiplier ?? 1
        const additive = options.additive ?? true
        const dir = Math.atan2(from.y - o.y, from.x - o.x)
        // Push use 100 while ForcePush use 10, this way we can change at will
        const magnitude = options.magnitude ?? 100
        
        // Check if its additive movement like Push or a substitutive like ForcePush
        if (additive) {
            o.velocity.x += Math.cos(dir) * magnitude * multiplier
            o.velocity.y += Math.sin(dir) * magnitude * multiplier
        } else {
            o.velocity.x = Math.cos(dir) * magnitude * multiplier
            o.velocity.y = Math.sin(dir) * magnitude * multiplier
        }
    },

    random(o, options = {}) {
        const pos = {
            x: o.x + Random.integerBetween(-10, 10),
            y: o.y + Random.integerBetween(-10, 10)
        }
        this.push(o, pos, { ...options, additive: false, magnitude: 10 })
    },

    roughlyTowards(o, target, options = {}) {
        const angleSpread = options.angleSpread ?? 0.9
        const dx = target.x - o.x
        const dy = target.y - o.y
        const base = Math.atan2(dy, dx)
        const spread = Random.floatBetween(-angleSpread/2, angleSpread/2)
        const angle = base + spread
        const pseudoTarget = {
            x: o.x + Math.cos(angle) * Random.floatBetween(1, 5),
            y: o.y + Math.sin(angle) * Random.floatBetween(1, 5)
        }
        this.push(o, pseudoTarget, { ...options, additive: false, magnitude: 10 })
    }
}
