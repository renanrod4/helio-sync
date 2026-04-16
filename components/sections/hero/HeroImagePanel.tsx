import Image from 'next/image';

export function HeroImagePanel() {
	return (
		<div className="relative z-10 hidden flex-1 hero-enter enter-delay-3 lg:block">
			<Image
				src="/images/hero-img.png"
				alt="Imagem de um campo"
				width={800}
				height={800}
				className="mx-auto h-112.5 w-full  rounded-4xl object-cover"
			/>
			{/* Painel de destaque com borda e fundo translúcido, posicionado sobre a imagem */}
			<div className="absolute bottom-4 left-1/2 flex h-[25%] w-[94%] -translate-x-1/2 items-center rounded-2xl border border-foreground/15 bg-foreground/10 p-4 text-sm backdrop-blur-sm hero-enter enter-delay-4">
				<div className="size-16 rounded-full bg-helio-gradient-gold" />
				<div className="ml-8 flex flex-col justify-center">
					<p className="text-lg text-primary">Eficiência aumentada em</p>
					<h3 className="text-gradient-green-light text-3xl font-medium">+50% vs painéis fixos</h3>
				</div>
			</div>
		</div>
	);
}
