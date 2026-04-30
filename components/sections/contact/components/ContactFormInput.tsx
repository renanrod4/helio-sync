type ContactFormInputProps = {
	id: string;
	name: string;
	type: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
};

export function ContactFormInput({ id, name, type, placeholder, value, onChange }: ContactFormInputProps) {
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="block text-body font-medium text-secondary">
				{name.charAt(0).toUpperCase() + name.slice(1)}
			</label>
			<input
				id={id}
				name={name}
				type={type}
				placeholder={placeholder}
				required
				value={value}
				onChange={event => onChange(event.target.value)}
				className="h-13 w-full rounded-2xl border border-foreground/12 bg-white/3 px-5 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
			/>
		</div>
	);
}
