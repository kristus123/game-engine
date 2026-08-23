export const SessionId = Random.uuid()

export function Log(...args) {
    const message = args.map(arg => {
        if (arg instanceof Error) return arg.stack || arg.message
        return typeof arg === "string" ? arg : JSON.stringify(arg)
    }).join(" ")

    if (typeof fetch !== "undefined") {
        fetch(`${Config.httpUrl}/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: SessionId, message })
        }).catch(() => {})
    }
}

if (typeof window !== "undefined") {
    const hook = (method, prefix) => {
        const original = console[method]
        console[method] = (...args) => {
            original.apply(console, args)
            Log(prefix, ...args)
        }
    }

    hook("log", "[LOG]")
    hook("warn", "[WARN]")
    hook("error", "[ERROR]")
    
    window.addEventListener("error", e => {
        if (e.error) {
            Log("[UNCAUGHT ERROR]", e.error)
        } else if (e.target && (e.target.src || e.target.href)) {
            Log("[RESOURCE ERROR]", "Failed to load:", e.target.src || e.target.href)
        } else {
            Log("[UNCAUGHT ERROR]", e.message || "Unknown error")
        }
    }, true) // true is required to capture non-bubbling resource errors

    window.addEventListener("unhandledrejection", e => Log("[UNHANDLED PROMISE]", e.reason))
    
    Log("Session started")
}
