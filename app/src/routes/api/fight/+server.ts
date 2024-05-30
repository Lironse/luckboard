import type { RequestHandler } from '@sveltejs/kit';
import { Fight } from './fight';
import { db } from '../db/db';

let fights: Fight[] = []

async function addPlayerToFight(player: string) {
	console.log('adding player', player)

	// if there are no fights at all
	if (fights.length == 0) {
		fights.push(new Fight())
		await fights[0].addPlayer(player)

		// once another player joins
		return fights[0].winner == player
	}

	for (let i = 0; i < fights.length; i++) {
		if (!fights[i].full) {
			await fights[i].addPlayer(player)

			// if second to join
			if (fights[i].full) {
				const winner = fights[i].start()
				return winner == player
			}

			// if first to join
			return fights[i].winner == player
		}
	}

	// if all fights are full
	fights.push(new Fight())
	await fights[fights.length - 1].addPlayer(player)

	// once another player joins
	return fights[fights.length - 1].winner == player
}

function getStreakOfPlayer(player: string) {
	for (const entry of db) {
		if (entry.name == player) {
			return entry.streak
		}
	}
}

export const POST: RequestHandler = async ({ request }) => {
	console.log('received a request. current available fights:', fights)
	const player = (await request.json()).name;

	let won = await addPlayerToFight(player)
	const responseMessage = {
		won: won,
		streak: getStreakOfPlayer(player),
		status: 'success'
	};

	return new Response(JSON.stringify(responseMessage), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
