import { useMemo } from 'react';
import { degToRad, calculateSolarAngles } from '../utils/solar-calculations';

interface SolarTrackerProps {
	latitude: number;
	dayOfYear: number;
	hourAngle: number;
}

export function SolarTracker({ latitude, dayOfYear, hourAngle }: SolarTrackerProps) {
	const { alpha, azimute } = useMemo(() => {
		return calculateSolarAngles(latitude, dayOfYear, hourAngle);
	}, [latitude, dayOfYear, hourAngle]);

	// A posição do Sol no espaço 3D usando Azimute e Elevação (alpha)
	// No Three.js (e matemática padrão 3D de computação), Y é "para cima".
	// Vamos considerar Z como Norte/Sul e X como Leste/Oeste.
	const distance = 10; // A que distância fictícia o sol ficará do centro

	// Transformando Ângulos (graus) para Coordenadas 3D (X, Y, Z)
	// Y cresce de acordo com a Elevação (altura/alpha)
	// X e Z giram ao longo do chão (o horizonte/azimute)
	const sunX = Math.sin(azimute) * Math.cos(alpha) * distance;
	const sunY = Math.sin(alpha) * distance;
	const sunZ = -Math.cos(azimute) * Math.cos(alpha) * distance;

	// Lógica de "Desligamento" e Limites Mecânicos:
	const isNight = alpha < 0;
	// Se for noite: O painel entra no modo "descanso" com a face voltada totalmente para cima (Elevação 90 graus)
	// Se for dia: O painel não inclina mais de ~75 graus em relação ao horizonte para evitar falha do motor/vento, limitando o menor Alpha a ~15 graus.
	const minAlphaForPanel = degToRad(15);
	const panelAlpha = isNight ? degToRad(90) : Math.max(minAlphaForPanel, alpha);
	const panelAzimute = isNight ? 0 : azimute;

	return (
		<>
			{/* A noite, a luz ambiente fica mais escura para simular a ausência de sol */}
			<ambientLight intensity={isNight ? 0.3 : 0.2} />

			{/* Luz direcionada que age efetivamente como raios de Sol - desliga se estiver abaixo do horizonte */}
			<directionalLight position={[sunX, sunY, sunZ]} intensity={isNight ? 0 : 1.5} castShadow />

			{/* Esfera Amarela simulando visualmente onde o sol está flutuando */}
			<mesh position={[sunX, sunY, sunZ]}>
				<sphereGeometry args={[0.5, 32, 32]} />
				<meshBasicMaterial color={isNight ? '#333333' : '#fbbf24'} />
			</mesh>

			{/* Poste central Fixo, onde a placa vai ser fixada */}
			<mesh position={[0, 0.5, 0]} castShadow receiveShadow>
				<boxGeometry args={[0.5, 1, 0.5]} />
				<meshStandardMaterial color="#475569" />
			</mesh>

			{/* Grupo de motores do Rastreamento Solar (Gira horizontalmente [Y] e logo depois verticalmente [X]) */}
			{/* Usa as variáveis panelAzimute e panelAlpha com as lógicas de limites de noite */}
			<group position={[0, 1.1, 0]} rotation={[0, -panelAzimute, 0]}>
				<group rotation={[panelAlpha - Math.PI / 2, 0, 0]}>
					{/* Placa (Painel) presa em cima dos motores */}
					<mesh position={[0, 0, 0]} castShadow receiveShadow>
						<boxGeometry args={[3, 0.1, 2]} />
						<meshStandardMaterial color="#1e3a8a" />
					</mesh>
				</group>
			</group>

			{/* Piso/Chão, ele precisa sofrer uma rotação deitada (Math.PI / 2 -> 90 graus) senao ficaria em pé como um muro */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
				<planeGeometry args={[20, 20]} />
				<meshStandardMaterial color="#2d3748" />
			</mesh>
		</>
	);
}
