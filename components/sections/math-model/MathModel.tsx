import { HeroGlow } from '@/components/ui/HeroGlow';
import { EquationCard } from './components/EquationCard';
import { VariableCard } from './components/VariableCard';
import { equationCards, variables } from './math-model.constants';

export default function MathModel() {
	return (
		<section className="relative bg-helio-bg-secondary py-20">
			<HeroGlow
				className="-top-10 left-1/2 h-80 w-160 -translate-x-1/2"
				color="#228b22"
				opacityClass="opacity-18"
				shape="oval"
			/>

			<div className="relative z-10 mx-auto flex w-full flex-col items-center px-5 sm:px-6 md:px-10 lg:px-12 min-[1920px]:max-w-[78%]">
				<h1 className="text-title mb-6">
					O <span className="text-gradient-gold">Modelo Matemático</span>
				</h1>
				<p className="max-w-3xl text-center text-lead text-secondary">
					O rastreamento solar do HelioSync é baseado em equações astronômicas que determinam a posição exata
					do sol a qualquer momento.
				</p>

				<div className="mt-8 grid w-full gap-8 xl:grid-cols-[1.05fr_1fr]">
					<div className="space-y-6">
						{equationCards.map(card => (
							<EquationCard key={card.symbol} card={card} />
						))}
					</div>

					<aside className="rounded-3xl border border-[rgb(255_255_255/0.15)] bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 backdrop-blur-sm sm:p-8">
						<h2 className="flex items-center gap-3 text-lead font-bold text-primary">
							<span className="text-muted">(x)</span>
							Variáveis do Modelo
						</h2>

						<div className="mt-6 space-y-5">
							{variables.map(item => (
								<VariableCard key={item.symbol + item.name} item={item} />
							))}
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
