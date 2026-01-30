const giveToEnemies = {
	text: 'Have him bound in ropes, and give him to his enemies. [increases relationship with the neighboring clan]',
	choices: [
		{
			text: 'Continue',
			onSelect: () => Story.hide()
		}
	]
}

const turnHimAway = {
	text: 'Turn him away [does nothing]',
	choices: [
		{
			text: 'Continue',
			onSelect: () => Story.hide()
		}
	]
}

const letManGo = {
	text: 'Let the man go, he is only bound to cause you trouble with your neighbor. [Nothing happens]',
	choices: [
		{
			text: 'Continue',
			onSelect: () => Story.hide()
		}
	]
}

const letManGoWithSupplies = {
	text: 'Let the man go, but provide for him a horse and provisions for his journey. [You gain a slight increase to your reputation]',
	choices: [
		{
			text: 'Continue',
			onSelect: () => Story.hide()
		}
	]
}

const takeAsWarrior = {
	text: 'Take him in as a warrior of your household. [decreases relationships with the neighboring clan, you get a moderately skilled and very loyal new warrior]',
	choices: [
		{
			text: 'Continue',
			onSelect: () => Story.show(neighborClanDemand)
		}
	]
}

const healedManEvent = {
	text: 'The wounded man you took in a moons turn ago is now in hale condition. It\'s become clear over time that he indeed possesses the skills of a warrior [depending on your own skills here you can determine how skilled he actually is]. Now he is back to health and ready to continue his travels, he tells the clanspeople that he likely intends to go further [direction opposite of the clan he feuds with], though he seems unsure of this.',
	choices: [
		{
			text: 'Let the man go, he is only bound to cause you trouble with your neighbor.',
			onSelect: () => Story.show(letManGo)
		},
		{
			text: 'Let the man go, but provide for him a horse and provisions for his journey.',
			onSelect: () => Story.show(letManGoWithSupplies)
		},
		{
			text: 'Take him in as a warrior of your household',
			onSelect: () => Story.show(takeAsWarrior)
		}
	]
}

const neighborClanDemand = {
	text: 'Men of the [neighboring clan name] arrive at the edge of your clan lands, and hail some of your men asking to meet with the chief of your clan. They claim that you\'re harboring an enemy of theirs, and ask you to hand him over.',
	choices: [
		{
			text: '"He is apart of our household now, we will not give him over."',
			onSelect: () => {
				console.log('a further decrease in relationship with this clan')
				Story.hide()
			}
		},
		{
			text: 'Lie to their faces, claim that you have no idea what they\'re talking about.',
			onSelect: () => {
				const success = Math.random() > 0.5
				if (success) {
					Story.show(lieSuccess)
				}
				else {
					Story.show(lieFailure)
				}
			}
		},
		{
			text: 'Agree to give him up. You don\'t want to start a feud over one man.',
			onSelect: () => {
				console.log('you take a small hit to your reputation for being powerful, you take a small hit to your reputation for honor, your warriors mood takes a hit.')
				Story.hide()
			}
		}
	]
}

const lieFailure = {
	text: 'The [neighboring clan name] has discovered your deception, their chief is furious at you for secretly harboring their enemy.',
	choices: [
		{
			text: 'Continue',
			onSelect: () => Story.hide()
		}
	]
}

const lieSuccess = {
	text: 'The wounded man you took in seems to be doing well among your other warriors, fortunately the [neighboring clan name] seems to have concluded that the man is already dead.',
	choices: [
		{
			text: 'Continue',
			onSelect: () => Story.hide()
		}
	]
}

export const Viking = {
	text: 'Event - Wounded Man Found A man is found wounded just a few minutes walk outside of your stead, he has been shot by arrows, some of them still in him. He is brought before you, wheezing. He claims to be a thane from [neighboring clan name] who was outlawed on account of a blood feud, he says that he fell off his horse on account of his wounds, during the escape into your lands. He now begs you to let him have hospitality as he has nowhere else to go.',
	image: 'https://www.denofgeek.com/wp-content/uploads/2022/04/Alexander-Skarsgard-shirtless-as-The-Northman.jpeg?fit=1200%2C720',
	choices: [
		{
			text: 'Have him bound in ropes, and give him to his enemies.',
			onSelect: () => Story.show(giveToEnemies)
		},
		{
			text: 'Turn him away',
			onSelect: () => Story.show(turnHimAway)
		},
		{
			text: 'Give him hospitality, and nurse his wounds.',
			onSelect: () => Story.show(healedManEvent)
		},
		{
			text: 'Take him in as a warrior of your household.',
			onSelect: () => Story.show(takeAsWarrior)
		}
	]
}
