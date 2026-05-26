import { formatTimeLabel } from '@/lib/panelMetrics';
import type { PanelStatus } from '@/lib/models/userDashboardData';

const UPDATE_INTERVAL_MIN = 20;

type Panel = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  status: PanelStatus;
  lastSyncAt: string;
};

function getLatestSyncTimestamp(panels: Panel[]) {
  if (panels.length === 0) return Date.now();
  return Math.max(...panels.map(panel => Date.parse(panel.lastSyncAt)));
}

export function UpdateForecastCard({ panels }: { panels: Panel[] }) {

  const latestSync = getLatestSyncTimestamp(panels);
  const nextSync = latestSync + UPDATE_INTERVAL_MIN * 60 * 1000;
  const nextLabel = formatTimeLabel(nextSync, 'local');
  const lastLabel = formatTimeLabel(latestSync, 'local');
  const isEmpty = panels.length === 0;

  if (isEmpty) {
    return (
      <div className="flex h-full flex-col justify-between rounded-2xl border border-foreground/10 bg-[linear-gradient(180deg,rgba(6,14,6,0.92),rgba(6,14,6,0.6))] p-4 lg:col-span-1 lg:row-span-1 animate-pulse">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted">Previsão de atualização</span>
          <span className="text-3xl font-semibold text-helio-gold">--:--</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Última resposta: --:--</span>
          <span>Ciclo: {UPDATE_INTERVAL_MIN} min</span>
        </div>
      </div>
    );
  }

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
