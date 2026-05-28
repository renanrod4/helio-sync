import { CO2_KG_PER_KWH, computeTotalEnergy } from '@/lib/impactMetrics';
import { TelemetryEntry } from '@/lib/models/userDashboardData';


type Co2AvoidedCardProps = {
	telemetry: TelemetryEntry[];
};

export function Co2AvoidedCard({ telemetry }: Co2AvoidedCardProps) {
	const totalEnergy = computeTotalEnergy(telemetry);
	const avoidedCo2 = totalEnergy * CO2_KG_PER_KWH;

	return (
		<div className="flex h-full flex-col justify-between rounded-2xl border border-sky-400/20 bg-[linear-gradient(180deg,rgba(6,14,6,0.92),rgba(6,14,6,0.6))] p-4 lg:col-span-1 lg:row-span-1">
			<div className="flex flex-col gap-2">
				<span className="text-[10px] uppercase tracking-[0.28em] text-muted">CO2 evitado</span>
				<h1 className="text-3xl font-semibold text-sky-300">{avoidedCo2.toFixed(1)} kg</h1>
			</div>
			<span className="text-xs text-muted">Acumulado desde o início</span>
		</div>
	);
}
