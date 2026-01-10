const allianse = {
	text: 'Handelen går godt, og tillit bygges mellom dem.',
	choices: []
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
	choices: [
		{
  	text: 'Hilser fredelig og tilbyr handel',
  	onSelect: () => console.log('De handler og blir allierte.'),
  	next: allianse
		},
		{
  	text: 'Utfordrer islendingen til holmgang',
  	onSelect: () => console.log('En brutal kamp bryter ut.'),
  	next: kamp
		},
		{
  	text: 'Spør om veien og søker samarbeid',
  	onSelect: () => console.log('De deler kunnskap og planer.'),
  	next: samarbeid
		}
	]
}
