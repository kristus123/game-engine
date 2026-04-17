let currentId = localStorage.getItem("currentId")

if (!currentId) {
	const response = await fetch("/currentId")
	const data = await response.json()
	localStorage.setItem("currentId", data.currentId)
}

setInterval(async () => {
	const response = await fetch("/currentId")
	const data = await response.json()

	if (data.currentId !== currentId) {

		localStorage.setItem("currentId", data.currentId)

		Dom.overlay(Html.p("RELOADING").css("color:white; font-size:150px;"))

		setTimeout(() => {
			location.reload()
		}, 20)
	}

}, 100)
