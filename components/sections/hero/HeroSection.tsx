import { HeroGlow } from '@/components/ui/HeroGlow';

import { HeroActions } from './HeroActions';
import { HeroCopy } from './HeroCopy';
import { HeroImagePanel } from './HeroImagePanel';

export function HeroSection() {
	return (
		<section className="mx-auto flex min-h-[82vh] w-full max-w-[78%] items-center justify-between gap-12 overflow-hidden xl:gap-20">
			<HeroGlow className="-top-24 -left-20 h-80 w-80" color="#2E8B57" opacityClass="opacity-[0.24]" />

			<HeroGlow className="top-20 right-1/4 h-125 w-125" color="#32CD32" opacityClass="opacity-20" />

			<HeroGlow className="top-1/6 left-[15%] h-64 w-64" color="#90EE90" opacityClass="opacity-[0.12]" />

			<HeroGlow className="bottom-20 left-1/4 h-100 w-100" color="#FFD700" opacityClass="opacity-15" />

			<HeroGlow className="bottom-0 right-[6%] h-96 w-96" color="#F4A460" opacityClass="opacity-[0.1]" />

			<HeroGlow className="top-[12%] right-[2%] h-56 w-56" color="#228B22" opacityClass="opacity-[0.1]" />

			<div className="relative z-10 flex max-w-xl flex-col gap-4">
				<HeroCopy />
				<HeroActions />
			</div>

			<HeroImagePanel />
		</section>
	);
}
