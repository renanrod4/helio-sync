type HeaderHamburgerButtonProps = {
	isOpen: boolean;
	onClick: () => void;
};

export function HeaderHamburgerButton({ isOpen, onClick }: HeaderHamburgerButtonProps) {
	return (
		<button
			type="button"
			className="group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-primary transition-colors duration-300 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-helio-focus lg:hidden"
			onClick={onClick}
			aria-expanded={isOpen}
			aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
		>
			<span
				className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
					isOpen ? 'translate-y-0 rotate-45' : '-translate-y-2'
				}`}
			/>
			<span
				className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
					isOpen ? 'opacity-0' : 'opacity-100'
				}`}
			/>
			<span
				className={`absolute h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
					isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-2'
				}`}
			/>
		</button>
	);
}
