'use client';

import { CSSProperties } from 'react';
import { IconType } from 'react-icons';
import { IconBadge } from '@/components/ui/IconBadge';

type FeatureCardProps = {
	icon: IconType;
	title: string;
	description: string;
	color: string;
	isVisible: boolean;
	delay: number;
};

export function FeatureCard({ icon: Icon, title, description, color, isVisible, delay }: FeatureCardProps) {
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
