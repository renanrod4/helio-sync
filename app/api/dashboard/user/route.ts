import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import { UserDashboardDataModel } from '@/lib/models/userDashboardData';
import { verifyAuthToken, JWT_COOKIE_NAME } from '@/lib/auth';
import { startMqttService } from '@/lib/mqttService';

export async function GET() {
  startMqttService();
  await connectToDatabase();
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const payload = await verifyAuthToken(token);
  if (!payload || !payload.sub) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
  let dashboard = await UserDashboardDataModel.findOne({ userId: payload.sub });
  if (!dashboard) {
    dashboard = {
      panels: [],
      telemetry: [],
      alerts: [],
    };
  }
  return NextResponse.json({ dashboard });
}