console.log("if crash, run:")
console.log("npm i -g puppeteer")

import puppeteer from "puppeteer"



const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()

page.on("console", msg => console.log(msg.text()))

await page.goto("http://localhost:5050")
