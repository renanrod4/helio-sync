'use client';

import { useMemo, useState } from 'react';
import { mockTelemetry, type MockTelemetry } from '@/lib/mockData';

const chartWidth = 700;
const chartHeight = 260;
const chartPaddingLeft = 52;
const chartPaddingY = 28;
const chartGridLines = 6;

type TelemetryPoint = {
	timestamp: number;
	voltageV: number;
};

function buildDailySeries24h(entries: MockTelemetry[]): TelemetryPoint[] {
	const now = new Date();
	const startOfDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
	const buckets = Array.from({ length: 24 }, (_, hour) => {
		const bucketStart = startOfDay + hour * 3_600_000;
		const bucketEnd = bucketStart + 3_600_000;
		const matches = entries.filter(entry => {
			const timestamp = Date.parse(entry.timestamp);
			return timestamp >= bucketStart && timestamp < bucketEnd;
		});
		const averageVoltage = matches.length
			? matches.reduce((sum, entry) => sum + entry.voltageV, 0) / matches.length
			: 0;
		return {
			timestamp: bucketStart,
			voltageV: averageVoltage,
		};
	});

	return smoothSeries(buckets, 3);
}

function buildWeeklySeries12h(entries: MockTelemetry[]): TelemetryPoint[] {
	const now = new Date();
	const todayUtcDay = now.getUTCDay();
	const daysFromSaturday = (todayUtcDay + 1) % 7;
	const startOfWindow = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate() - daysFromSaturday,
	);
	const buckets = Array.from({ length: 14 }, (_, index) => {
		const bucketStart = startOfWindow + index * 43_200_000;
		const bucketEnd = bucketStart + 43_200_000;
		const matches = entries.filter(entry => {
			const timestamp = Date.parse(entry.timestamp);
			return timestamp >= bucketStart && timestamp < bucketEnd;
		});
		const averageVoltage = matches.length
			? matches.reduce((sum, entry) => sum + entry.voltageV, 0) / matches.length
			: 0;
		return {
			timestamp: bucketStart,
			voltageV: averageVoltage,
		};
	});

	return buckets;
}

function smoothSeries(series: TelemetryPoint[], windowSize: number) {
	if (series.length === 0 || windowSize <= 1) {
		return series;
	}

	const halfWindow = Math.floor(windowSize / 2);

	return series.map((point, index) => {
		const start = Math.max(index - halfWindow, 0);
		const end = Math.min(index + halfWindow, series.length - 1);
		const slice = series.slice(start, end + 1);
		const average = slice.reduce((sum, entry) => sum + entry.voltageV, 0) / slice.length;
		return { ...point, voltageV: average };
	});
}

function formatHourLabel(timestamp: number) {
	return new Date(timestamp).toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'UTC',
	});
}

function buildChartPaths(series: TelemetryPoint[]) {
	if (series.length === 0) {
		return { linePath: '', areaPath: '', minValue: 0, maxValue: 24 };
	}

	const minValue = 0;
	const maxValue = 24;
	const range = maxValue - minValue;

	const points = series.map((point, index) => {
		const ratio = series.length === 1 ? 0 : index / (series.length - 1);
		const x = chartPaddingLeft + ratio * (chartWidth - chartPaddingLeft);
		const clampedValue = Math.min(Math.max(point.voltageV, minValue), maxValue);
		const y = chartPaddingY + (1 - (clampedValue - minValue) / range) * (chartHeight - chartPaddingY * 2);
		return { x, y };
	});

	const linePath = points
		.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
		.join(' ');

	const lastPoint = points[points.length - 1];
	const firstPoint = points[0];
	const areaPath = `${linePath} L ${lastPoint.x.toFixed(2)} ${(chartHeight - chartPaddingY).toFixed(2)} L ${firstPoint.x.toFixed(2)} ${(chartHeight - chartPaddingY).toFixed(2)} Z`;

	return { linePath, areaPath, minValue, maxValue };
}

function formatWeekLabel(timestamp: number) {
	const weekLabels = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
	const date = new Date(timestamp);
	return weekLabels[date.getUTCDay()];
}

function getDayHourLabel(timestamp: number) {
	const hour = new Date(timestamp).getUTCHours();
	return String(((hour + 24) % 24) + 1);
}

function buildXAxisLabels(series: TelemetryPoint[], range: 'day' | 'week') {
	if (series.length === 0) {
		return [] as Array<{ x: number; label: string }>;
	}

	if (range === 'day') {
		const step = 2;
		return series
			.map((point, index) => ({
				index,
				label: getDayHourLabel(point.timestamp),
			}))
			.filter(({ index }) => (index + 1) % step === 0)
			.filter(({ label }) => label !== '24')
			.map(({ index, label }) => {
				const ratio = series.length === 1 ? 0 : index / (series.length - 1);
				const x = chartPaddingLeft + ratio * (chartWidth - chartPaddingLeft);
				return { x, label };
			});
	}

	return series
		.map((point, index) => {
		const ratio = series.length === 1 ? 0 : index / (series.length - 1);
		const x = chartPaddingLeft + ratio * (chartWidth - chartPaddingLeft);
		const date = new Date(point.timestamp);
		const isDayStart = date.getUTCHours() === 0;
		return isDayStart ? { x, label: formatWeekLabel(point.timestamp) } : null;
		})
		.filter((label): label is { x: number; label: string } => Boolean(label));
}

type TelemetryChartCardProps = {
	telemetry?: MockTelemetry[];
	subjectLabel?: string;
	chartHeightClassName?: string;
};

