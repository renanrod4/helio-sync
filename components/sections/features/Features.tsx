'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import { IconType } from 'react-icons';
import { BiShield } from 'react-icons/bi';
import { LuLeaf } from 'react-icons/lu';
import { FiRefreshCcw, FiZap } from 'react-icons/fi';
import { IconBadge } from '@/components/ui/IconBadge';

const features = [
	{
		icon: FiRefreshCcw,
		title: 'Sincronização Natural',
		desc: 'Seus dados fluem como a energia solar, sincronizando automaticamente entre todos os seus dispositivos com segurança máxima.',
		color: '--helio-green',
	},
	{
		icon: LuLeaf,
		title: 'Design Solar',
		desc: 'Design inspirado na natureza que evolui e se adapta às suas necessidades, como uma planta que cresce com o sol.',
		color: '--helio-green-forest',
	},
	{
		icon: BiShield,
		title: 'Viabilidade',
		desc: 'Geração de energia com mais de 50% em média dos painéis solares comuns, com rastreamento solar em tempo real.',
		color: '--helio-gold',
	},
	{
		icon: FiZap,
		title: 'Performance Solar',
		desc: 'Velocidade incomparável com otimizações que aproveitam toda a energia disponível ao longo do dia.',
		color: '--helio-amber',
	},
];

export default function Features() {
	const sectionRef = useRef<HTMLElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
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

	const subtitleRevealStyle = { '--reveal-delay': '120ms' } as CSSProperties;

	return (
		<section ref={sectionRef} className="relative overflow-hidden bg-helio-bg-secondary py-16">
			<div
				className="pointer-events-none absolute left-1/2 top-0 w-220 aspect-10/3 -translate-x-1/2 opacity-90"
				style={{
					background:
						'radial-gradient(ellipse at center, rgb(13 40 24 / 0.72) 0%, rgb(13 40 24 / 0.34) 34%, transparent 54%)',
				}}
			/>

			<div className="relative z-10 mx-auto w-full px-5 sm:px-6 md:px-10 lg:px-12 min-[1920px]:max-w-[78%]">
				<h1 className={`mb-6 text-title reveal-up ${isVisible ? 'is-visible' : ''}`}>
					Por que escolher Helio<span className="text-gradient-gold">Sync</span>?
				</h1>
				<p
					className={`mx-auto mb-8 max-w-2xl text-center text-lead text-secondary reveal-up ${isVisible ? 'is-visible' : ''}`}
					style={subtitleRevealStyle}
				>
					Apresentamos uma forma viável e eficaz de gerar energia diretamente da sua residência.
				</p>
				<div className="flex flex-wrap items-stretch justify-center gap-6">
					{features.map((feature, index) => (
						<FeatureCard
							key={index}
							Icon={feature.icon}
							title={feature.title}
							description={feature.desc}
							color={feature.color}
							isVisible={isVisible}
							delay={220 + index * 90}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

function FeatureCard({
	color,
	Icon,
	title,
	description,
	isVisible,
	delay,
}: {
	color: string;
	Icon: IconType;
	title: string;
	description: string;
	isVisible: boolean;
	delay: number;
}) {
	const cardRevealStyle = { '--reveal-delay': `${delay}ms` } as CSSProperties;

	return (
		<div
			className={`flex min-h-70 w-full max-w-80 flex-col gap-4 rounded-2xl border border-foreground/10 bg-white/2 p-6 backdrop-blur-sm transition-colors duration-200 hover:bg-white/5 sm:max-w-88 reveal-up ${
				isVisible ? 'is-visible' : ''
			}`}
			style={cardRevealStyle}
		>
			<IconBadge icon={Icon} colorVar={color} className="h-14 w-14" />
			<h3 className="text-subtitle">{title}</h3>
			<p className="text-muted">{description}</p>
		</div>
	);
}
