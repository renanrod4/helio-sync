"use client";

import { useEffect, useState } from 'react';
import PanelsCard from './panels/PanelCard';
import PanelModal, { PanelFormData } from '@/components/ui/PanelModal';
import type { PanelStatus, TelemetryEntry } from '@/lib/models/userDashboardData';

type PanelFromApi = {
	id?: string;
	_id?: string;
	serialId?: string;
	label: string;
	latitude: number;
	longitude: number;
	status: PanelStatus;
	lastSyncAt: string;
	currentAngleAzimuth?: number;
	currentAngleElevation?: number;
	petalsStatus?: 'open' | 'closed' | 'moving';
};

type Panel = {
	id: string;
	serialId?: string;
	label: string;
	latitude: number;
	longitude: number;
	status: PanelStatus;
	lastSyncAt: string;
	currentAngleAzimuth: number;
	currentAngleElevation: number;
	petalsStatus: 'open' | 'closed' | 'moving';
};

export default function Panels() {
	const [panels, setPanels] = useState<Panel[]>([]);
	const [telemetry, setTelemetry] = useState<TelemetryEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		async function fetchPanels() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch('/api/dashboard/user');
				if (!res.ok) throw new Error('Erro ao buscar painéis');
				const data = await res.json();
				setPanels(
					(data.dashboard?.panels || []).map(
						(panel: PanelFromApi): Panel => ({
							id: panel.id || (panel._id ? panel._id.toString() : Math.random().toString(36)),
							serialId: panel.serialId ?? undefined,
							label: panel.label,
							latitude: panel.latitude,
							longitude: panel.longitude,
							status: panel.status,
							lastSyncAt: panel.lastSyncAt,
							currentAngleAzimuth: panel.currentAngleAzimuth ?? 0,
							currentAngleElevation: panel.currentAngleElevation ?? 0,
							petalsStatus: panel.petalsStatus ?? 'open',
						}),
					),
				);
				setTelemetry((data.dashboard?.telemetry || []) as TelemetryEntry[]);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Erro desconhecido');
			} finally {
				setLoading(false);
			}
		}
		fetchPanels();
	}, []);

	return (
		<>
			<div className="flex flex-col gap-4">
				<h2 className="text-lg font-semibold text-primary">Placas</h2>
				<div className="flex flex-wrap gap-4 max-w-332">
					{loading && <span className="text-muted">Carregando...</span>}
					{error && <span className="text-rose-500">{error}</span>}
					{!loading &&
						!error &&
						panels.map(panel => <PanelsCard key={panel.id} panel={panel} telemetry={telemetry} />)}
					<button
						type="button"
						className="flex min-h-55 max-w-xs w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-foreground/20 text-sm text-secondary transition hover:border-foreground/40 hover:text-primary"
						onClick={() => setModalOpen(true)}
					>
						<span className="text-5xl font-medium">+</span>
						<span className="text-xs uppercase tracking-[0.3em]">Adicionar Placa</span>
					</button>
				</div>
				<PanelModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					onSubmit={async (data: PanelFormData) => {
						try {
							const res = await fetch('/api/dashboard/panels', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify(data),
							});
							if (!res.ok) {
								const txt = await res.text();
								setError(txt || 'Erro ao criar placa');
								return;
							}
							const created = await res.json();
							const newPanel: Panel = {
								id: created.id || created._id || Math.random().toString(36).slice(2, 9),
								label: created.label,
								latitude: created.latitude,
								longitude: created.longitude,
								status: created.status || 'online',
								lastSyncAt: created.lastSyncAt || new Date().toISOString(),
								currentAngleAzimuth: created.currentAngleAzimuth ?? 0,
								currentAngleElevation: created.currentAngleElevation ?? 0,
								petalsStatus: created.petalsStatus ?? 'open',
							};
							setPanels(prev => [newPanel, ...prev]);
							setModalOpen(false);
						} catch (err) {
							setError(err instanceof Error ? err.message : 'Erro desconhecido');
						}
					}}
				/>
			</div>
		</>
	);
}
