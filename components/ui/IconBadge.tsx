import type { CSSProperties } from 'react';
import type { IconType } from 'react-icons';

type IconBadgeProps = {
	icon?: IconType;
	label?: string;
	colorVar?: string;
	color?: string;
	className?: string;
	contentClassName?: string;
	iconClassName?: string;
};

function resolveColor(colorVar?: string, color?: string) {
	if (colorVar) return `var(${colorVar})`;
	if (color) return color;
	return 'var(--helio-green)';
}

export function IconBadge({
	icon: Icon,
	label,
	colorVar,
	color,
	className = '',
	contentClassName = '',
	iconClassName = '',
}: IconBadgeProps) {
	const tone = resolveColor(colorVar, color);
	const style = {
		borderColor: `color-mix(in srgb, ${tone} 40%, transparent)`,
		backgroundColor: `color-mix(in srgb, ${tone} 15%, transparent)`,
		color: tone,
	} as CSSProperties;

	return (
		<div
			className={`inline-flex aspect-square min-w-10 items-center justify-center rounded-xl border px-3 ${className}`.trim()}
			style={style}
		>
			{Icon ? <Icon className={`size-6 ${iconClassName}`.trim()} /> : null}
			{label ? <span className={`${label.length===1?"text-2xl":"text-1xl"} leading-none ${contentClassName}`.trim()}>{label}</span> : null}
		</div>
	);
}
