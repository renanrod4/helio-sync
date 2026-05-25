
import dotenv from 'dotenv';
import path from 'path';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/lib/models/user';
import { UserDashboardDataModel } from '@/lib/models/userDashboardData';
import { mockPanels, mockTelemetry, mockAlerts } from '@/lib/mockData';

// Carrega .env.local explicitamente se não estiver em produção
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
}

async function seedUserDashboardData() {
  await connectToDatabase();

  // Usuário alvo
  const email = 'renanrdemeneses@gmail.com';
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('Usuário de teste não encontrado no banco.');
  }

  // Remove dados antigos para evitar duplicidade
  await UserDashboardDataModel.deleteMany({ userId: user._id });

  // Cria painéis e mapeia _id real
  const panels = mockPanels.map(panel => ({
    label: panel.label,
    latitude: panel.latitude,
    longitude: panel.longitude,
    status: panel.status,
    currentAngleAzimuth: panel.currentAngleAzimuth,
    currentAngleElevation: panel.currentAngleElevation,
    petalsStatus: panel.petalsStatus,
    lastSyncAt: panel.lastSyncAt,
    _id: undefined // deixa o mongoose gerar
  }));

  // Após criar o documento, os _id dos painéis estarão disponíveis
  // Mas precisamos criar o documento em duas etapas:
  // 1. Cria só os painéis
  // 2. Atualiza com telemetry e alerts usando os _id reais

  // Cria documento inicial só com painéis
  const dashboardDoc = await UserDashboardDataModel.create({
    userId: user._id,
    panels,
    telemetry: [],
    alerts: [],
  });

  // Mapeia panelId do mock para _id real
  const panelIdMap = {};
  dashboardDoc.panels.forEach((panel, idx) => {
    panelIdMap[mockPanels[idx].id] = panel._id;
  });

  // Adapta telemetry
  const telemetry = mockTelemetry.map(entry => ({
    panelId: panelIdMap[entry.panelId],
    timestamp: entry.timestamp,
    voltageV: entry.voltageV,
    powerW: entry.powerW,
    angleDeg: entry.angleDeg,
  }));

  // Adapta alerts
  const alerts = (mockAlerts || []).map(alert => ({
    panelId: panelIdMap[alert.panelId],
    type: alert.type,
    severity: alert.severity,
    message: alert.message,
    createdAt: alert.createdAt,
  }));

  // Atualiza documento com telemetry e alerts
  dashboardDoc.telemetry = telemetry;
  dashboardDoc.alerts = alerts;
  await dashboardDoc.save();

  console.log('Dados do dashboard populados para o usuário:', email);
}

seedUserDashboardData().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
