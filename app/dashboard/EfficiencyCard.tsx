import { mockTelemetry } from '@/lib/mockData';
import { computeDailyPeakVoltage } from '@/lib/panelMetrics';

const MAX_VOLTAGE = 24;

function getAverageVoltage() {
	if (mockTelemetry.length === 0) {
		return 0;
	}

	return computeDailyPeakVoltage(mockTelemetry);
}

export function EfficiencyCard() {
	const averageVoltage = getAverageVoltage();
	const efficiencyRaw = (averageVoltage / MAX_VOLTAGE) * 100;
	const efficiency = Math.min(Math.max(efficiencyRaw, 0), 100);
	const statusLabel = efficiency >= 85 ? 'Ótimo' : efficiency >= 70 ? 'Bom' : 'Atenção';
	const statusClass =
		efficiency >= 85
			? 'text-helio-green-light'
			: efficiency >= 70
				? 'text-helio-gold'
				: 'text-helio-rose';

	return (
		<div className="flex h-full flex-col justify-between rounded-2xl border border-foreground/10 bg-[linear-gradient(180deg,rgba(6,14,6,0.92),rgba(6,14,6,0.6))] p-4 lg:col-span-1 lg:row-span-1">
			<div className="flex items-start justify-between">
				<div className="flex flex-col gap-2">
					<span className="text-[10px] uppercase tracking-[0.28em] text-muted">Eficiência média</span>
					<span className="text-3xl font-semibold text-primary">{efficiency.toFixed(1)}%</span>
				</div>
				<span className={`text-xs uppercase tracking-[0.22em] ${statusClass}`}>{statusLabel}</span>
			</div>
			<div className="flex items-end justify-between text-xs text-muted">
				<span>Média: {averageVoltage.toFixed(1)} V</span>
				<span>Meta: {MAX_VOLTAGE} V</span>
			</div>
		</div>
	);
}
