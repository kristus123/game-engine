export class Markdown {
	static toHtml(x) {

		x = x.replace(/^###### (.*)$/gm, "<h6>$1</h6>")
		x = x.replace(/^##### (.*)$/gm, "<h5>$1</h5>")
		x = x.replace(/^#### (.*)$/gm, "<h4>$1</h4>")
		x = x.replace(/^### (.*)$/gm, "<h3>$1</h3>")
		x = x.replace(/^## (.*)$/gm, "<h2>$1</h2>")
		x = x.replace(/^# (.*)$/gm, "<h1>$1</h1>")

		x = x.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

		x = x.replace(/\*(.*?)\*/g, "<em>$1</em>")

		x = x.replace(/`(.*?)`/g, "<code>$1</code>")

		x = x.replace(/\[(.*?)\]\((.*?)\)/g, "<a href=\"$2\">$1</a>")

		x = x.replace(/!\[(.*?)\]\((.*?)\)/g, "<img src=\"$2\" alt=\"$1\">")

		x = x.replace(/^(?!<h|<ul|<ol|<li|<blockquote|<pre|<img)(.+)$/gm, "<p>$1</p>")

		x = x.replace(/\n/g, "<br>")

		// Features NOT implemented:
		// - Ordered and unordered lists properly
		// - Blockquotes
		// - Code blocks (```)
		// - Tables
		// - Nested formatting beyond simple inline tags

		return x
	}
}

