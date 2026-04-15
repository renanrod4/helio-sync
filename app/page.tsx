import { HeroGlow } from '@/components/ui/HeroGlow';

export default function Home() {
	return (
		<main className="relative isolate min-h-screen overflow-hidden bg-helio-hero px-6 py-14 text-foreground md:px-12">
			<HeroGlow className="top-20 right-1/4 h-125 w-125" color="#32CD32" opacityClass="opacity-20" />
			<HeroGlow className="bottom-20 left-1/4 h-100 w-100" color="#FFD700" opacityClass="opacity-15" />
		</main>
	);
}
