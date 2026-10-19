const advisors = [
	{
		name: "Eira",
		image: "wise",
		description: "Eira reads the old signs and remembers the roads that have vanished.",
	},
	{
		name: "Liv",
		image: "girl",
		description: "Liv knows the people of the northern farms and who can be trusted.",
	},
	{
		name: "Runa",
		image: "angry",
		description: "Runa keeps watch. She notices danger before it reaches the camp.",
	},
	{
		name: "Mikkel",
		image: "hippy",
		description: "Mikkel listens to the land and follows water beneath the stones.",
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
				advice: {
					Eira: "The river is the quickest path, but the forest has changed since I last walked it.",
					Liv: "There may be a farmstead nearby, but the river will get us moving sooner.",
					Runa: "I hear something in those trees. Keep the caravan close if we go.",
					Mikkel: "Water always leaves a trail. I can help you follow it.",
				},
			},
			{
				text: "Ask the farmstead for help",
				next: "farmstead",
				advice: {
					Eira: "Farmers remember travelers. A respectful request may open more doors than a drawn blade.",
					Liv: "I know the kind of people who live there. We should offer honest work before asking for supplies.",
					Runa: "Approach openly, but do not let the horses out of your sight.",
					Mikkel: "The smoke is fresh. They have water, and they are not preparing to leave.",
				},
			},
			{
				text: "Search for the ancient spring",
				next: "spring",
				advice: {
					Eira: "The old maps mark a spring, though the stones around it were placed for a reason.",
					Liv: "No one has used that route in years. It may be safer to ask the farmstead.",
					Runa: "An abandoned spring is a good place for an ambush. I will scout ahead.",
					Mikkel: "The ground is calling us north. There is water beneath the moss.",
				},
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
				advice: {
					Eira: "The stream will lead us out, if we do not lose ourselves in the dark.",
					Liv: "Fresh water is worth the risk, but mark the way back for the others.",
					Runa: "I will take the front. Stay silent and watch the shadows.",
					Mikkel: "The water is close. I can hear it under the roots.",
				},
			},
			{
				text: "Make camp and keep watch",
				next: "riverCamp",
				advice: {
					Eira: "Patience may reveal who is following us before we commit to the woods.",
					Liv: "A quiet night could restore the horses, if we make the camp welcoming and warm.",
					Runa: "This is the safest choice. We can defend the caravan from one place.",
					Mikkel: "The forest settles after midnight. The water will still be here at dawn.",
				},
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
				advice: {
					Eira: "A repaired well is worth more than a handful of coins when winter is near.",
					Liv: "They will remember our hands long after they forget what we traded.",
					Runa: "Work keeps us visible and gives me time to study the farmstead.",
					Mikkel: "The well has been neglected. A little care will make it sing again.",
				},
			},
			{
				text: "Trade from the caravan stores",
				next: "farmTrade",
				advice: {
					Eira: "Trade is quick, but keep enough supplies for the road ahead.",
					Liv: "Offer the salt and cloth first. Those are valuable here.",
					Runa: "Finish the trade quickly. We should not linger where we are unknown.",
					Mikkel: "The farmers need tools more than trinkets. Give them something useful.",
				},
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
				advice: {
					Eira: "Break no seal until we know what it protects.",
					Liv: "If we move them, do it slowly. The spring may be the only help we find.",
					Runa: "I will watch the tree line while you work.",
					Mikkel: "The stones are old, but the water beneath them is clear.",
				},
			},
			{
				text: "Ask Mikkel to read the land",
				next: "springListen",
				advice: {
					Eira: "Listening first may spare us from repeating an old mistake.",
					Liv: "Mikkel has the best chance of understanding what the stones mean.",
					Runa: "Give Mikkel time. I will make sure nothing approaches unseen.",
					Mikkel: "Let me listen. The land has been waiting longer than we have.",
				},
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
			advice: {
				Eira: "Take only what we need. The spring belongs to those who come after us.",
				Liv: "Fill every skin, then leave the tracks undisturbed.",
				Runa: "We should move before whoever made those tracks returns.",
				Mikkel: "The water is clean. It will carry us safely to the settlement.",
			},
		}],
	},
	riverCamp: {
		text: prose(`
			The night passes quietly. At dawn, the broken branch is gone, and the horses are rested enough to travel.
		`),
		choices: [{
			text: "Return to the northern road",
			next: "start",
			advice: {
				Eira: "The road is clearer now. We have learned enough to continue.",
				Liv: "The horses are ready. Let us reach Vendelheim before nightfall.",
				Runa: "I saw no further movement. We can travel.",
				Mikkel: "The forest has let us pass. Leave it in peace.",
			},
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
			advice: {
				Eira: "A fair bargain makes a strong beginning in a new settlement.",
				Liv: "The farmers will speak well of us when we arrive.",
				Runa: "Keep the caravan together until we reach the gates.",
				Mikkel: "The road is firm beneath us now.",
			},
		}],
	},
	farmTrade: {
		text: prose(`
			The trade is fair. You leave lighter in goods, but the caravan is welcomed as an old friend.
		`),
		choices: [{
			text: "Follow the road to Vendelheim",
			next: "start",
			advice: {
				Eira: "We paid a price, but the road ahead is open.",
				Liv: "The trade was honest. That is how trust begins.",
				Runa: "We can leave before anyone changes their mind.",
				Mikkel: "The caravan feels lighter. The land approves.",
			},
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
			advice: {
				Eira: "Some mysteries are best carried forward rather than opened further.",
				Liv: "The caravan needs this water more than it needs another secret.",
				Runa: "We have what we came for. Cover the stones again.",
				Mikkel: "The spring has given freely. We should thank it and go.",
			},
		}],
	},
	springListen: {
		text: prose(`
			Mikkel presses an ear to the earth and smiles. Water is close, and the land seems willing to guide you.
		`),
		choices: [{
			text: "Follow Mikkel's direction",
			next: "start",
			advice: {
				Eira: "Trusting the land may lead us somewhere the maps never recorded.",
				Liv: "Stay close. I do not want anyone lost in the fog.",
				Runa: "I will guard the rear while Mikkel leads.",
				Mikkel: "The water is waiting just beyond the rise. Follow me.",
			},
		}],
	},
}

function createAdvisor(advisor) {
	const button = document.createElement("button")
	button.className = "advisor"
	button.setAttribute("on-hover-show", "adviceWise")
	button.dataset.advisor = advisor.name

	const image = document.createElement("img")
	image.src = Png[advisor.image]
	button.append(image)

	return button
}

function createChoice(choice, onChoose, onSelect) {
	const button = document.createElement("button")
	button.className = "choice"
	button.textContent = choice.text
	button.addEventListener("mouseenter", () => onSelect(choice))
	button.addEventListener("focus", () => onSelect(choice))
	button.onClick(() => onChoose(choice.next))
	return button
}

export const Story = html => {
	let selectedChoice = null

	for const advisor of advisors {
		html.advisorGrid.add(createAdvisor(advisor))
	}

	const show = key => {
		const chapter = story[key]
		selectedChoice = null
		html.story.textContent = chapter.text
		html.choices.removeChildren()

		for const choice of chapter.choices {
			html.choices.add(createChoice(choice, show, choice => selectedChoice = choice))
		}
	}

	show("start")

	return {
		onHover: {
			adviceWise: ({ origin, popover, hovering }) => {
				if hovering {
					const advisor = advisors.find(advisor => advisor.name == origin.dataset.advisor)
					popover.advisorName.textContent = advisor.name
					popover.advisorDescription.textContent = selectedChoice?.advice?.[advisor.name] ?? advisor.description
				}
			},
		},
	}
}
