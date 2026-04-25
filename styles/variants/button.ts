import { tv, type VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[0.01em] transition-all duration-200 ease-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--helio-focus)]',
	variants: {
		variant: {
			// Botão verde sólido, principal call-to-action ("Explorar")
			explore:
				'h-12 min-w-36 px-7 text-base bg-helio-green text-helio-bg-tertiary shadow-[0_8px_20px_-12px_rgb(50_205_50_/_0.95)] hover:scale-[1.02] hover:shadow-[0_10px_25px_-15px_rgb(50_205_50_/_0.95)]',

			// Botão contornado, fundo translúcido, usado para ações secundárias ("Criar Conta")
			createAccount:
				'h-12 min-w-36 px-7 text-base border border-[rgb(243_255_233_/_0.22)] bg-[rgb(13_40_24_/_0.35)] text-foreground backdrop-blur-[1px] hover:border-[rgb(50_205_50_/_0.4)] hover:text-helio-green-light hover:bg-[rgb(13_40_24_/_0.5)]',

			// Botão dourado, destaque para login/entrar
			enter: 'h-11 min-w-28 px-6 text-xl bg-helio-gradient-gold text-helio-bg-tertiary shadow-[2px_2px_18px_-6px_rgb(255_215_0_/_0.95)] hover:brightness-110',

			// Botão dourado largo, usado para envio de mensagem ou ações de destaque em formulários
			sendMessage:
				'w-full py-4 px-8 text-lg bg-helio-gradient-gold text-helio-bg-tertiary hover:brightness-110 hover:scale-[1.01]',
		},
		iconPosition: {
			left: 'flex-row',
			right: 'flex-row-reverse',
		},
	},
	defaultVariants: {
		variant: 'explore',
		iconPosition: 'left',
	},
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
