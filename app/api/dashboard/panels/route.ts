import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import { UserDashboardDataModel } from '@/lib/models/userDashboardData';
import { verifyAuthToken, JWT_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  await connectToDatabase();
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const payload = await verifyAuthToken(token);
  if (!payload || !payload.sub) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

  const body = await request.json();
  const { serialId, label, latitude, longitude } = body;
  if (!serialId || !label || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return NextResponse.json({ error: 'serialId, label, latitude e longitude são obrigatórios' }, { status: 400 });
  }

  // find or create dashboard for user
  let dashboard = await UserDashboardDataModel.findOne({ userId: payload.sub });
  if (!dashboard) {
    dashboard = new UserDashboardDataModel({ userId: payload.sub, panels: [], telemetry: [], alerts: [] });
  }

  // check serial uniqueness within this dashboard
  const exists = (dashboard.panels || []).some((p: any) => p.serialId === serialId);
  if (exists) return NextResponse.json({ error: 'serialId já cadastrado neste usuário' }, { status: 409 });

  const panel = {
    serialId,
    label,
    latitude,
    longitude,
    status: 'online',
    currentAngleAzimuth: 0,
    currentAngleElevation: 0,
    petalsStatus: 'open',
    lastSyncAt: new Date().toISOString(),
  };

  dashboard.panels = [panel, ...dashboard.panels];
  await dashboard.save();

  // return the created panel (the first in the panels array)
  return NextResponse.json({ panel: dashboard.panels[0] });
}
