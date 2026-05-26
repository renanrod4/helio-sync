import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { MockTelemetry } from '@/lib/mockData';
import type { PanelStatus } from '@/lib/models/userDashboardData';
import { EfficiencyCard } from './EfficiencyCard';
import { Co2AvoidedCard } from './Co2AvoidedCard';
import { MonthlyEnergyCard } from './MonthlyEnergyCard';
import { PanelStatusCard } from './PanelStatusCard';
import { PanelMapCard } from './PanelMapCard';
import { TelemetryChartCard } from '@/lib/TelemetryChartCard';
import { UpdateForecastCard } from './UpdateForecastCard';
import { WeatherGridCard } from './WeatherCard';
export function DashboardGrid() {

	const [telemetry, setTelemetry] = useState<MockTelemetry[] | null>(null);
	const [panels, setPanels] = useState<Panel[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchDashboard() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch('/api/dashboard/user');
				if (!res.ok) {
					throw new Error('Erro ao buscar dados do dashboard');
				}
				const data = await res.json();
				setTelemetry(data.dashboard?.telemetry || []);
				setPanels(
					(data.dashboard?.panels || []).map((panel: unknown) => {
						const p = panel as {
							id?: string;
							_id?: string;
							label: string;
							latitude: number;
							longitude: number;
							status: PanelStatus;
							lastSyncAt: string;
						};
						return {
							id: p.id || (p._id ? p._id.toString() : Math.random().toString(36)),
							label: p.label,
							latitude: p.latitude,
							longitude: p.longitude,
							status: p.status,
							lastSyncAt: p.lastSyncAt,
						};
					})
				);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('Erro desconhecido');
				}
			} finally {
				setLoading(false);
			}
		}
		fetchDashboard();
	}, []);

	return (
		<section className="grid gap-2 grid-cols-5 auto-rows-[118px] 2xl:gap-4 2xl:auto-rows-[140px]">
			<TelemetryChartCard telemetry={telemetry ?? undefined} />
			<WeatherGridCard />
			<PanelStatusCard panels={panels} />
			<UpdateForecastCard panels={panels} />
			<PanelMapCard panels={panels} />
			<EfficiencyCard telemetry={telemetry ?? []} />
			<MonthlyEnergyCard telemetry={telemetry ?? []} />
			<Co2AvoidedCard telemetry={telemetry ?? []} />
			{loading && (
				<div className="col-span-5 row-span-1 text-center text-muted">Carregando dados do dashboard...</div>
			)}
			{error && (
				<div className="col-span-5 row-span-1 text-center text-helio-rose">{error}</div>
			)}
		</section>
	);
}
export type CardProps = {
	children?: ReactNode;
	xSize: 1 | 2 | 3 | 4 | 5;
	ySize: 1 | 2 | 3 | 4;
};

const colSpanClasses: Record<CardProps['xSize'], string> = {
	1: 'lg:col-span-1',
	2: 'lg:col-span-2',
	3: 'lg:col-span-3',
	4: 'lg:col-span-4',
	5: 'lg:col-span-5',
};

const rowSpanClasses: Record<CardProps['ySize'], string> = {
	1: 'lg:row-span-1',
	2: 'lg:row-span-2',
	3: 'lg:row-span-3',
	4: 'lg:row-span-4',
};

export function Card({ children, xSize, ySize }: CardProps) {
	return (
		<div
			className={`rounded-2xl border border-foreground/10 bg-white/5 p-4 ${colSpanClasses[xSize]} ${rowSpanClasses[ySize]}`}
		>
			{children}
		</div>
	);
}

type Panel = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  status: PanelStatus;
  lastSyncAt: string;
};
