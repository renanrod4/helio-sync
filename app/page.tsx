import { HeroSection } from '@/components/sections/hero/HeroSection';

export default function Home() {
	return (
		<main className="isolate min-h-screen overflow-hidden bg-helio-hero px-6 py-14 text-foreground md:px-12">
			<HeroSection />
		</main>
	);
}
