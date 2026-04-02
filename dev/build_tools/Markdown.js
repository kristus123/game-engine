export class Markdown {
	static toHtml(md) {
	// Headings
		md = md.replace(/^###### (.*)$/gm, "<h6>$1</h6>")
		md = md.replace(/^##### (.*)$/gm, "<h5>$1</h5>")
		md = md.replace(/^#### (.*)$/gm, "<h4>$1</h4>")
		md = md.replace(/^### (.*)$/gm, "<h3>$1</h3>")
		md = md.replace(/^## (.*)$/gm, "<h2>$1</h2>")
		md = md.replace(/^# (.*)$/gm, "<h1>$1</h1>")

		// Inline formatting
		md = md.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
		md = md.replace(/\*(.*?)\*/g, "<em>$1</em>")
		md = md.replace(/`(.*?)`/g, "<code>$1</code>")
		md = md.replace(/\[(.*?)\]\((.*?)\)/g, "<a href=\"$2\">$1</a>")
		md = md.replace(/!\[(.*?)\]\((.*?)\)/g, "<img src=\"$2\" alt=\"$1\">")

		// Wrap plain lines in <p>
		md = md.replace(
  	/^(?!<h|<ul|<ol|<li|<blockquote|<pre|<img|<p)(.+)$/gm,
  	"<p>$1</p>"
		)

		// Replace newlines inside <p> with <br>
		md = md.replace(/<p>(.*?)<\/p>/gs, (match, content) => {
			return `<p>${content.replace(/\n/g, "<br>")}</p>`
		})

		return md
	}
}
