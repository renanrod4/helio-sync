'use client';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';

export default function Footer() {
	return (
		<footer className="flex flex-col items-center gap-6 bg-black/60 px-5 py-10 text-center sm:flex-row sm:justify-between sm:px-8 sm:py-12 sm:text-left lg:px-20">
			<div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
				<Image
					src="/images/logo.png"
					alt="Logo do HelioSync"
					width={80}
					height={80}
					className="h-12 w-12 rounded-xl sm:h-15 sm:w-15"
				/>
				<p className="text-sm text-secondary sm:text-base">
					HelioSync &copy; {new Date().getFullYear()} - Todos os direitos reservados.
				</p>
			</div>
			<div>
				<Button
					variant="sendMessage"
					icon={FaInstagram}
					className="py-2"
					onClick={() => window.open('https://www.instagram.com/heliosyncenterprise/', '_blank')}
				>
					Nos siga no instagram
				</Button>
			</div>
		</footer>
	);
}
