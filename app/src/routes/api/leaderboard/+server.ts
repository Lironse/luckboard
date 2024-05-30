import type { RequestHandler } from '@sveltejs/kit';
import { db } from '../db/db';

export const GET: RequestHandler = () => {
	const responseMessage = {
		leaderboard: db,
		status: 'success'
	};

	return new Response(JSON.stringify(responseMessage), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
