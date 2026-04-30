'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FiPlay, FiPause, FiFastForward, FiRewind } from 'react-icons/fi';
import { SolarTracker } from './components/SolarTracker';

export default function SimulatorContainer() {
	const [latitude, setLatitude] = useState(-23.55); // Aproximadamente a Latitude de São Paulo
	const [dayOfYear, setDayOfYear] = useState(172); // Ao redor do dia 21 de Junho
	const [hourAngle, setHourAngle] = useState(0); // 0 ângulo horário, ou seja, exatos "Meio Dia"

	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(1);

	useEffect(() => {
		let animationFrameId: number;
		let lastTime = performance.now();

		const loop = (time: number) => {
			const deltaMs = time - lastTime;
			lastTime = time;

			if (isPlaying) {
				// Avança 15 graus (1 hora real) a cada segundo quando a simulação está na velocidade 1x
				const degreesPerMs = 15 / 1000;
				const deltaAng = degreesPerMs * speed * deltaMs;

				setHourAngle(prev => {
					let next = prev + deltaAng;
					// Se virou o dia, ajusta o ângulo e passa pro próximo dia no ano
					if (next > 180) {
						next -= 360;
						setDayOfYear(prevDay => (prevDay >= 365 ? 1 : prevDay + 1));
					} else if (next < -180) {
						next += 360;
						setDayOfYear(prevDay => (prevDay <= 1 ? 365 : prevDay - 1));
					}
					return next;
				});
			}
			animationFrameId = requestAnimationFrame(loop);
		};

		animationFrameId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animationFrameId);
	}, [isPlaying, speed]);

	return (
		<div className="flex h-full w-full flex-col gap-4">
			<div className="relative h-64 min-h-75 w-full flex-1 md:h-full">
				<Canvas camera={{ position: [5, 5, 5], fov: 50 }} shadows>
					<OrbitControls makeDefault />
					<SolarTracker latitude={latitude} dayOfYear={dayOfYear} hourAngle={hourAngle} />
				</Canvas>
			</div>

			{/* Painel de Controles abaixo do 3D simulando o ambiente com os Sliders(ranges) */}
			<div className="flex flex-col gap-3 rounded-xl bg-white/5 p-4 backdrop-blur-sm">
				{/* Controles de Simulação Animada */}
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-4">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setIsPlaying(!isPlaying)}
							className="flex h-11 w-11 items-center justify-center rounded-full bg-helio-gold text-helio-bg-secondary transition-transform hover:scale-105 active:scale-95"
							aria-label={isPlaying ? 'Pausar simulação' : 'Iniciar simulação'}
						>
							{isPlaying ? <FiPause size={20} /> : <FiPlay size={20} className="ml-1" />}
						</button>
						<span className="text-body font-medium text-secondary">
							{isPlaying ? 'Simulando ao vivo' : 'Simulador Pausado'}
						</span>
					</div>

					<div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-white/5 p-1">
						<button
							onClick={() => setSpeed(s => Math.max(0.5, s - 0.5))}
							className="flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-white/10 hover:text-primary"
							title="Desacelerar"
						>
							<FiRewind size={16} />
						</button>
						<span className="w-10 text-center font-mono text-sm text-secondary">{speed.toFixed(1)}x</span>
						<button
							onClick={() => setSpeed(s => Math.min(24, s + 0.5))}
							className="flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors hover:bg-white/10 hover:text-primary"
							title="Acelerar"
						>
							<FiFastForward size={16} />
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-1 pt-2">
					<label className="text-sm text-secondary">Latitude: {latitude.toFixed(2)}°</label>
					<input
						type="range"
						min="-90"
						max="90"
						value={latitude}
						onChange={e => setLatitude(parseFloat(e.target.value))}
						className="accent-helio-gold"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-sm text-secondary">Dia do Ano (1-365): {dayOfYear}</label>
					<input
						type="range"
						min="1"
						max="365"
						value={dayOfYear}
						onChange={e => setDayOfYear(parseInt(e.target.value))}
						className="accent-helio-gold"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label className="text-sm text-secondary">
						Ângulo Horário: {hourAngle.toFixed(2)}° ({Math.floor(hourAngle / 15) + 12}:
						{Math.abs(Math.floor((hourAngle % 15) * 4))
							.toString()
							.padStart(2, '0')}
						)
					</label>
					<input
						type="range"
						min="-180"
						max="180"
						value={hourAngle}
						onChange={e => setHourAngle(parseFloat(e.target.value))}
						className="accent-helio-gold"
					/>
				</div>
			</div>
		</div>
	);
}
