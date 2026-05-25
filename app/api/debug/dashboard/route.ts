import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { UserDashboardDataModel } from '@/lib/models/userDashboardData';
import { UserModel } from '@/lib/models/user';

// Endpoint: /api/debug/dashboard?email=renanrdemeneses@gmail.com
export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Informe o email na query (?email=...)' }, { status: 400 });
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }
  const dashboard = await UserDashboardDataModel.findOne({ userId: user._id });
  if (!dashboard) {
    return NextResponse.json({ error: 'Dashboard não encontrado para o usuário' }, { status: 404 });
  }
  return NextResponse.json({ dashboard });
}
