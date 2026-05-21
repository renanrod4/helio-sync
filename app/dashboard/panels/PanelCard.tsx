import Link from 'next/link';

import { mockTelemetry, type MockPanel } from '@/lib/mockData';
import { computeDailyEnergyKwh, computeDailyPeakVoltage, formatTimeLabel, getPanelTelemetry } from '@/lib/panelMetrics';

type PanelsCardProps = {
	panel: MockPanel;
};

const UPDATE_INTERVAL_MIN = 30;
const MAX_VOLTAGE = 24;

const STATUS_STYLES: Record<MockPanel['status'], string> = {
	online: 'border-helio-green/30 bg-helio-green/10 text-helio-green-light',
	offline: 'border-helio-rose/30 bg-helio-rose/10 text-helio-rose',
	maintenance: 'border-helio-gold/30 bg-helio-gold/10 text-helio-gold',
};

const STATUS_DOT: Record<MockPanel['status'], string> = {
	online: 'bg-helio-green-light',
	offline: 'bg-helio-rose',
	maintenance: 'bg-helio-gold',
};

export default function PanelsCard({ panel }: PanelsCardProps) {
	const entries = getPanelTelemetry(mockTelemetry, panel.id);
	const energyKwh = computeDailyEnergyKwh(entries, UPDATE_INTERVAL_MIN);
	const peakVoltage = computeDailyPeakVoltage(entries);
	const efficiency = Math.min(Math.max((peakVoltage / MAX_VOLTAGE) * 100, 0), 100);
	const nextSyncLabel = formatTimeLabel(Date.parse(panel.lastSyncAt) + UPDATE_INTERVAL_MIN * 60 * 1000);
	const statusLabel = panel.status === 'maintenance' ? 'Manut.' : panel.status === 'online' ? 'Online' : 'Offline';

	return (
		<Link
			href={`/dashboard/panels/${panel.id}`}
			className="flex min-h-55 max-w-xs w-full flex-col justify-between gap-5 rounded-2xl border border-foreground/10 bg-[linear-gradient(180deg,rgba(6,14,6,0.95),rgba(6,14,6,0.6))] p-5 transition hover:border-foreground/20"
			aria-label={`Abrir dashboard da placa ${panel.label}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-1">
					<h3 className="text-base font-semibold text-primary">{panel.label}</h3>
					<span className="text-xs text-secondary">Atualiza {nextSyncLabel}</span>
				</div>
				<span
					className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${STATUS_STYLES[panel.status]}`}
				>
					<span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[panel.status]}`} />
					{statusLabel}
				</span>
			</div>
			<div className="flex flex-col gap-3">
				<div className="flex items-baseline justify-between">
					<span className="text-[11px] uppercase tracking-[0.2em] text-muted">Eficiência</span>
					<span className="text-xl font-semibold text-primary">{efficiency.toFixed(0)}%</span>
				</div>
				<div className="flex items-baseline justify-between">
					<span className="text-[11px] uppercase tracking-[0.2em] text-muted">Energia diária</span>
					<span className="text-xl font-semibold text-helio-green-light">
						{energyKwh ? `${energyKwh.toFixed(1)} kWh` : '--'}
					</span>
				</div>
			</div>
		</Link>
	);
}
