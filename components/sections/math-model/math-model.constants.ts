export type Accent = 'green' | 'gold';

export type EquationCardData = {
	symbol: string;
	title: string;
	subtitle: string;
	formula: string[];
	description: string;
	accent: Accent;
};

export type VariableData = {
	symbol: string;
	name: string;
	description: string;
	accent: Accent;
};

export const equationCards: EquationCardData[] = [
	{
		symbol: 'α',
		title: 'Elevação Solar',
		subtitle: 'Ângulo vertical do sol',
		formula: ['α = arcsin( sin(δ) · sin(φ) + cos(δ) ·', '        cos(φ) · cos(H) )'],
		description:
			'Calcula o ângulo de elevação do sol acima do horizonte, utilizado para determinar a inclinação vertical do painel lótus.',
		accent: 'green',
	},
	{
		symbol: 'A',
		title: 'Azimute Solar',
		subtitle: 'Ângulo horizontal do sol',
		formula: ['A = arctan( sin(H) / (sin(φ) · cos(H)', '      - cos(φ) · tan(δ)) )'],
		description:
			'Determina a direção horizontal do sol, permitindo que o painel gire para acompanhar o sol ao longo do dia.',
		accent: 'gold',
	},
];

export const variables: VariableData[] = [
	{
		symbol: 'α',
		name: 'Elevação Solar',
		description: 'Ângulo do sol acima do horizonte',
		accent: 'green',
	},
	{
		symbol: 'δ',
		name: 'Declinação Solar',
		description: 'Ângulo entre os raios solares e o plano equatorial',
		accent: 'gold',
	},
	{
		symbol: 'φ',
		name: 'Latitude',
		description: 'Latitude do observador na superfície terrestre',
		accent: 'green',
	},
	{
		symbol: 'H',
		name: 'Ângulo Horário',
		description: 'Deslocamento angular do sol em relação ao meridiano local',
		accent: 'gold',
	},
	{
		symbol: 'A',
		name: 'Azimute Solar',
		description: 'Ângulo horizontal do sol medido a partir do norte',
		accent: 'green',
	},
];

export const accentClasses: Record<
	Accent,
	{ colorVar: string; cardBorder: string; formulaColor: string; cardGradient: string; formulaSurface: string }
> = {
	green: {
		colorVar: '--helio-green',
		cardBorder: 'border-[rgb(50_205_50/0.28)]',
		formulaColor: 'text-helio-green',
		cardGradient: 'bg-[linear-gradient(145deg,rgba(8,42,20,0.25),rgba(3,20,10,0.22))]',
		formulaSurface: 'bg-[rgb(2_12_7/0.92)] border-[rgb(50_205_50/0.16)]',
	},
	gold: {
		colorVar: '--helio-gold',
		cardBorder: 'border-[rgb(255_215_0/0.28)]',
		formulaColor: 'text-helio-gold',
		cardGradient: 'bg-[linear-gradient(145deg,rgba(48,38,6,0.28),rgba(22,16,4,0.2))]',
		formulaSurface: 'bg-[rgb(12_10_3/0.9)] border-[rgb(255_215_0/0.16)]',
	},
};
