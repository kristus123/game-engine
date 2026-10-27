export const page = {
	persistOnClose: true,
	layout: "pretty-layout",
}

const actions = {
	raid: {
		icon: "⚔",
		kind: "Hostile action",
		title: "Raid Friendly Clan",
		description: "Gather warriors and attack the settlement openly, aiming to return with goods and livestock.",
		consequences: "A successful raid may bring wealth, but warriors can be wounded or killed. The clan and its allies will dislike you and become more wary of Vikingheim.",
		confirm: "Prepare raid",
		result: "Your warriors have been told to prepare for a raid on Friendly Clan.",
	},
	trade: {
		icon: "⚖",
		kind: "Peaceful action",
		title: "Trade with Friendly Clan",
		description: "Send traders to exchange Vikingheim's goods for resources the clan can spare.",
		consequences: "Fair terms can improve relations and enrich both settlements. A poor offer may be refused or make the clan less willing to trade later.",
		confirm: "Prepare trade mission",
		result: "Traders are preparing goods for a visit to Friendly Clan.",
	},
	delegation: {
		icon: "✦",
		kind: "Diplomatic action",
		title: "Send a delegation",
		description: "Choose a representative to speak on your behalf. They can offer a gift, propose an alliance, or suggest a shared venture.",
		consequences: "A skilled envoy and a suitable offer can strengthen relations. An insult, weak gift, or unwanted proposal may damage your standing.",
		confirm: "Prepare delegation",
		result: "A delegation is being assembled to visit Friendly Clan.",
	},
	burnStead: {
		icon: "♨",
		kind: "Extreme hostile action",
		title: "Burn Friendly Clan's stead",
		description: "Sneak warriors to the stead while its people feast or sleep, surround the hall, barricade its doors, and set it on fire in an attempt to kill everyone inside.",
		consequences: "This is an attempted massacre. The clan and its allies will hate you, neighboring rulers will become much more wary of you, and your reputation for cruelty will rise sharply. Your warriors may also be discovered and killed.",
		confirm: "Prepare the burning",
		result: "Your warriors have received the brutal order to prepare an attack on the stead.",
	},
}

function showAction(html, actionName) {
	const action = actions[actionName]
	html.fields.currentAction = action
	html.actionDetailIcon.textContent = action.icon
	html.actionKind.textContent = action.kind
	html.actionTitle.textContent = action.title
	html.actionDescription.textContent = action.description
	html.actionConsequences.textContent = action.consequences
	html.confirmActionButton.textContent = action.confirm
	html.confirmActionButton.classList.toggle("danger", actionName == "burnStead")
	html.actionMenu.hidden = true
	html.actionDetails.hidden = false
}

export default {
	fields: () => ({
		currentAction: null,
	}),
	methods: {
		openFriendlyClan: (html) => {
			html.actionMenu.hidden = false
			html.actionDetails.hidden = true
			html.modal.show()
		},
		showRaid: (html) => showAction(html, "raid"),
		showTrade: (html) => showAction(html, "trade"),
		showDelegation: (html) => showAction(html, "delegation"),
		showBurnStead: (html) => showAction(html, "burnStead"),
		showActionMenu: (html) => {
			html.actionDetails.hidden = true
			html.actionMenu.hidden = false
		},
		confirmAction: (html) => {
			const action = Assert.value(html.fields.currentAction)
			html.actionDetails.hidden = true
			html.actionMenu.hidden = false
			html.actionStatus.textContent = action.result
			html.actionStatus.hidden = false
		},
	},
}
