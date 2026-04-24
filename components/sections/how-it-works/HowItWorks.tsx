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
			className="py-16 px-4 flex text-center justify-center items-center gap-20"
			style={{
				background: 'linear-gradient(180deg, var(--helio-bg-secondary) , var(--helio-bg-primary) 300px)',
			}}
		>
			<div className="relative flex-1 max-w-150 mb-8 aspect-3/2">
				<Image
					src="/images/lotus-flower.png"
					alt="Lotus Flower"
					fill
					className="object-cover object-[center_40%] rounded-3xl shadow-2xl"
				/>
				<div
					className="absolute bottom-0 right-0 translate-1/5 
                flex flex-col items-center justify-center gap-1
                aspect-square p-4 bg-helio-green/10 backdrop-blur-md 
                rounded-3xl border border-helio-green/20 shadow-lg"
				>
					<h3 className="text-4xl font-bold text-gradient-green-light leading-6">∞</h3>
					<p className="text-sm font-medium text-muted">Energia Limpa</p>
				</div>
			</div>
			<div className="flex-1 max-w-150 text-left">
                <h2 className="text-title mb-4 text-left!">Como <span className='text-gradient-green-light'>funciona</span>?</h2>
                <p className="text-lead text-muted ">
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
