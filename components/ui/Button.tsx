import type { ButtonHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';

import { buttonVariants, type ButtonVariantProps } from '@/styles/variants/button';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
	ButtonVariantProps & {
		icon?: IconType;
		iconClassName?: string;
		isLoading?: boolean;
	};

export function Button({
	children,
	className,
	icon: Icon,
	iconClassName,
	isLoading,
	disabled,
	variant,
	iconPosition,
	...props
}: ButtonProps) {
	const isDisabled = disabled || isLoading;

	return (
		<button
			className={buttonVariants({
				variant,
				iconPosition,
				class: className,
			})}
			disabled={isDisabled}
			{...props}
		>
			{Icon ? <Icon className={iconClassName} aria-hidden="true" /> : null}

			<span>{isLoading ? 'Carregando...' : children}</span>
		</button>
	);
}
