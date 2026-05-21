type TelemetryStatProps = {
	label: string;
	value: string;
	subtitle: string;
	valueClassName?: string;
};

function TelemetryStat({ label, value, subtitle, valueClassName }: TelemetryStatProps) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-xs uppercase tracking-[0.22em] text-muted">{label}</span>
			<span className={`text-lg font-semibold ${valueClassName ?? 'text-primary'}`}>{value}</span>
			<span className="text-xs">{subtitle}</span>
		</div>
	);
}

type TelemetryStatsProps = {
	peakVoltage: string;
	peakTime: string;
	averageVoltage: string;
	generation: string;
};

export function TelemetryStats({ peakVoltage, peakTime, averageVoltage, generation }: TelemetryStatsProps) {
	return (
		<div className="flex flex-wrap items-start justify-around gap-4">
			<TelemetryStat label="Pico" value={peakVoltage} subtitle={`as ${peakTime}`} />
			<TelemetryStat label="Média" value={averageVoltage} subtitle="dia inteiro" />
			<TelemetryStat
				label="Geração"
				value={generation}
				subtitle="estimado"
				valueClassName="text-helio-green-light"
			/>
		</div>
	);
}
