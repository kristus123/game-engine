import puppeteer from "puppeteer"

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()

page.on("console", msg => console.log(msg.text()))

await page.goto("http://localhost:5000")
