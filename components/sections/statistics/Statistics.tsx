const stats = [
	{ title: '+50%', value: 'Mais eficiência' },
	{ title: '360°', value: 'Rastreamento solar' },
	{ title: '24/7', value: 'Monitoramento' },
	{ title: '0', value: 'Emissões de CO₂' },
];
export default function Statistics() {
	return (
		<section className="flex items-center justify-center bg-helio-bg-secondary py-16">
			<div
				className="flex flex-wrap items-center justify-between gap-y-12 rounded-4xl w-full shadow-2xl border border-foreground/10  max-w-5xl mx-5 py-10 px-8 sm:px-12 lg:px-16 sm:mx-auto"
				style={{
					background: 'linear-gradient(120deg, var(--helio-bg-accent) 0%, var(--helio-bg-primary) 100%)',
				}}
			>
				{stats.map((stat, index) => (
					<div key={index} className="flex flex-col items-center gap-2">
						<h3 className="text-gradient-gold text-5xl font-medium">{stat.title}</h3>
						<p className="text-muted">{stat.value}</p>
					</div>
				))}
			</div>
		</section>
	);
}
