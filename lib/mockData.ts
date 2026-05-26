export type MockUser = {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'operator' | 'viewer';
	createdAt: string;
};

export type MockPanel = {
	id: string;
	label: string;
	latitude: number;
	longitude: number;
	status: 'online' | 'offline' | 'maintenance';
	currentAngleAzimuth: number;
	currentAngleElevation: number;
	petalsStatus: 'open' | 'closed' | 'moving';
	lastSyncAt: string;
};

export type MockTelemetry = {
	id: string;
	panelId: string;
	timestamp: string;
	voltageV: number;
	powerW: number;
	angleDeg: number;
};

export type MockAlert = {
	id: string;
	panelId: string;
	type: 'performance' | 'connection' | 'maintenance';
	severity: 'low' | 'medium' | 'high';
	message: string;
	createdAt: string;
};

export const mockUsers: MockUser[] = [
	
];

export const mockPanels: MockPanel[] = [
	{
		id: 'pnl_001',
		label: 'Helio-Alpha',
		latitude: -23.499528,
		longitude: -47.400944,
		status: 'online',
		currentAngleAzimuth: 116.2,
		currentAngleElevation: 34.8,
		petalsStatus: 'open',
		lastSyncAt: '2026-06-02T20:00:00Z',
	}
];

export const mockTelemetry: MockTelemetry[] = [
	{
		id: 'tel_6336',
		panelId: 'pnl_006',
		timestamp: '2026-06-02T20:00:00Z',
		voltageV: 0.0,
		powerW: 0,
		angleDeg: 5.0,
	}
];

export const mockAlerts: MockAlert[] = [
	{
		id: 'alt_001',
		panelId: 'pnl_002',
		type: 'maintenance',
		severity: 'medium',
		message: 'Inspecao preventiva recomendada.',
		createdAt: '2026-05-04T16:00:00Z',
	},
	{
		id: 'alt_002',
		panelId: 'pnl_003',
		type: 'connection',
		severity: 'high',
		message: 'Painel sem comunicacao ha mais de 12 horas.',
		createdAt: '2026-05-03T18:30:00Z',
	},
];
