'use client';

import { SubmitEvent, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { ContactFormInput } from './ContactFormInput';
import { ContactFormTextArea } from './ContactFormTextArea';
import { ContactFeedback } from './ContactFeedback';

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

export function ContactForm() {
	const [formData, setFormData] = useState<ContactFormData>(initialFormData);
	const [isSending, setIsSending] = useState(false);
	const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	async function handleSubmit(event:  SubmitEvent<HTMLFormElement>) {
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
		<form className="space-y-6" aria-label="Formulario de contato" onSubmit={handleSubmit}>
			<ContactFormInput
				id="contact-name"
				name="name"
				type="text"
				placeholder="Seu nome"
				value={formData.name}
				onChange={value => setFormData(prev => ({ ...prev, name: value }))}
			/>
			<ContactFormInput
				id="contact-email"
				name="email"
				type="email"
				placeholder="seu@email.com"
				value={formData.email}
				onChange={value => setFormData(prev => ({ ...prev, email: value }))}
			/>
			<ContactFormTextArea
				id="contact-message"
				name="message"
				placeholder="Sua mensagem..."
				value={formData.message}
				onChange={value => setFormData(prev => ({ ...prev, message: value }))}
			/>

			<Button type="submit" variant="sendMessage" icon={FiSend} isLoading={isSending}>
				Enviar Mensagem
			</Button>

			{feedback && <ContactFeedback type={feedback.type} text={feedback.text} />}
		</form>
	);
}
