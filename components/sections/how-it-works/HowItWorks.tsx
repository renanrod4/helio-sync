import { IconBadge } from '@/components/ui/IconBadge';
import Image from 'next/image';
const steps = [
	{
		title: 'Modelo Matemático',
		desc: 'Algoritmo calcula a posição do sol em tempo real com base em latitude, longitude e hora.',
	},
	{
		title: 'Inclinação Automática',
		desc: 'A placa em formato de lótus se inclina automaticamente para maximizar a captação solar.',
	},
	{
		title: 'Geração Otimizada',
		desc: 'Captação de energia até 50% superior aos painéis fixos convencionais.',
	},
];

export default function HowItWorks() {
	return (
		<section
			id="sobre"
			className="flex scroll-mt-28 flex-col items-center justify-center gap-10 px-4 py-12 text-center sm:px-6 md:gap-14 md:px-10 lg:flex-row lg:gap-20 lg:px-12 lg:py-16"
			style={{
				background: 'linear-gradient(180deg, var(--helio-bg-secondary) , var(--helio-bg-primary) 300px)',
			}}
		>
			<div className="relative w-full max-w-150 aspect-3/2 sm:aspect-5/3 lg:flex-1">
				<Image
					src="/images/lotus-flower.png"
					alt="Lotus Flower"
					fill
					className="rounded-3xl object-cover object-[center_40%] shadow-2xl"
				/>
				<div className="absolute bottom-4 right-4 flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-helio-green/20 bg-helio-green/10 p-3 shadow-lg backdrop-blur-md sm:bottom-6 sm:right-6 sm:p-4">
					<h3 className="text-3xl font-bold leading-6 text-gradient-green-light sm:text-4xl">∞</h3>
					<p className="text-xs font-medium text-muted sm:text-sm">Energia Limpa</p>
				</div>
			</div>
			<div className="w-full max-w-150 text-left lg:flex-1">
				<h2 className="mb-4 text-title text-left">
					Como <span className="text-gradient-green-light">funciona</span>?
				</h2>
				<p className="text-lead text-muted">
					Inspirada na flor de lótus, nossa placa solar rastreia o sol usando um modelo matemático preciso.
				</p>
				<div className="mt-8 flex flex-col gap-6">
					{steps.map((step, index) => (
						<div key={index} className="flex items-start gap-4">
							<div className="shrink-0">
								<IconBadge label={`0${index + 1}`} colorVar="--helio-green" />
							</div>
							<div>
								<h3 className="text-subtitle font-semibold">{step.title}</h3>
								<p className="text-body text-muted">{step.desc}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
