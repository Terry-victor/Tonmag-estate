const baseUrl = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3210"
const cdpUrl = process.env.AUDIT_CDP_URL || "http://127.0.0.1:9224"
const widths = [320, 360, 375, 390, 430, 640, 768, 820, 1024, 1280, 1920]
const routes = [
  "/", "/sign-in", "/sign-up", "/forgot-password", "/projects", "/view-project/1",
  "/book-a-tour", "/investment-plans", "/credibility-legal", "/about", "/contact",
  "/search", "/dashboard", "/house-types",
]

const targets = await fetch(`${cdpUrl}/json`).then((response) => response.json())
const target = targets.find((item) => item.type === "page")
if (!target) throw new Error("No Chrome page target is available.")

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true })
  socket.addEventListener("error", reject, { once: true })
})

let sequence = 0
const pending = new Map()
const listeners = new Map()
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data)
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) reject(new Error(message.error.message))
    else resolve(message.result)
  }
  for (const listener of listeners.get(message.method) || []) listener(message.params)
})

function send(method, params = {}) {
  const id = ++sequence
  socket.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

function once(method, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const callback = (params) => {
      clearTimeout(timer)
      listeners.set(method, (listeners.get(method) || []).filter((item) => item !== callback))
      resolve(params)
    }
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs)
    listeners.set(method, [...(listeners.get(method) || []), callback])
  })
}

await send("Page.enable")
await send("Runtime.enable")
const failures = []
const checked = []
const browserErrors = []
let currentCheck = null
listeners.set("Runtime.exceptionThrown", [(params) => browserErrors.push({ ...currentCheck, type: "exception", message: params.exceptionDetails?.text || "Runtime exception" })])
listeners.set("Runtime.consoleAPICalled", [(params) => {
  if (params.type === "error") browserErrors.push({ ...currentCheck, type: "console.error", message: params.args?.map((item) => item.value || item.description).filter(Boolean).join(" ") || "Console error" })
}])

for (const route of routes) {
  for (const width of widths) {
    currentCheck = { route, width }
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 })
    const loaded = once("Page.loadEventFired")
    await send("Page.navigate", { url: `${baseUrl}${route}` })
    await loaded
    await send("Runtime.evaluate", {
      awaitPromise: true,
      expression: `new Promise((resolve) => { const started = Date.now(); const ready = () => { if (document.readyState === "complete" && document.querySelector("main")) resolve(true); else if (Date.now() - started > 5000) resolve(false); else setTimeout(ready, 50); }; ready(); })`,
    })
    await new Promise((resolve) => setTimeout(resolve, 350))
    const evaluation = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const viewport = window.innerWidth;
        const rootOverflow = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0) - viewport;
        const isContained = (element) => {
          let parent = element.parentElement;
          while (parent && parent !== document.body) {
            const overflow = getComputedStyle(parent).overflowX;
            if (["auto", "scroll", "hidden", "clip"].includes(overflow)) return true;
            parent = parent.parentElement;
          }
          return false;
        };
        const offenders = [...document.querySelectorAll("body *")].filter((element) => {
          const rect = element.getBoundingClientRect();
          return (rect.right > viewport + 2 || rect.left < -2) && !isContained(element);
        }).slice(0, 5).map((element) => ({ tag: element.tagName, className: String(element.className || "").slice(0, 120), rect: element.getBoundingClientRect().toJSON() }));
        return { title: document.title, path: location.pathname, viewport, rootOverflow, offenders };
      })()`,
    })
    const result = evaluation.result.value
    checked.push({ route, width, renderedPath: result.path })
    if (result.rootOverflow > 2) failures.push({ route, width, ...result })

    if (route === "/" && width <= 430) {
      await send("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => { document.querySelector('[aria-controls="mobile-navigation"]')?.click(); return true; })()`,
      })
      await new Promise((resolve) => setTimeout(resolve, 100))
      const menu = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => ({ button: !!document.querySelector('[aria-controls="mobile-navigation"]'), open: !!document.getElementById('mobile-navigation') }))()` })
      if (!menu.result.value.button || !menu.result.value.open) failures.push({ route, width, navigation: menu.result.value })
    }
  }
}

await send("Browser.close")
socket.close()
console.log(JSON.stringify({ baseUrl, viewports: widths, routes, checks: checked.length, failures, browserErrors }, null, 2))
if (failures.length || browserErrors.length) process.exitCode = 1
