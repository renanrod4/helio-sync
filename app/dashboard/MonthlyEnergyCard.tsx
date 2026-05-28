import { computeMonthlyEnergy, getMonthLabel } from '@/lib/impactMetrics';
import { TelemetryEntry } from '@/lib/models/userDashboardData';


type MonthlyEnergyCardProps = {
	telemetry: TelemetryEntry[];
};

export function MonthlyEnergyCard({ telemetry }: MonthlyEnergyCardProps) {
	const monthEnergy = computeMonthlyEnergy(telemetry);
	const monthLabel = getMonthLabel(telemetry);

	return (
		<div className="flex h-full flex-col justify-between rounded-2xl border border-helio-green/20 bg-[linear-gradient(180deg,rgba(6,14,6,0.92),rgba(6,14,6,0.6))] p-4 lg:col-span-1 lg:row-span-1">
			<div className="flex flex-col gap-2">
				<span className="text-[10px] uppercase tracking-[0.28em] text-muted">Energia no mês</span>
				<h1 className="text-3xl font-semibold text-helio-green-light">{monthEnergy.toFixed(1)} kWh</h1>
			</div>
			<span className="text-xs text-muted">{monthLabel}</span>
		</div>
	);
}
