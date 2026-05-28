import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/lib/models/user';
import { mockUsers } from '@/lib/mockDataa';

function isAuthorized(request: Request) {
	const seedKey = process.env.SEED_KEY;
	if (!seedKey) {
		return false;
	}

	const headerKey = request.headers.get('x-seed-key');
	return headerKey === seedKey;
}

export async function POST(request: Request) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ message: 'Nao autorizado.' }, { status: 401 });
	}

	await connectToDatabase();
	const seedPassword = process.env.SEED_USER_PASSWORD;
	if (!seedPassword) {
		return NextResponse.json({ message: 'SEED_USER_PASSWORD nao configurada.' }, { status: 500 });
	}
	const passwordHash = await bcrypt.hash(seedPassword, 10);

	const operations = mockUsers.map(user => ({
		updateOne: {
			filter: { email: user.email },
			update: {
				$setOnInsert: {
					name: user.name,
					email: user.email,
					role: user.role,
					passwordHash,
				},
			},
			upsert: true,
		},
	}));

	const result = await UserModel.bulkWrite(operations, { ordered: false });

	return NextResponse.json({ inserted: result.upsertedCount, matched: result.matchedCount });
}
