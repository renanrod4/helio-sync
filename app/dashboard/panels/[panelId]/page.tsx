import { notFound } from 'next/navigation';

import { mockPanels, mockTelemetry } from '@/lib/mockData';
import { CO2_KG_PER_KWH } from '@/lib/impactMetrics';
import { computeDailyEnergyKwh, computeDailyPeakVoltage, formatTimeLabel, getPanelTelemetry } from '@/lib/panelMetrics';

import PanelDashboardClient from './PanelDashboardClient';

const UPDATE_INTERVAL_MIN = 30;
const MAX_VOLTAGE = 24;

type PanelDashboardPageProps = {
	params: {
		panelId: string;
	};
};

export default async function PanelDashboardPage({ params }: PanelDashboardPageProps) {
	const { panelId } = await params;
	const panel = mockPanels.find(item => item.id === panelId);

	if (!panel) {
		notFound();
	}

	const entries = getPanelTelemetry(mockTelemetry, panel.id);
	const latestEntry = entries[entries.length - 1];
	const energyKwh = computeDailyEnergyKwh(entries, UPDATE_INTERVAL_MIN);
	const peakVoltage = computeDailyPeakVoltage(entries);
	const efficiency = Math.min(Math.max((peakVoltage / MAX_VOLTAGE) * 100, 0), 100);
	const lastSyncLabel = formatTimeLabel(Date.parse(panel.lastSyncAt));
	const latestVoltage = latestEntry?.voltageV ?? 0;
	const latestPowerW = latestEntry?.powerW ?? 0;
	const currentA = latestVoltage ? latestPowerW / latestVoltage : 0;
	const azimuthDeg = panel.currentAngleAzimuth;
	const elevationDeg = panel.currentAngleElevation;
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
			co2AvoidedKg={co2AvoidedKg}
		/>
	);
}
