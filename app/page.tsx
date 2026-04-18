import { HeroSection } from '@/components/sections/hero/HeroSection';
import Header from '../components/ui/Header/Header';
import Features from '@/components/sections/features/Features';
import MathModel from '@/components/sections/math-model/MathModel';
import Simulator from '@/components/sections/simulator/Simulator';

export default function Home() {
	return (
		<main className="isolate min-h-screen overflow-hidden bg-helio-hero text-foreground">
			<Header />
			<HeroSection />
			<Features/>
			<MathModel />
			<Simulator/>
		</main>
	);
}
