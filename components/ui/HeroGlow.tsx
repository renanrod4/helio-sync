type HeroGlowProps = {
	className?: string;
	color: string;
	opacityClass?: string;
	shape?: 'circle' | 'oval';
};

export function HeroGlow({
	className = '',
	color,
	opacityClass = 'opacity-20',
	shape = 'circle',
}: HeroGlowProps) {
	const gradientShape = shape === 'oval' ? 'ellipse' : 'circle';

	return (
		<div
			className={`pointer-events-none absolute rounded-full ${opacityClass} ${className}`.trim()}
			style={{ background: `radial-gradient(${gradientShape}, ${color} 0%, transparent 70%)` }}
		/>
	);
}
