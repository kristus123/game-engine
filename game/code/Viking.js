const allianse = {
	text: 'Handelen går godt, og tillit bygges mellom dem.',
	choices: [
		{
			text: "God natt",
			onSelect: () => {
				Story.hide()
			}
		}
	]
}

const kamp = {
	text: 'Kampen er over. Skjebnen er avgjort.',
	choices: []
}

const samarbeid = {
	text: 'Sammen legger de planer for nye reiser.',
	choices: []
}

export const Viking = {
	text: 'En viking fra Norge går i land på Island og møter en islandsk viking ved kysten.',
	image: "https://www.denofgeek.com/wp-content/uploads/2022/04/Alexander-Skarsgard-shirtless-as-The-Northman.jpeg?fit=1200%2C720",
	choices: [
		{
			text: 'Hilser fredelig og tilbyr handel',
			onSelect: () => {
				console.log('De handler og blir allierte.')
				Story.show(allianse)
			} ,
		},
	]
}
