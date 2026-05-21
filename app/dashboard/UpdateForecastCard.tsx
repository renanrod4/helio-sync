import { mockPanels } from '@/lib/mockData';
import { formatTimeLabel, getLatestSyncTimestamp } from '@/lib/panelMetrics';

const UPDATE_INTERVAL_MIN = 30;

export function UpdateForecastCard() {
	const latestSync = getLatestSyncTimestamp(mockPanels);
	const nextSync = latestSync + UPDATE_INTERVAL_MIN * 60 * 1000;
	const nextLabel = formatTimeLabel(nextSync, 'local');
	const lastLabel = formatTimeLabel(latestSync, 'local');

	return (
		<div className="flex h-full flex-col justify-between rounded-2xl border border-foreground/10 bg-[linear-gradient(180deg,rgba(6,14,6,0.92),rgba(6,14,6,0.6))] p-4 lg:col-span-1 lg:row-span-1">
			<div className="flex flex-col gap-2">
				<span className="text-[10px] uppercase tracking-[0.28em] text-muted">Previsão de atualização</span>
				<span className="text-3xl font-semibold text-helio-gold">{nextLabel}</span>
			</div>
			<div className="flex items-center justify-between text-xs text-muted">
					<span>Última resposta: {lastLabel}</span>
				<span>Ciclo: {UPDATE_INTERVAL_MIN} min</span>
			</div>
		</div>
	);
}
