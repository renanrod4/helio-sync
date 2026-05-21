'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import type { LatLngExpression } from 'leaflet';
import { mockPanels } from '@/lib/mockData';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const MapContainer = dynamic(() => import('react-leaflet').then(module => module.MapContainer), { ssr: false });
const Pane = dynamic(() => import('react-leaflet').then(module => module.Pane), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(module => module.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(module => module.CircleMarker), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(module => module.Tooltip), { ssr: false });

const STATUS_COLORS: Record<(typeof mockPanels)[number]['status'], string> = {
	online: '#90ee90',
	offline: '#f4a1c8',
	maintenance: '#ffe655',
};

const CARTO_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function buildCenter(panels: typeof mockPanels): LatLngExpression {
	if (panels.length === 0) {
		return [-23.55, -46.633];
	}

	const sum = panels.reduce(
		(acc, panel) => {
			acc.lat += panel.latitude;
			acc.lng += panel.longitude;
			return acc;
		},
		{ lat: 0, lng: 0 },
	);

	return [sum.lat / panels.length, sum.lng / panels.length];
}

export function PanelMapCard() {
	const center = useMemo(() => buildCenter(mockPanels), []);

	useEffect(() => {
		let mounted = true;

		const applyIconDefaults = async () => {
			const leaflet = await import('leaflet');
			if (!mounted) {
				return;
			}

			leaflet.Icon.Default.mergeOptions({
				iconRetinaUrl,
				iconUrl,
				shadowUrl,
			});
		};

		applyIconDefaults();

		return () => {
			mounted = false;
		};
	}, []);

	return (
		<div className="relative col-span-2 row-span-1 flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-[linear-gradient(180deg,rgba(6,14,6,0.92),rgba(6,14,6,0.6))] xl:row-span-2">
			<div className="flex items-center justify-between px-3 pt-3 xl:px-4 xl:pt-4">
				<span className="text-[10px] uppercase tracking-[0.28em] text-muted">Posição das placas</span>
				<span className="text-xs text-muted">{mockPanels.length} Placas posicionadas</span>
			</div>
			<div className="relative h-full w-full px-3 pb-3 pt-2 xl:px-4 xl:pb-4 xl:pt-3">
				<div className="relative h-full w-full overflow-hidden rounded-2xl border border-foreground/10">
					<MapContainer
						center={center}
						zoom={17}
						scrollWheelZoom
						className="h-full w-full"
						attributionControl={false}
					>
						<TileLayer url={CARTO_TILE_URL} attribution="© Carto © OpenStreetMap" />
						<Pane name="markers" style={{ zIndex: 650 }}>
							{mockPanels.map(panel => (
								<CircleMarker
									key={panel.id}
									center={[panel.latitude, panel.longitude]}
									radius={5}
									pathOptions={{
										color: STATUS_COLORS[panel.status],
										fillColor: STATUS_COLORS[panel.status],
										fillOpacity: 0.85,
										weight: 2,
									}}
								>
									<Tooltip direction="top" offset={[0, -6]} opacity={1}>
										<div className="text-xs">
											<strong>{panel.label}</strong>
											<div>Status: {panel.status === 'maintenance' ? 'Manutenção' : panel.status === 'online' ? 'Online' : 'Offline'}</div>
										</div>
									</Tooltip>
								</CircleMarker>
							))}
						</Pane>
					</MapContainer>
				</div>
					<div className="pointer-events-none absolute z-999 bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">
						<span className="inline-flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-helio-green-light" aria-hidden="true" />
							Online
						</span>
						<span className="inline-flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-helio-gold" aria-hidden="true" />
							Manutenção
						</span>
						<span className="inline-flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-helio-rose" aria-hidden="true" />
							Offline
						</span>
					</div>
			</div>
		</div>
	);
}
