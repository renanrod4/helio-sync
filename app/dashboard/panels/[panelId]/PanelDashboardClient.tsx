'use client';

import { useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import type { MockTelemetry } from '@/lib/mockData';
import PanelSidebar from './components/PanelSidebar';
import PanelChart from './components/PanelChart';
import PanelRight from './components/PanelRight';

type PanelDashboardClientProps = {
	panelLabel: string;
	panelId?: string;
	panelStatus: 'online' | 'offline' | 'maintenance';
	efficiency: number;
	energyKwh: number;
	lastSyncLabel: string;
	panelTelemetry: MockTelemetry[];
	latestVoltage: number;
	latestPowerW: number;
	currentA: number;
	azimuthDeg: number;
	elevationDeg: number;
	co2AvoidedKg: number;
};

export default function PanelDashboardClient({
	panelLabel,
	panelId,
	panelStatus,
	efficiency,
	energyKwh,
	lastSyncLabel,
	panelTelemetry,
	latestVoltage,
	latestPowerW,
	currentA,
	azimuthDeg,
	elevationDeg,
	co2AvoidedKg,
}: PanelDashboardClientProps) {
	const [isMobile, setIsMobile] = useState(false);
	const monthlyEnergyKwh = energyKwh ? energyKwh * 22 : 0;

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 640);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	if (isMobile) {
		return (
			<div className="absolute flex h-full w-full items-center justify-center p-4 text-center">
				<p className="text-lg text-muted">
					Esta página não está disponível em dispositivos móveis. Por favor, acesse a partir de um computador
					ou tablet para visualizar o dashboard.
				</p>
			</div>
		);
	}

	return (
		<main className="min-h-screen px-3 py-2 sm:px-3 sm:py-3 2xl:px-6">
			<div className="mx-auto flex w-full flex-col gap-2 2xl:max-w-8/10 2xl:gap-6">
				<header className="flex flex-col gap-4 rounded-2xl border border-foreground/5 bg-white/3 px-5 py-2 backdrop-blur-sm 2xl:py-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-col gap-1">
							<h1 className="text-xl font-semibold text-primary">Dashboard</h1>
							<span className="text-sm text-secondary">Placa {panelLabel}</span>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-white/5 text-primary transition hover:text-helio-gold"
								aria-label="Notificações"
							>
								<FaRegBell size={16} />
								<span className="absolute right-1/5 top-1/5 h-2 w-2 rounded-full bg-helio-gold" />
							</button>
						</div>
					</div>
				</header>

				<section className="grid grid-cols-1 gap-2 auto-rows-[110px] lg:grid-cols-5 2xl:gap-4 2xl:auto-rows-[70%]">
					<PanelSidebar
						panelStatus={panelStatus}
						efficiency={efficiency}
						energyKwh={energyKwh}
						monthlyEnergyKwh={monthlyEnergyKwh}
						lastSyncLabel={lastSyncLabel}
						latestVoltage={latestVoltage}
						latestPowerW={latestPowerW}
						currentA={currentA}
						azimuthDeg={azimuthDeg}
						elevationDeg={elevationDeg}
						co2AvoidedKg={co2AvoidedKg}
					/>

					<PanelChart panelTelemetry={panelTelemetry} panelLabel={panelLabel} />

					<PanelRight panelId={panelId} panelLabel={panelLabel} />
				</section>
			</div>
		</main>
	);
}
