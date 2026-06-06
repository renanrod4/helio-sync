
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { CO2_KG_PER_KWH } from '@/lib/impactMetrics';
import { computeDailyEnergyKwh, computeDailyPeakVoltage, formatTimeLabel, getPanelTelemetry } from '@/lib/panelMetrics';
import PanelDashboardClient from './PanelDashboardClient';
import type { PanelStatus, PetalsStatus } from '@/lib/models/userDashboardData';


const UPDATE_INTERVAL_MIN = 30;
const MAX_VOLTAGE = 24;

type PanelFromApi = {
	id?: string;
	_id?: string;
	label: string;
	latitude: number;
	longitude: number;
	status: PanelStatus;
	lastSyncAt: string;
	currentAngleAzimuth?: number;
	currentAngleElevation?: number;
	petalsStatus?: PetalsStatus;
};

type PanelDashboardPageProps = {
	params: {
		panelId: string;
	};
};

export default async function PanelDashboardPage({ params }: PanelDashboardPageProps) {
	const { panelId } = await params;

	
	const baseUrl =
		process.env.NEXT_PUBLIC_SITE_URL ||
		(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

	const cookieStore = await cookies();
	const allCookies = (await cookieStore.getAll()) as Array<{ name: string; value: string }>;

	const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');

	const res = await fetch(`${baseUrl}/api/dashboard/user`, {
		cache: 'no-store',
		headers: cookieHeader ? { cookie: cookieHeader } : {},
	});
	if (!res.ok) notFound();
	const data = await res.json();

	const panels: PanelFromApi[] = data.dashboard?.panels || [];
	const telemetry = data.dashboard?.telemetry || [];
	const panel = panels.find((item) => (item.id || item._id?.toString()) === panelId);
	if (!panel) {
		return(
			<div className="flex h-80 items-center justify-center">
				<div className="text-center">
					<h2 className="text-lg font-semibold text-rose-800">Placa não encontrada</h2>
					<p className="mt-2 text-sm text-rose-700">A placa que você está tentando acessar não existe ou foi removida.</p>
				</div>
			</div>
		)
	}

	const entries = getPanelTelemetry(telemetry, (panel.id || (panel._id?.toString?.() ?? '')));
	const latestEntry = entries[entries.length - 1];
	const energyKwh = computeDailyEnergyKwh(entries, UPDATE_INTERVAL_MIN);
	const peakVoltage = computeDailyPeakVoltage(entries);
	const efficiency = Math.min(Math.max((peakVoltage / MAX_VOLTAGE) * 100, 0), 100);
	const lastSyncLabel = formatTimeLabel(Date.parse(panel.lastSyncAt));
	const latestVoltage = latestEntry?.voltageV ?? 0;
	const latestPowerW = latestEntry?.powerW ?? 0;
	const currentA = latestVoltage ? latestPowerW / latestVoltage : 0;
	const azimuthDeg = panel.currentAngleAzimuth ?? 0;
	const elevationDeg = panel.currentAngleElevation ?? 0;
	const petalsStatus = panel.petalsStatus ?? 'open';
	const co2AvoidedKg = energyKwh * CO2_KG_PER_KWH;

	return (
		<PanelDashboardClient
			panelId={panelId}
			panelLabel={panel.label}
			panelStatus={panel.status}
			efficiency={efficiency}
			energyKwh={energyKwh}
			lastSyncLabel={lastSyncLabel}
			panelTelemetry={entries}
			latestVoltage={latestVoltage}
			latestPowerW={latestPowerW}
			currentA={currentA}
			azimuthDeg={azimuthDeg}
			elevationDeg={elevationDeg}
			petalsStatus={petalsStatus}
			co2AvoidedKg={co2AvoidedKg}
		/>
	);
}
