export class SexyChat {
	constructor(position) {
		const p = position.copy()
		p.width = 700
		p.height = 100

		const yes = {
			key: null,
			text: 'Who are you?',
			conversation: {
				question: 'I am Choopy-choo-choo-chan. Nice to meet you!',
				replies: [
					{
						key: null,
						text: 'Nice to meet you as well',
						conversation: {
							question: 'You are so polite and big penis',
							replies: [
								{
									key: null,
									text: 'You are very cute',
									conversation: {
										question: 'I know. Do you want to sexy sex me ?',
										replies: [
											{
												key: null,
												text: 'Yes. I love you Choopy-chan',
												conversation: {
													question: 'Aaa. you are so sexy and big penis',
													replies: [
													],
												},
											},
											{
												key: null,
												text: 'No. I love Robin',
												conversation: {
													question: 'Nooooo. Please sex me',
													replies: [
														{
															key: null,
															text: 'I am sorry. Robin is in my heart',
															conversation: {
																question: 'It seems you love him more than anything',
																replies: [
																	{
																		key: null,
																		text: 'Yes. His sexy body makes it hard to think',
																		conversation: {
																			question: 'I am so choo-choo-choopy-sad awhuuuuuu',
																			replies: [
																				{
																					key: null,
																					text: 'Do not cry. i can exploit your insecurity',
																					conversation: {
																						question: 'Wow. you are so kind and sexy penis man',
																						replies: [
																						],
																					},
																				},

																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		}

		const no = {
			key: null,
			text: 'No. I am a lone wolf',
			conversation: {
				question: 'Aaw. I would hope we could become sexy friends. CHOO-CHOO hihi',
				replies: [
					{
						key: null,
						text: 'Sorry. My heart is elsewhere',
						conversation: {
							question: 'Choo-choooooooowwww wuwhuuu',
							replies: [yes]
						},
					},
				],
			},
		}

		this.dialogue = new Dialogue({
			question: 'Hello there. you might be wondering who i am',
			replies: [
				yes,
				no,
			]
		}, p)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.dialogue.draw(draw, guiDraw)
	}
}
