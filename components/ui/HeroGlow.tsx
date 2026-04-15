type HeroGlowProps = {
	className?: string;
	color: string;
	opacityClass?: string;
};

export function HeroGlow({ className = '', color, opacityClass = 'opacity-20' }: HeroGlowProps) {
	return (
		<div
			className={`pointer-events-none absolute rounded-full ${opacityClass} ${className}`.trim()}
			style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
		/>
	);
}
