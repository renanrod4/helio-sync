'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardHeader, type DashboardTab } from './DashboardHeader';
import { DashboardGrid } from './DashboardGrid';
import Panels from './panelsData';

export default function DashboardPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const tabParam = searchParams.get('tab');
	const resolvedTab: DashboardTab = tabParam === 'fleet' ? 'fleet' : 'overview';
	const [isMobile, setIsMobile] = useState(false);

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
					Esta pagina nao esta disponivel em dispositivos moveis. Por favor, acesse a partir de um computador
					ou tablet para visualizar o dashboard.
				</p>
			</div>
		);
	}

	const handleTabChange = (tab: DashboardTab) => {
		const nextTabParam = tab === 'overview' ? null : 'fleet';
		const currentTabParam = searchParams.get('tab');
		if (nextTabParam === currentTabParam) {
			return;
		}
		const params = new URLSearchParams(searchParams);
		if (nextTabParam) {
			params.set('tab', nextTabParam);
		} else {
			params.delete('tab');
		}
		const query = params.toString();
		router.push(`/dashboard${query ? `?${query}` : ''}`);
	};

	return (
		<main className="min-h-screen px-3 py-2 sm:px-3 sm:py-3 2xl:px-6 ">
			<div className="mx-auto flex w-full flex-col gap-2 2xl:max-w-8/10 2xl:gap-6">
				<DashboardHeader activeTab={resolvedTab} onTabChange={handleTabChange} />
				{resolvedTab === 'overview' ? <DashboardGrid /> : <Panels />}
			</div>
		</main>
	);
}
