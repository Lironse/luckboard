import { db, Entry } from "../db/db"

export class Fight {
	playerA: undefined | string
	playerB: undefined | string
	full: boolean
	winner: undefined | string

	constructor() {
		this.full = false
	}

	async addPlayer(player: string) {
		if (this.full) {
			console.log('room is full already')
			return
		}
		if (this.playerA == player || this.playerB == player) {
			console.log('a player tried to play against themselves')
			return
		}

		if (this.playerA == undefined) {
			this.playerA = player
		} else if (this.playerB == undefined) {
			this.playerB = player
		}

		if (this.playerA && this.playerB) {
			this.full = true
		} else {
			await this.waitForRoomToFill()
			this.full = true
		}
	}

	start() {
		if (!(this.playerA && this.playerB && this.full)) {
			console.log('illegal start of fight')
			return
		}
		const players = [this.playerA, this.playerB]
		const winner = players[coinToss()]
		updateStreaks(players, winner)
		this.winner = winner
		return winner
	}

	async waitForRoomToFill(): Promise<void> {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (this.full) {
					clearInterval(interval);
					resolve();
				}
			}, 1000); // Check every second if there's a second player
		})
	}
}

function coinToss() {
	return Math.floor(Math.random() * 2);
}

function updateStreaks(players: string[], winner: string) {
	for (const player of players) {
		let entry = db.find((entry) => entry.name == player)
		if (!entry) {
			db.push(new Entry(player))
			entry = db.find((entry) => entry.name == player)
		}
		if (entry) {
			if (player == winner) {
				entry.streak += 1
				if (entry.streak > entry.best) {
					entry.best = entry.streak
				}
			} else {
				entry.streak = 0
			}
		}
	}
	console.log('DATABASE:\n', db)
}

