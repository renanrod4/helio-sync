import { HeroSection } from '@/components/sections/hero/HeroSection';
import Header from '../components/ui/Header/Header';
import Features from '@/components/sections/features/Features';
import MathModel from '@/components/sections/math-model/MathModel';
import Simulator from '@/components/sections/simulator/Simulator';
import { SectionDivider } from '@/components/ui/SectionDivider';
import Statistics from '@/components/sections/statistics/Statistics';

export default function Home() {
	return (
		<main className="isolate min-h-screen overflow-hidden text-foreground">
			<Header />
			<HeroSection />
			<SectionDivider />
			<Features />
			<MathModel />
			<Simulator />
			<Statistics />
		</main>
	);
}
