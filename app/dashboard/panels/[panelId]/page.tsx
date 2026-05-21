import { notFound } from 'next/navigation';

import { mockPanels, mockTelemetry } from '@/lib/mockData';
import { computeDailyEnergyKwh, formatTimeLabel, getPanelTelemetry } from '@/lib/panelMetrics';

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
	const averageVoltage = entries.length
		? entries.reduce((acc, entry) => acc + entry.voltageV, 0) / entries.length
		: 0;
	const efficiency = Math.min(Math.max((averageVoltage / MAX_VOLTAGE) * 100, 0), 100);
	const lastSyncLabel = formatTimeLabel(Date.parse(panel.lastSyncAt));
	const latestVoltage = latestEntry?.voltageV ?? 0;
	const latestPowerW = latestEntry?.powerW ?? 0;
	const currentA = latestVoltage ? latestPowerW / latestVoltage : 0;
	const temperatureC = 42;

	return (
		<PanelDashboardClient
			panelLabel={panel.label}
			panelStatus={panel.status}
			efficiency={efficiency}
			averageVoltage={averageVoltage}
			energyKwh={energyKwh}
			lastSyncLabel={lastSyncLabel}
			latestVoltage={latestVoltage}
			latestPowerW={latestPowerW}
			currentA={currentA}
			temperatureC={temperatureC}
		/>
	);
}
