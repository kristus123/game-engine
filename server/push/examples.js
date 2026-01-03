// Example: Todo Reminder using Push Notifications

export class TodoWithReminder {
	constructor(title, dueDate) {
		this.title = title
		this.dueDate = dueDate
		this.completed = false
	}

	async scheduleReminder() {
		const timeUntilDue = this.dueDate - Date.now()

		if (timeUntilDue > 0) {
			setTimeout(async () => {
				await this.sendNotification()
			}, timeUntilDue)
		}
	}

	async sendNotification() {
		if (this.completed) {
			return
		}

		await fetch('http://localhost:3001/push/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: '⏰ Todo Reminder',
				body: `Don't forget: ${this.title}`,
				icon: '/icon.png',
				data: {
					type: 'todo-reminder',
					todoTitle: this.title,
					dueDate: this.dueDate,
				},
			}),
		})
	}

	markComplete() {
		this.completed = true
	}
}

// Example: Message Notification
export class MessageNotification {
	static async sendNewMessage(from, message) {
		await fetch('http://localhost:3001/push/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: `💬 Message from ${from}`,
				body: message,
				icon: '/user-avatar.png',
				badge: '/badge.png',
				data: {
					type: 'new-message',
					sender: from,
					timestamp: Date.now(),
				},
			}),
		})
	}
}

// Example: Game Notifications
export class GameNotification {
	static async sendWaveComplete(waveNumber, money) {
		await fetch('http://localhost:3001/push/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: `🎮 Wave ${waveNumber} Complete!`,
				body: `You earned ${money} coins. Next wave incoming!`,
				icon: '/icon.png',
				badge: '/badge.png',
				data: {
					type: 'wave-complete',
					wave: waveNumber,
					coins: money,
				},
				actions: [
					{ action: 'view', title: 'View Game' },
					{ action: 'close', title: 'Dismiss' },
				],
			}),
		})
	}

	static async sendPlayerDeath(cause) {
		await fetch('http://localhost:3001/push/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: '💀 Game Over',
				body: `You were defeated by ${cause}`,
				icon: '/icon.png',
				badge: '/badge.png',
				vibrate: [200, 100, 200],
				data: {
					type: 'player-death',
					cause: cause,
					timestamp: Date.now(),
				},
				actions: [
					{ action: 'restart', title: 'Play Again' },
					{ action: 'close', title: 'Later' },
				],
			}),
		})
	}

	static async sendHighScore(score, previousBest) {
		await fetch('http://localhost:3001/push/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: '🏆 New High Score!',
				body: `${score} points! Previous best: ${previousBest}`,
				icon: '/icon.png',
				badge: '/badge.png',
				requireInteraction: true,
				data: {
					type: 'high-score',
					score: score,
					previousBest: previousBest,
				},
				actions: [
					{ action: 'share', title: 'Share' },
					{ action: 'view', title: 'View Leaderboard' },
				],
			}),
		})
	}

	static async sendMultiplayerInvite(playerName) {
		await fetch('http://localhost:3001/push/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: '🎯 Multiplayer Invite',
				body: `${playerName} invited you to play`,
				icon: '/icon.png',
				badge: '/badge.png',
				requireInteraction: true,
				vibrate: [100, 50, 100],
				data: {
					type: 'multiplayer-invite',
					playerName: playerName,
					timestamp: Date.now(),
				},
				actions: [
					{ action: 'accept', title: 'Join Game' },
					{ action: 'decline', title: 'Decline' },
				],
			}),
		})
	}
}
