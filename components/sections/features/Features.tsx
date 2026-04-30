'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import { FeatureCard } from './FeatureCard';
import { features } from './Features.constants';

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
		<section id="funcionalidades" ref={sectionRef} className="relative scroll-mt-28 overflow-hidden bg-helio-bg-secondary py-16">
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
							icon={feature.icon}
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
