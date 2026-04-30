type ContactFeedbackProps = {
	type: 'success' | 'error';
	text: string;
};

export function ContactFeedback({ type, text }: ContactFeedbackProps) {
	return (
		<p className={`text-center text-caption ${type === 'success' ? 'text-helio-green-light' : 'text-helio-amber'}`}>
			{text}
		</p>
	);
}
