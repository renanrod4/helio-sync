import type { TelemetryEntry } from '@/lib/models/userDashboardData';

export const CO2_KG_PER_KWH = 0.025;

function getLatestTimestamp(entries: TelemetryEntry[]) {
	if (entries.length === 0) {
		return Date.now();
	}

	return Math.max(...entries.map(entry => Date.parse(entry.timestamp)));
}

function groupTelemetryByPanel(entries: TelemetryEntry[]) {
	const grouped = new Map<string, TelemetryEntry[]>();

	for (const entry of entries) {
		const current = grouped.get(entry.panelId) ?? [];
		current.push(entry);
		grouped.set(entry.panelId, current);
	}

	return grouped;
}

function computeEnergyKwh(entries: TelemetryEntry[]) {
	if (entries.length < 2) {
		return 0;
	}

	const sorted = [...entries].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
	let totalKwh = 0;

	for (let index = 0; index < sorted.length - 1; index += 1) {
		const current = sorted[index];
		const next = sorted[index + 1];
		const deltaHours = (Date.parse(next.timestamp) - Date.parse(current.timestamp)) / 3_600_000;
		if (deltaHours <= 0) {
			continue;
		}

		totalKwh += (current.powerW * deltaHours) / 1000;
	}

	return totalKwh;
}

export function computeTotalEnergy(entries: TelemetryEntry[] = []) {
	const grouped = groupTelemetryByPanel(entries);
	let total = 0;

	for (const panelEntries of grouped.values()) {
		total += computeEnergyKwh(panelEntries);
	}

	return total;
}

export function computeMonthlyEnergy(entries: TelemetryEntry[] = []) {
	const monthlyEntries = filterTelemetryForMonth(entries);
	return computeTotalEnergy(monthlyEntries);
}

export function getMonthLabel(entries: TelemetryEntry[] = []) {
	return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
		new Date(getLatestTimestamp(entries)),
	);
}

function filterTelemetryForMonth(entries: TelemetryEntry[]) {
	if (entries.length === 0) {
		return entries;
	}

	const latest = new Date(getLatestTimestamp(entries));
	const month = latest.getMonth();
	const year = latest.getFullYear();

	return entries.filter(entry => {
		const date = new Date(entry.timestamp);
		return date.getMonth() === month && date.getFullYear() === year;
	});
}
