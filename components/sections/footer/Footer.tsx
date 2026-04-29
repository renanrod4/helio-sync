'use client';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';

export default function Footer() {
	return (
		<footer className="bg-black/60 py-16 flex justify-between items-center px-20">
			<div className="flex items-center">
				<Image
					src="/images/logo.png"
					alt="Logo do HelioSync"
					width={80}
					height={80}
					className="mr-3 w-15 h-15 rounded-xl"
				/>
				<p>HelioSync &copy; {new Date().getFullYear()} - Todos os direitos reservados.</p>
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