export function TelemetryChartCard({
	telemetry,
	subjectLabel = 'Frota completa',
	chartHeightClassName,
}: TelemetryChartCardProps) {
	const [range, setRange] = useState<'day' | 'week'>('day');
	const telemetryEntries = telemetry ?? mockTelemetry;
	const series = useMemo(() => {
		return range === 'day'
			? buildDailySeries24h(telemetryEntries)
			: buildWeeklySeries12h(telemetryEntries);
	}, [range, telemetryEntries]);
	const { linePath, areaPath, minValue, maxValue } = buildChartPaths(series);
	const latestVoltage = series.at(-1)?.voltageV ?? 0;
	const peakPoint = series.reduce<TelemetryPoint | null>((currentPeak, point) => {
		if (!currentPeak || point.voltageV > currentPeak.voltageV) {
			return point;
		}
		return currentPeak;
	}, null);
	const peakVoltage = peakPoint?.voltageV ?? 0;
	const averageVoltage = series.length ? series.reduce((acc, point) => acc + point.voltageV, 0) / series.length : 0;
	const chartRange = Math.max(maxValue - minValue, 1);
	const formatLabel = range === 'day' ? formatHourLabel : formatWeekLabel;
	const xAxisLabels = buildXAxisLabels(series, range);
	const peakLabel = peakPoint ? formatLabel(peakPoint.timestamp) : '--:--';
	const rangeLabel = range === 'day' ? 'nas ultimas 24h' : 'na semana';

	const chartContainerClassName = chartHeightClassName ?? 'flex-1';

	return (
		<div className="flex h-full flex-col gap-5 rounded-2xl border border-foreground/10 bg-[linear-gradient(180deg,rgba(6,14,6,0.9),rgba(6,14,6,0.6))] p-4 lg:col-span-3 lg:row-span-3 xl:row-span-4 xl:p-5">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="flex flex-col gap-2">
					<span className="text-xs uppercase tracking-[0.24em] text-secondary">Analise de geracao</span>
					<h2 className="text-lg font-semibold text-primary">{subjectLabel} - volts gerados {rangeLabel}</h2>
					<span className="text-sm text-secondary">Atual: {latestVoltage.toFixed(1)} V</span>
				</div>
				<div className="flex items-center gap-3 text-xs text-secondary">
					<button
						type="button"
						className={`rounded-full border px-3 py-1 transition ${
							range === 'day'
								? 'border-foreground/10 bg-white/5 text-primary'
								: 'border-transparent text-secondary hover:text-primary'
						}`}
						onClick={() => setRange('day')}
					>
						24h
					</button>
					<button
						type="button"
						className={`rounded-full border px-3 py-1 transition ${
							range === 'week'
								? 'border-foreground/10 bg-white/5 text-primary'
								: 'border-transparent text-secondary hover:text-primary'
						}`}
						onClick={() => setRange('week')}
					>
						Semana
					</button>

				</div>
			</div>

			<div
				className={`relative min-h-0 overflow-hidden rounded-2xl border border-foreground/5 bg-white/2 p-4 ${chartContainerClassName}`}
			>
				{series.length === 0 ? (
					<div className="flex h-full items-center justify-center text-sm text-muted">
						Sem dados de telemetria.
					</div>
				) : (
					<svg
						viewBox={`0 0 ${chartWidth} ${chartHeight}`}
						className="h-full w-full"
						preserveAspectRatio="none"
						role="img"
						aria-label="Grafico de volts gerados por tempo"
					>
						<defs>
							<linearGradient id="telemetry-area" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="#90EE90" stopOpacity="0.35" />
								<stop offset="100%" stopColor="#90EE90" stopOpacity="0" />
							</linearGradient>
						</defs>
						{Array.from({ length: chartGridLines + 1 }, (_, index) => {
							const y = chartPaddingY + (index / chartGridLines) * (chartHeight - chartPaddingY * 2);
							const value = maxValue - (index / chartGridLines) * chartRange;
							return (
								<g key={`grid-${index}`}>
									<line
										x1={chartPaddingLeft}
										y1={y}
										x2={chartWidth}
										y2={y}
										stroke="rgba(243,255,233,0.08)"
										strokeDasharray="4 6"
									/>
									<text
										x={chartPaddingLeft - 14}
										y={y + 4}
										fill="rgba(243,255,233,0.55)"
										fontSize="10"
										textAnchor="end"
									>
										{value.toFixed(1)} V
									</text>
								</g>
							);
						})}
						{xAxisLabels.map((label, index) => (
							<text
								key={`x-label-${index}`}
								x={label.x}
								y={chartHeight - chartPaddingY + 18}
								fill="rgba(243,255,233,0.45)"
								fontSize="10"
								textAnchor="middle"
							>
								{label.label+(range === 'day' ? ':00' : '')}
							</text>
						))}
						<path d={areaPath} fill="url(#telemetry-area)" />
						<path d={linePath} fill="none" stroke="#90EE90" strokeWidth="2" />
					</svg>
				)}
			</div>

			<div className="flex flex-wrap items-start justify-around gap-4">
				<div className="flex flex-col gap-1">
					<span className="text-xs uppercase tracking-[0.22em] text-muted">Pico</span>
					<span className="text-lg font-semibold text-primary">{peakVoltage.toFixed(1)} V</span>
					<span className="text-xs">{range==='day'?"as":"no"} {peakLabel}</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-xs uppercase tracking-[0.22em] text-muted">Media</span>
					<span className="text-lg font-semibold text-primary">{averageVoltage.toFixed(1)} V</span>
					<span className="text-xs">dia inteiro</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-xs uppercase tracking-[0.22em] text-muted">Geracao</span>
					<span className="text-lg font-semibold text-helio-green-light">8.4 kWh</span>
					<span className="text-xs">energia estimada acumulada no dia</span>
				</div>
			</div>
		</div>
	);
}
