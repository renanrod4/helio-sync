import { ContactForm } from './components/ContactForm';

export default function Contact() {
	return (
		<section
			id="contato"
			className="relative scroll-mt-28 overflow-hidden bg-helio-bg-secondary px-5 py-16 sm:px-6 md:px-10 lg:px-12"
			style={{
				background:
					'radial-gradient(circle at 50% 46%, rgb(50 205 50 / 0.13) 0%, transparent 38%), linear-gradient(180deg, var(--helio-bg-primary), var(--helio-bg-secondary))',
			}}
		>
			<div className="pointer-events-none absolute top-14 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-helio-gold/8 blur-3xl" />

			<div className="relative z-10 mx-auto w-full max-w-2xl">
				<h2 className="mb-6 text-title">
					Fale <span className="text-gradient-gold">Conosco</span>
				</h2>

				<p className="mx-auto mb-12 max-w-2xl text-center text-lead text-secondary">
					Tem interesse no projeto? Entre em contato com a equipe HelioSync.
				</p>

				<div className="rounded-3xl border border-foreground/10 bg-white/2 px-5 py-8 shadow-[0_16px_70px_rgb(0_0_0/0.35)] backdrop-blur-sm sm:px-8 sm:py-10">
					<ContactForm />
				</div>
			</div>
		</section>
	);
}
