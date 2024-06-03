export function FirstQuest(controller, camera, mouse, player, chickens, deliveryDrone) {
	return new Quest([
		new CollectChickensQuest(mouse, player, chickens),
	], () => {
		console.log('quest finished')
	})

}
