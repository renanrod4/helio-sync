import type { MockPanel, MockTelemetry } from './mockData';

export function getPanelTelemetry(telemetry: MockTelemetry[], panelId: string) {
    return telemetry
        .filter(entry => entry.panelId === panelId)
        .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
}

export function formatTimeLabel(value: number, timeZone: 'UTC' | 'local' = 'UTC') {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    if (timeZone !== 'local') {
        options.timeZone = timeZone;
    }

    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(value));
}

export function getLatestSyncTimestamp(panels: MockPanel[]) {
    if (panels.length === 0) {
        return Date.now();
    }

    return Math.max(...panels.map(panel => Date.parse(panel.lastSyncAt)));
}

export function computeDailyEnergyKwh(entries: MockTelemetry[], updateIntervalMin: number) {
    if (entries.length === 0) {
        return 0;
    }

    const latestTimestamp = Date.parse(entries[entries.length - 1].timestamp);
    const latestDate = new Date(latestTimestamp);
    const dayStart = new Date(Date.UTC(latestDate.getUTCFullYear(), latestDate.getUTCMonth(), latestDate.getUTCDate()));
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const dayEntries = entries.filter(entry => {
        const timestamp = Date.parse(entry.timestamp);
        return timestamp >= dayStart.getTime() && timestamp < dayEnd.getTime();
    });

    if (dayEntries.length === 0) {
        return 0;
    }

    let energyWh = 0;
    for (let index = 0; index < dayEntries.length; index += 1) {
        const current = dayEntries[index];
        const currentTime = Date.parse(current.timestamp);
        const nextTime =
            index < dayEntries.length - 1
                ? Date.parse(dayEntries[index + 1].timestamp)
                : currentTime + updateIntervalMin * 60 * 1000;
        const deltaHours = Math.max(nextTime - currentTime, 0) / (1000 * 60 * 60);
        energyWh += current.powerW * deltaHours;
    }

    return energyWh / 1000;
}

export function computeAverageVoltageDaylight(entries: MockTelemetry[], minVoltage = 0.1) {
    const daylightEntries = entries.filter(entry => entry.voltageV > minVoltage);
    if (daylightEntries.length === 0) {
        return 0;
    }
    const total = daylightEntries.reduce((sum, entry) => sum + entry.voltageV, 0);
    return total / daylightEntries.length;
}

export function computeDailyPeakVoltage(entries: MockTelemetry[], referenceDate = new Date()) {
    if (entries.length === 0) {
        return 0;
    }

    const dayStart = new Date(Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth(),
        referenceDate.getUTCDate(),
    ));
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const dayEntries = entries.filter(entry => {
        const timestamp = Date.parse(entry.timestamp);
        return timestamp >= dayStart.getTime() && timestamp < dayEnd.getTime();
    });

    if (dayEntries.length === 0) {
        return 0;
    }

    return Math.max(...dayEntries.map(entry => entry.voltageV));
}
