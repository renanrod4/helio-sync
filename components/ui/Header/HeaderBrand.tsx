import Image from 'next/image';

export function HeaderBrand() {
	return (
		<div className="flex max-w-300 items-center">
			<Image
				src="/images/logo.png"
				alt="Logo da HelioSync"
				width={50}
				height={50}
				className="mr-2 rounded-2xl"
			/>
			<p className="text-2xl">
				Helio<span className="text-gradient-gold">Sync</span>
			</p>
		</div>
	);
}
