'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { FiSend } from 'react-icons/fi';

type ContactFormData = {
	name: string;
	email: string;
	message: string;
};

const initialFormData: ContactFormData = {
	name: '',
	email: '',
	message: '',
};

export default function Contact() {
	const [formData, setFormData] = useState<ContactFormData>(initialFormData);
	const [isSending, setIsSending] = useState(false);
	const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSending(true);
		setFeedback(null);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const result = await response.json().catch(() => null);

			if (!response.ok) {
				setFeedback({
					type: 'error',
					text: result?.message ?? 'Nao foi possivel enviar sua mensagem agora.',
				});
				return;
			}

			setFeedback({
				type: 'success',
				text: 'Mensagem enviada com sucesso! Em breve entraremos em contato.',
			});
			setFormData(initialFormData);
		} catch {
			setFeedback({
				type: 'error',
				text: 'Falha de conexao. Tente novamente em instantes.',
			});
		} finally {
			setIsSending(false);
		}
	}

	return (
		<section
			className="relative overflow-hidden bg-helio-bg-secondary px-5 py-16 sm:px-6 md:px-10 lg:px-12"
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
					<form className="space-y-6" aria-label="Formulario de contato" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<label htmlFor="contact-name" className="block text-body font-medium text-secondary">
								Nome
							</label>
							<input
								id="contact-name"
								name="name"
								type="text"
								placeholder="Seu nome"
								required
								value={formData.name}
								onChange={event => setFormData(prev => ({ ...prev, name: event.target.value }))}
								className="h-13 w-full rounded-2xl border border-foreground/12 bg-white/3 px-5 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="contact-email" className="block text-body font-medium text-secondary">
								Email
							</label>
							<input
								id="contact-email"
								name="email"
								type="email"
								placeholder="seu@email.com"
								required
								value={formData.email}
								onChange={event => setFormData(prev => ({ ...prev, email: event.target.value }))}
								className="h-13 w-full rounded-2xl border border-foreground/12 bg-white/3 px-5 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="contact-message" className="block text-body font-medium text-secondary">
								Mensagem
							</label>
							<textarea
								id="contact-message"
								name="message"
								placeholder="Sua mensagem..."
								required
								rows={6}
								value={formData.message}
								onChange={event => setFormData(prev => ({ ...prev, message: event.target.value }))}
								className="w-full resize-none rounded-2xl border border-foreground/12 bg-white/3 px-5 py-4 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
							/>
						</div>

						<Button type="submit" variant="sendMessage" icon={FiSend} isLoading={isSending}>
							Enviar Mensagem
						</Button>

						{feedback ? (
							<p
								className={`text-center text-caption ${
									feedback.type === 'success' ? 'text-helio-green-light' : 'text-helio-amber'
								}`}
							>
								{feedback.text}
							</p>
						) : null}
					</form>
				</div>
			</div>
		</section>
	);
}
