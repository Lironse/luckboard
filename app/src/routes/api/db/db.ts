export class Entry {
	name: string
	streak: number
	best: number

	constructor(name: string) {
		this.name = name
		this.streak = 0
		this.best = 0
	}
}

export let db: Entry[] = []
