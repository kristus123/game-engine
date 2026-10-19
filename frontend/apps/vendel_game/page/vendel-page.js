const advisors = [
	{
		name: "Eira",
		image: "wise",
		description: "Eira reads the old signs and remembers the roads that have vanished.",
		advice: [
			"I have a thought, though the road may surprise us.",
			"Every path teaches us something new.",
			"Take a moment. The right choice will reveal itself.",
		],
	},
	{
		name: "Liv",
		image: "girl",
		description: "Liv knows the people of the northern farms and who can be trusted.",
		advice: [
			"I think we should hear everyone before we decide.",
			"Whatever we choose, we can make it work together.",
			"Trust your instincts. They have brought us this far.",
		],
	},
	{
		name: "Runa",
		image: "angry",
		description: "Runa keeps watch. She notices danger before it reaches the camp.",
		advice: [
			"Keep your eyes open and choose with confidence.",
			"I see no reason to rush this decision.",
			"Whatever happens, I will keep watch.",
		],
	},
	{
		name: "Mikkel",
		image: "hippy",
		description: "Mikkel listens to the land and follows water beneath the stones.",
		advice: [
			"The land is patient. We can be patient too.",
			"Something interesting may come from any choice.",
			"Listen closely. The next step is already near.",
		],
	},
]

const prose = value => value.trim().replace(/\s+/g, " ")

const story = {
	start: {
		text: prose(`
			Your caravan has followed the old northern road for three days. The last waterskin is nearly empty,
			and the horses are beginning to stumble.
		`),
		choices: [
			{
				text: "Cross the forest to the river",
				next: "river",
			},
			{
				text: "Ask the farmstead for help",
				next: "farmstead",
			},
			{
				text: "Search for the ancient spring",
				next: "spring",
			},
		],
	},
	river: {
		text: prose(`
			The forest closes around the caravan. At dusk, you hear water beyond the trees—and a branch breaking
			behind you.
		`),
		choices: [
			{
				text: "Follow the sound of water",
				next: "riverWater",
			},
			{
				text: "Make camp and keep watch",
				next: "riverCamp",
			},
		],
	},
	farmstead: {
		text: prose(`
			A smoke-darkened farmstead appears over the hill. Its people are wary, but they have enough water to share
			when you offer something in return.
		`),
		choices: [
			{
				text: "Offer a day of work",
				next: "farmWork",
			},
			{
				text: "Trade from the caravan stores",
				next: "farmTrade",
			},
		],
	},
	spring: {
		text: prose(`
			The ancient spring is marked only by three stones covered in moss. Beneath them, the ground is cold and
			damp.
		`),
		choices: [
			{
				text: "Move the stones carefully",
				next: "springCareful",
			},
			{
				text: "Ask Mikkel to read the land",
				next: "springListen",
			},
		],
	},
	riverWater: {
		text: prose(`
			You find clear water running beneath the roots. The caravan can continue, but fresh tracks lead away into
			the dark.
		`),
		choices: [{
			text: "Fill the waterskins and continue",
			next: "start",
		}],
	},
	riverCamp: {
		text: prose(`
			The night passes quietly. At dawn, the broken branch is gone, and the horses are rested enough to travel.
		`),
		choices: [{
			text: "Return to the northern road",
			next: "start",
		}],
	},
	farmWork: {
		text: prose(`
			By sunset the well is repaired. The farmers point you toward Vendelheim and send you on with full
			waterskins.
		`),
		choices: [{
			text: "Follow the road to Vendelheim",
			next: "start",
		}],
	},
	farmTrade: {
		text: prose(`
			The trade is fair. You leave lighter in goods, but the caravan is welcomed as an old friend.
		`),
		choices: [{
			text: "Follow the road to Vendelheim",
			next: "start",
		}],
	},
	springCareful: {
		text: prose(`
			A clear spring bursts from the earth. The stones were a seal, not a marker—and you wonder who placed them
			there.
		`),
		choices: [{
			text: "Bring the water back to camp",
			next: "start",
		}],
	},
	springListen: {
		text: prose(`
			Mikkel presses an ear to the earth and smiles. Water is close, and the land seems willing to guide you.
		`),
		choices: [{
			text: "Follow Mikkel's direction",
			next: "start",
		}],
	},
}

export const page = {
	persistOnClose: true,
}

export default async ({ html }) => {
	for const advisor of advisors {
		html.advisorGrid.add(html.advisorTemplate.cloneTemplate({
			slots: {
				img: Png[advisor.image],
			},
			data: {
				advisor: advisor.name,
			},
		}))
	}

	const show = key => {
		const { text, choices } = Assert.value(story[key])

		html.story.content = text
		html.choices.removeChildren()

		for const choice of choices {
			const button = html.choiceButtonTemplate.cloneTemplate({
				slots: {
					text: choice.text
				},
			})
			button.onClick(() => show(choice.next))
			html.choices.add(button)
		}
	}

	show("start")

	return {
		onHover: {
			advicePopover: ({ origin, popover, hovering }) => {
				if hovering {
					const advisor = advisors.find(advisor => advisor.name == origin.dataset.advisor)
					popover.advisorName.content = advisor.name
					popover.advisorDescription.content = Random.choice(advisor.advice)
				}
			},
		},
	}
}
