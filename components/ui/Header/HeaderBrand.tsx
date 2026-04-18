import Image from 'next/image';

export function HeaderBrand() {
	return (
		<div className="flex items-center">
			<Image
				src="/images/logo.png"
				alt="Logo da HelioSync"
				width={50}
				height={50}
				className="mr-2 h-10 w-10 rounded-2xl sm:h-12 sm:w-12"
			/>
			<p className="text-[1.2rem] leading-[1.2] text-primary sm:text-brand">
				Helio<span className="text-gradient-gold">Sync</span>
			</p>
		</div>
	);
}
