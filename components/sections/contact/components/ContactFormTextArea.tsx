type ContactFormTextAreaProps = {
	id: string;
	name: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
};

export function ContactFormTextArea({ id, name, placeholder, value, onChange }: ContactFormTextAreaProps) {
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="block text-body font-medium text-secondary">
				{name.charAt(0).toUpperCase() + name.slice(1)}
			</label>
			<textarea
				id={id}
				name={name}
				placeholder={placeholder}
				required
				rows={6}
				value={value}
				onChange={event => onChange(event.target.value)}
				className="w-full resize-none rounded-2xl border border-foreground/12 bg-white/3 px-5 py-4 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
			/>
		</div>
	);
}
