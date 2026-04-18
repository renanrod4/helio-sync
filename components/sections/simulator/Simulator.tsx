'use client';

import React from 'react';
import { FaCrosshairs } from 'react-icons/fa';
import { LuGauge } from 'react-icons/lu';
import { PiFlowerLotusDuotone } from 'react-icons/pi';
import { IconBadge } from '@/components/ui/IconBadge';

const cards = [
	{
		icon: FaCrosshairs,
		title: 'Rastreamento Ativo',
		desc: 'A posicao do sol e calculada em tempo real usando equacoes astronomicas de elevacao e azimute.',
		color: '#32CD32',
	},
	{
		icon: LuGauge,
		title: 'Eficiencia Otimizada',
		desc: 'Inclinacao automatica garante que os raios solares incidam perpendicularmente sobre o painel.',
		color: '#FFD700',
	},
	{
		icon: PiFlowerLotusDuotone,
		title: 'Design Adaptativo',
		desc: 'Formato de lotus que se abre e se inclina organicamente seguindo o arco solar do amanhecer ao entardecer.',
		color: '#F4A460',
	},
];

export default function Simulator() {
	const [isVisible, setIsVisible] = React.useState(false);
	const sectionRef = React.useRef<HTMLElement | null>(null);

	React.useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		const observer = new IntersectionObserver(
			entries => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
		);

		observer.observe(section);

		return () => {
			observer.disconnect();
		};
	}, []);

	const subtitleRevealStyle: React.CSSProperties = {
		['--reveal-delay' as string]: '200ms',
	};

	return (
		<section
			ref={sectionRef}
			className="relative bg-helio-bg-secondary py-16 flex items-center justify-center flex-col"
		>
			<h1 className={`mb-6 text-title reveal-up ${isVisible ? 'is-visible' : ''}`}>
				Simulador <span className="text-gradient-green">Interativo</span>?
			</h1>
			<p
				className={`mx-auto mb-8 max-w-2xl text-center text-lead text-secondary reveal-up ${isVisible ? 'is-visible' : ''}`}
				style={subtitleRevealStyle}
			>
				Veja como o painel lotus acompanha o sol ao longo do dia.
			</p>
			<div className="grid w-2/3 grid-cols-1 gap-8 md:grid-cols-2">
				{/* soon avaliable canvas */}
				<div className="relative w-full overflow-hidden rounded-2xl border border-[rgb(255_255_255/0.16)] bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015))] p-6 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl">
					<div className="relative z-10 flex h-full min-h-52 items-center justify-center rounded-xl border border-[rgb(255_255_255/0.08)] bg-[rgb(7_18_10/0.35)]">
						<p className="text-center text-lead text-secondary">Simulador em desenvolvimento...</p>
					</div>
				</div>
				<div className="flex flex-col items-start gap-6">
					{cards.map((card, index) => {
						const Icon = card.icon;
						return (
							<div
								key={index}
								className="flex items-start gap-4 max-w-180 rounded-2xl border border-foreground/10 bg-white/2 p-6 backdrop-blur-sm transition-colors duration-200 hover:bg-white/5"
							>
								<IconBadge icon={Icon} color={card.color} className="h-12 min-w-12" />
								<div>
									<h3 className="text-subtitle text-primary">{card.title}</h3>
									<p className="text-body text-muted">{card.desc}</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
