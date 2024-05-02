const whatIsThis = Reply('What is this place?',
	Conversation('A place where you will be happy (it is just a test on loading different levels.', [
		Reply('ok!', Conversation('Great. Now, get to work!', [

		]))
	]),
)

const canILeave = Reply('Can i leave?',
	Conversation('Some can, but most will never leave', [
		Reply('frick!', Conversation('Well.. Bye kid.', [

		])),
	])
)

export const VoidDialogue = (player, mouse) => {

	const p = player.position.copy()
	p.x += 100
	p.width = 700
	p.height = 100

	return new Dialogue(Conversation('welcome to the void', [whatIsThis, canILeave]), p, mouse)
}
